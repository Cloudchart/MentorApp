import React, {
  Component,
  Text,
  TouchableOpacity,
  View,
  AlertIOS,
  ActionSheetIOS,
  Animated,
  Dimensions
} from 'react-native'
import Relay from 'react-relay'
import { _ } from 'lodash'
import { Button, Loader, ScrollListView, TopicSubscribed } from '../../components'
import {
  CONTROL_PIECE,
  CONTROLS_WIDTH,
  SHARE_CARD_REF,
  ADD_CARD_REF,
} from '../../components/insight/const'
import * as device from '../../utils/device'
import Icon from 'react-native-vector-icons/FontAwesome'
import baseStyle from '../../styles/base'
import clamp from 'clamp'
import LikeInsightInTopicMutation from '../../mutations/like-insight-in-topic'
import DislikeInsightInTopicMutation from '../../mutations/dislike-insight-in-topic'
import {
  CommentGood,
  CommentBad,
} from '../../components/confirmation-screens/insights-parts'
import {
  ShareCard,
  AddCard
} from './popup-controls'
import createInsightCardPanResponder from './pan-responder'
import Insight, {
  animateEntrance,
  animationCardRight,
  animationCardLeft,
  animateReturnCardToStartPosition,
} from '../../components/insight'
import styles from './styles'


const dimensions = Dimensions.get('window')

