import React, {
  Component,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  View,
  ListView,
  AlertIOS,
  ActionSheetIOS,
  Animated,
  Easing,
  Dimensions
} from 'react-native'
import Relay from 'react-relay'
import { connect } from 'react-redux'
import { _ } from 'lodash'
import { Button, Loader, ScrollListView, TopicSubscribed } from '../../components'
import {
  RandomAdvice,
  CommentGood,
  CommentBad,
  TopicFinished,
  AllForNow,
  AllEnded,
} from '../../components/confirmation-screens/insights-parts'
import * as constant from '../../components/insight/const'
import * as actions from '../../actions/actions'
import * as device from '../../utils/device'
import ConfirmationScreens from './confirmation'
import Icon from 'react-native-vector-icons/FontAwesome'
import baseStyle from '../../styles/base'
import clamp from 'clamp'
import { likeInsightInTopic, dislikeInsightInTopic } from '../../actions/insight'
import { ShareCard, AddCard } from './add-card-to-collection'
import insightPanResponder from './pan-responder'
import Insight, {
  animateEntrance,
  animationCardRight,
  animationCardLeft,
} from '../../components/insight'

import styles from './style'
const dimensions = Dimensions.get('window')

class InsightForMe extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      top: dimensions.height / 4.5,
      isDetailsVisible: false,
    }
    this._shareControl = new Animated.ValueXY({ x: 0, y: 0 })
    this._addControl = new Animated.ValueXY({ x: 0, y: 0 })
    this._pan = new Animated.ValueXY()
    this._enter = new Animated.Value(0.9)
  }

  componentWillMount() {
    this._panResponder = insightPanResponder(this)
  }

  handlePressCard() {
    const { isDetailsVisible } = this.state
    this.setState({
      isDetailsVisible: !isDetailsVisible,
    })
  }

  handleLikePress() {
    const { _pan } = this
    animationCardRight(_pan, () => this.handleLikeRate())
  }

  handleLikeRate() {
    const { handleReaction, insight, filter } = this.props
    //this._resetState()
    const basicReaction = insight.likeReaction
    const finalReaction = {
      type: 'like',
      ...basicReaction,
    }
    handleReaction(finalReaction, () => {
      if (filter == 'PREVIEW') {
        // We can ignore mutations
        return
      }
      this._requestLikeMutation()
    })
  }

  _requestLikeMutation() {
    const { user, insight } = this.props
    //if (isFinishedByViewer) {
    //  this.props.handleTopicFinish();
    //}
    AlertIOS.alert(
      'Debug',
      'You like it ' + JSON.stringify({
        'user': user.id,
        'insight': insight.node.id,
      })
    )
  }

  handleDislikePress(params) {
    const { _pan } = this
    animationCardLeft(params || {}, _pan, () => handleDislikeRate())
  }

  handleDislikeRate() {
    const { handleReaction, insight } = this.props
    const basicReaction = insight.dislikeReaction
    const finalReaction = {
      type: 'dislike',
      ...basicReaction,
    }
    handleReaction(finalReaction, (cancelled) => {
      if (filter == 'PREVIEW') {
        // We can ignore mutations
        return
      }
      if (cancelled) {
        this._resetState()
        this._returnCardToStartingPosition()
        return
      }
      this._requestDislikeMutation()
    })
  }

  _requestDislikeMutation() {
    //if (isFinishedByViewer) {
    //  this.props.handleTopicFinish();
    //}
  }

  _returnCardToStartingPosition() {
    returnCardToStartingPosition(this._pan)
  }

  _hidePopupControls() {
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
    this._hidePopupControls()
    animateEntrance(this._enter)
  }

  render () {
    const { navigator, insight } = this.props
    const { isDetailsVisible } = this.state
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
      inputRange: [ 0, constant.CONTROL_PIECE, constant.CONTROLS_WIDTH ],
      outputRange: [ 0, -constant.CONTROL_PIECE, -constant.CONTROLS_WIDTH ],
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
      { width: constant.CONTROLS_WIDTH },
      { transform: shareButtonTransform },
    ]
    const addButtonTranslate = _addControl.x.interpolate(interpolateControls)
    const addButtonTransform = [
      { translateX: addButtonTranslate },
    ]
    const addButtonStyle = [
      { width: constant.CONTROLS_WIDTH },
      { transform: addButtonTransform },
    ]
    return (
      <View style={styles.container}>
        {isDetailsVisible && (
          <InsightTitle topicName={insight.topic.name ||  '' } />
        )}
        <Animated.View style={[styles.card, animatedCardStyles]}
          {...this._panResponder.panHandlers}>
          <Insight
            style={{alignSelf: 'center'}}
            navigator={navigator}
            insight={insight}
            onPressCard={() => this.handlePressCard()}/>
        </Animated.View>
        <View style={popupToolbarStyle}>
          <Animated.View style={shareButtonStyle}>
            <View ref={constant.SHARE_CARD_REF} style={{flex: 1}}>
              <ShareCard />
            </View>
          </Animated.View>
          <Animated.View style={addButtonStyle}>
            <View ref={constant.ADD_CARD_REF} style={{flex: 1}}>
              <AddCard />
            </View>
          </Animated.View>
        </View>
        {isDetailsVisible && (
          <RateButtons
            handlePositive={_.throttle(() => this.handleLikePress(), 700)}
            handleNegative={_.throttle(() => this.handleDislikePress(), 700)}
            {...{animatedNopeStyles, animatedYupStyles}} />
        )}
      </View>
    )
  }
}