class InsightCard extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      top: dimensions.height / 4.5,
      isDetailsVisible: false,
      isPendingForInsight: null,
      reaction: null,
    }
    this._shareControl = new Animated.ValueXY({ x: 0, y: 0 })
    this._addControl = new Animated.ValueXY({ x: 0, y: 0 })
    this._pan = new Animated.ValueXY()
    this._enter = new Animated.Value(0.9)
  }

  componentWillMount() {
    this._panResponder = createInsightCardPanResponder(this)
  }

  componentWillReceiveProps(nextProps) {
    const currentInsight = this.props.insight
    const nextInsight = nextProps.insight
    if (nextInsight.node.id !== currentInsight.node.id) {
      this._resetState()
    }
  }

  handleCardPress() {
    const { isDetailsVisible } = this.state
    this.setState({
      isDetailsVisible: !isDetailsVisible,
    })
  }

  handleLikePress() {
    const { _pan } = this
    animationCardRight(_pan, () => this._requestLikeRate())
  }

  handleDislikePress(params) {
    const { _pan } = this
    animationCardLeft(params || {}, _pan, () => this._requestDislikeRate())
  }

  handleAddControlPress() {
    const { navigator, insight } = this.props
    navigator.push({
      scene: 'user-collections',
      title: 'Add to collection',
      insightNode: insight.node
    })
  }

  handleShareControlPress() {
    const { node } = this.props.insight
    ActionSheetIOS.showShareActionSheetWithOptions(
      {
        url: node.origin.url || '',
        message: node.content,
        subject: 'a subject to go in the email heading'
      },
      error => {},
      (success, method) => {
        console.log({ success, method })
      }
    )
  }

  handleNextInsightPress() {
    const { filter } = this.props
    const { reaction } = this.state
    if (filter === 'PREVIEW') {
      // We can ignore mutations
      return
    }
    if (reaction.type === 'like') {
      this._requestLikeMutation(true)
    } else {
      this._requestDislikeMutation()
    }
  }

  handleUndoRatePress() {
    this.setState({
      reaction: null,
      isPendingForInsight: null,
    })
    this.returnCardToStartPosition()
    this._resetState()
  }

  _requestLikeRate() {
    const { insight } = this.props
    const basicReaction = insight.node.likeReaction
    if (basicReaction) {
      const reaction = {
        type: 'like',
        ...basicReaction,
      }
      this.setState({ reaction })
    } else {
      this._requestLikeMutation(true)
    }
  }

  _requestLikeMutation(shouldAddToUserCollectionWithTopicName) {
    const { user, insight } = this.props
    const insightID = insight.node.id
    this.setState({
      isPendingForInsight: insightID,
      reaction: null,
    })
    const mutation = new LikeInsightInTopicMutation({
      topic: insight.topic,
      insight: insight.node,
      user: user,
      shouldAddToUserCollectionWithTopicName,
    })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: response => {
        if (response.topic && response.topic.isFinishedByViewer) {
          this.props.handleTopicFinish();
        }
      }
    })
  }

  _requestDislikeRate() {
    const { insight } = this.props
    const basicReaction = insight.node.dislikeReaction
    if (basicReaction) {
      const reaction = {
        type: 'dislike',
        ...basicReaction,
      }
      this.setState({ reaction })
    } else {
      this._requestDislikeMutation()
    }
  }

  _requestDislikeMutation() {
    const { user, insight } = this.props
    const insightID = insight.node.id
    this.setState({
      isPendingForInsight: insightID,
      reaction: null,
    })
    const mutation = new DislikeInsightInTopicMutation({
      topic: insight.topic,
      insight: insight.node,
      user: user,
    })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: response => {
        if (response.topic && response.topic.isFinishedByViewer) {
          this.props.handleTopicFinish()
        }
      }
    })
  }

  returnCardToStartPosition() {
    animateReturnCardToStartPosition(this._pan)
  }

  showPopupControls() {
    const { filter } = this.props
    if (filter && filter == 'PREVIEW') {
      return
    }
    const { _pan } = this
    if (_pan.__getValue().x > 50) {
      if (!this._isPopupControlsVisible) {
        this._isPopupControlsVisible = true
        const param = {
          toValue: CONTROL_PIECE,
          duration: 200,
          friction: device.size(9 * 1.2)
        }
        setTimeout(() => {
          Animated.spring(this._addControl, param).start()
          Animated.spring(this._shareControl, param).start()
        }, 0)
      }
    }
  }

  hidePopupControls() {
    this._isPopupControlsVisible = false
    const params = {
      toValue: 0,
      duration: 100,
      friction: 8,
    }
    setTimeout(() => {
      Animated.spring(this._addControl, params).start()
      Animated.spring(this._shareControl, params).start()
    }, 0)
  }

  _resetState() {
    this._pan.setValue({ x: 0, y: 0 })
    this._enter.setValue(0.9)
    this.hidePopupControls()
    animateEntrance(this._enter)
  }

  _renderReaction() {
    const { navigator } = this.props
    const { reaction } = this.state
    if (reaction.type === 'like') {
      return (
        <CommentGood
          {...reaction}
          navigator={navigator}
          handleNext={() => this.handleNextInsightPress()}
          />
      )
    }
    // Otherwise it means dislike
    return (
      <CommentBad
        {...reaction}
        navigator={navigator}
        handleNext={() => this.handleNextInsightPress()}
        handleUndo={() => this.handleUndoRatePress()}
        />
    )
  }

  _renderCard() {
    const { navigator, insight } = this.props
    const { isScaling, isDetailsVisible } = this.state
    const {
      _top,
      _pan,
      _enter,
      _shareControl,
      _addControl,
    } = this
    const [ translateX, translateY ] = [ _pan.x, _pan.y ]
    const rotate = _pan.x.interpolate({
      inputRange: [ -200, 0, 200 ],
      outputRange: [ "-30deg", "0deg", "30deg" ],
    })
    const opacity = _pan.x.interpolate({
      inputRange: [ -200, 0, 200 ],
      outputRange: [ 0.5, 1, 0.5 ],
    })
    const scale = _enter
    const animatedCardStyles = {
      transform: [
        { translateX },
        { translateY },
        { rotate },
        { scale }
      ],
      opacity,
    }
    const yupScale = _pan.x.interpolate({
      inputRange: [ 0, 150 ],
      outputRange: [ 0.8, 1 ],
      extrapolate: 'clamp',
    })
    const animatedYupStyles = {
      transform: [ { scale: yupScale } ],
    }
    const nopeScale = _pan.x.interpolate({
      inputRange: [ -150, 0 ],
      outputRange: [ 1, 0.8 ],
      extrapolate: 'clamp',
    })
    const animatedNopeStyles = {
      transform: [ { scale: nopeScale } ],
    }
    const interpolateControls = {
      inputRange: [ 0, CONTROL_PIECE, CONTROLS_WIDTH ],
      outputRange: [ 0, -CONTROL_PIECE, -CONTROLS_WIDTH ],
      extrapolate: 'clamp',
    }
    const popupToolbarStyle = [
      styles.wrapperAddCardControl,
      { top: _top },
    ]
    const shareButtonTranslate = _shareControl.x.interpolate(interpolateControls)
    const shareButtonTransform = [
      { translateX: shareButtonTranslate },
    ]
    const shareButtonStyle = [
      { width: CONTROLS_WIDTH },
      { transform: shareButtonTransform },
    ]
    const addButtonTranslate = _addControl.x.interpolate(interpolateControls)
    const addButtonTransform = [
      { translateX: addButtonTranslate },
    ]
    const addButtonStyle = [
      { width: CONTROLS_WIDTH },
      { transform: addButtonTransform },
    ]
    return (
      <View style={styles.container}>
        {isDetailsVisible && (
          <InsightTitle topicName={insight.topic.name ||  '' } />
        )}
        <Animated.View
          style={[styles.card, animatedCardStyles]}
          {...this._panResponder.panHandlers}
          >
          <Insight
            style={{alignSelf: 'center'}}
            navigator={navigator}
            insight={insight.node}
            onCardPress={() => this.handleCardPress()}
            onScalingStateChange={isScaling => this.setState({ isScaling })}
            />
        </Animated.View>
        <View style={popupToolbarStyle}>
          <Animated.View style={shareButtonStyle}>
            <View ref={SHARE_CARD_REF} style={{flex: 1}}>
              <ShareCard />
            </View>
          </Animated.View>
          <Animated.View style={addButtonStyle}>
            <View ref={ADD_CARD_REF} style={{flex: 1}}>
              <AddCard />
            </View>
          </Animated.View>
        </View>
        {!isScaling && !isDetailsVisible && (
          <RateButtons
            handlePositive={_.throttle(() => this.handleLikePress(), 700)}
            handleNegative={_.throttle(() => this.handleDislikePress(), 700)}
            {...{animatedNopeStyles, animatedYupStyles}}
            />
        )}
      </View>
    )
  }

  render() {
    const { insight } = this.props
    const { isPendingForInsight, reaction } = this.state
    const insightID = insight.node.id
    if (isPendingForInsight === insightID) {
      return (
        <Loader />
      )
    }
    if (reaction) {
      return this._renderReaction()
    }
    return this._renderCard()
  }
}

const InsightTitle = ({ topicName }) => (
  <View style={styles.titleAdvice}>
    <Text style={styles.titleAdviceText}>
      {topicName}
    </Text>
  </View>
)

const RateButtons = props => (
  <View style={styles.controlWrapper}>
    <Animated.View style={[styles.controlLeft, props.animatedNopeStyles]}>
      <TouchableOpacity
        activeOpacity={0.95}
        style={[styles.controlInner, {paddingTop: 0, left : -1}]}
        onPress={props.handleNegative}
        >
        <Icon name="times" style={[baseStyle.crumbIcon, styles.icons]}/>
      </TouchableOpacity>
    </Animated.View>
    <Animated.View style={[styles.controlRight, props.animatedYupStyles]}>
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.controlInner}
        onPress={props.handlePositive}
        >
        <Icon name="plus" style={[baseStyle.crumbIcon, styles.icons]}/>
      </TouchableOpacity>
    </Animated.View>
  </View>
)

export const insightFragment = Relay.QL`
  fragment on Insight {
    id
    content
    origin {
      author
      url
      title
      duration
    }
  }
`

export default Relay.createContainer(InsightCard, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
    insight: () => Relay.QL`
      fragment on UserInsightsEdge {
        topic {
          id
          name
        }
        node {
          ${insightFragment}
          likeReaction {
            content
            mood
          }
          dislikeReaction {
            content
            mood
          }
        }
      }
    `,
  },
})