const InsightTitle = props => (
  <View style={styles.titleAdvice}>
    <Text style={styles.titleAdviceText}>
      {props.topicName}
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

const InsightForMeContainer = Relay.createContainer(InsightForMe, {
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
          id
          content
          origin
          likeReaction {
            content
          }
          dislikeReaction {
            content
          }
        }
      }
    `,
  },
})

class InsightsScene extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      reaction: null,
      isTopicFinished: null,
    }
  }

  handleNextInsight() {
    const { reaction } = this.state
    this._checkTopicForFinish()
    if (reaction && reaction.rate === 'like') {
      this._reactionCallback && this._reactionCallback()
    }
    this.setState({
      reaction: null,
    })
  }

  handleUndoRate() {
    this.setState({
      reaction: null,
    })
    this._reactionCallback && this._reactionCallback(true)
  }

  handleReaction(reaction, callback) {
    this.setState({
      reaction
    })
    this._reactionCallback = callback
  }

  render() {
    const { viewer, navigator } = this.props
    const { reaction, isTopicFinished } = this.state
    if (reaction) {
      if (reaction.type === 'like') {
        return (
          <CommentGood
            navigator={navigator}
            handleNext={() => this.handleNextInsight()}
            />
        )
      }
      // Otherwise it means dislike
      return (
        <CommentBad
          navigator={navigator}
          handleNext={() => this.handleNextInsight()}
          handleUndo={() => this.handleUndoRate()}
          />
      )
    }
    if (isTopicFinished) {
      let isNotAllFinished = false
      viewer.subscribedTopics.edges.forEach(edge => {
        if (!edge.node.isTopicFinished) {
          isNotAllFinished = true
        }
      })
      if (isNotAllFinished) {
        return (
          <TopicFinished
            navigator={navigator}
            continueLearning={() => this.setState({ isTopicFinished: false })}
            />
        )
      }
      const isAllForNow = (viewer.insights.edges.length === 0)
      if (isAllForNow) {
        return (
          <AllForNow
            navigator={navigator}
            />
        )
      }
      // Otherwise it seems the end
      return (
        <AllForNow
          navigator={navigator}
          />
      )
    }
    const firstInsight = viewer.insights.edges[0]
    if (firstInsight) {
      return (
        <InsightForMeContainer
          navigator={navigator}
          insight={firstInsight}
          user={viewer}
          handleReaction={(reaction, callback) => this.handleReaction(reaction, callback)}
          handleTopicFinish={() => this.setState({ isTopicFinished: true })}
          />
      )
    }
    return (
      <Loader />
    )
  }
}

export default Relay.createContainer(InsightsScene, {
  initialVariables: {
    insightsCount: 100,
    insightsFilter: 'UNRATED',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${InsightForMeContainer.getFragment('user')}

        insights(first: $insightsCount, filter: $insightsFilter)  {
          edges {
            ${InsightForMeContainer.getFragment('insight')}
            topic {
              isFinishedByViewer
            }
          }
        }

        subscribedTopics: topics(first: 1, filter: SUBSCRIBED) {
          edges {
            node {
              isFinishedByViewer
            }
          }
        }
      }
    `,
  },
})
