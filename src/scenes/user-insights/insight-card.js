import React, {
  Component,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  TouchableWithoutFeedback,
  View,
  ListView,
  AlertIOS,
  ActionSheetIOS,
  Animated,
  Easing,
  Dimensions,
  PanResponder,
} from 'react-native'
import Relay from 'react-relay'
import { Button, Loader, ScrollListView } from '../../components'
import Insight, {
  animationCardLeft,
  animationCardRight,
  animateReturnCardToStartPosition,
} from '../../components/insight'
import {
  CONTROL_PIECE,
  CONTROLS_WIDTH,
  SHARE_CARD_REF,
  ADD_CARD_REF,
} from '../../components/insight/const'
import * as device from '../../utils/device'
import clamp from 'clamp'
import { ShareCard, AddCard } from './add-card-to-collection'
//import { _panResponder } from './pan-responder'
import createInsightCardPanResponder from '../insights/pan-responder'
import MarkInsightUsefulInCollectionMutation from '../../mutations/mark-insight-useful-in-collection'
import MarkInsightUselessInCollectionMutation from '../../mutations/mark-insight-useless-in-collection'
import styles from './style'

const dimensions = Dimensions.get('window')

class UserInsightCard extends Component {
  constructor (props) {
    super(props)
    //this._onPressCard = this._onPressCard.bind(this)
    //this._onMarkGood = this._onMarkGood.bind(this)
    //this._onMarkBad = this._onMarkBad.bind(this)
    //this._onShare = this._onShare.bind(this)
    this.state = {
      removeView: false,
      opacityOn: false,
      cardHeight: 0,
      calculateTopControl: 0,
    }
    this._shareControl = new Animated.ValueXY({ x: 0, y: 0 })
    this._addControl = new Animated.ValueXY({ x: 0, y: 0 })
    this._pan = new Animated.ValueXY()
    this._enter = new Animated.Value(0.9)
  }

  componentWillMount() {
    //const responder = _panResponder.bind(this)
    this._panResponder = createInsightCardPanResponder(this, {
      onLike: () => this.handleMarkUseful(),
      onDislike: () => this.handleMarkUseless(),
    });
  }

  /**
   *
   * Mark Bad card
   * @todo show comment_bad screen if {insight.confirmation == true}?
   */
  handleMarkUseless(params) {
    const { type } = this.props
    if (type === 'USELESS') {
      return false
    }
    const { insight, collection } = this.props
    animationCardLeft(params, this._pan, this._resetState.bind(this))
    const mutation = new MarkInsightUselessInCollectionMutation({
      collection,
      insight: insight,
    })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: response => {
        console.log('user-insights: marked as useless', this.props)
      }
    })
  }

  /**
   *
   * @param opt_param
   * @private
   */
  handleMarkUseful(opt_param) {
    const { type } = this.props
    if (type === 'USEFUL') {
      return false
    }
    const { insight, collection } = this.props
    animationCardRight(this._pan, this._resetState.bind(this))
    const mutation = new MarkInsightUsefulInCollectionMutation({
      collection,
      insight,
    })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: response => {
        console.log('user-insights: marked as useful', this.props)
      }
    })

    //markInsightUsefulInCollection({ insight, collection })
    //  .then(transaction => {
    //    if ( !opt_param ) {
    //      navigator.push({
    //        scene: 'user-collections',
    //        title: 'Add to collection',
    //        advice: { ...transaction.markInsightUsefulInCollection.insight }
    //      })
    //    } else {
    //      forceFetch && forceFetch()
    //    }
    //  })
  }
  ///**
  // *
  // * TODO - forceFetch :(
  // * @param params
  // * @private
  // */
  //_animationCardLeftAndReset(params) {
  //  const { collection, insight, forceFetch } = this.props;
  //  animationCardLeft(params, this._pan, this._resetState.bind(this))
  //  markInsightUselessInCollection({ insight, collection })
  //    .then((transaction)=> {
  //      forceFetch && forceFetch()
  //    })
  //    .catch((error)=> {
  //      forceFetch && forceFetch()
  //    })
  //}

  handleAddControlPress() {
    const { navigator, insight } = this.props
    navigator.push({
      scene: 'user-collections',
      title: 'Add to collection',
      advice: insight,
    })
  }

  handleShareControlPress() {
    const { insight } = this.props
    ActionSheetIOS.showShareActionSheetWithOptions(
      {
        url: insight.origin.url || '',
        message: insight.content,
        subject: 'a subject to go in the email heading'
      },
        error => {},
      (success, method) => {
        console.log({ success, method })
      }
    )
  }

  handleCardPress() {
    // nothing
  }

  handleCardSwipeStart() {
    this.props.onSwipeStart && this.props.onSwipeStart()
  }

  handleCardSwipeEnd() {
    this.props.onSwipeEnd && this.props.onSwipeEnd()
  }

  /**
   * show control piece
   * and scrollEnabled = false
   * @private
   */
  showPopupControls() {
    const { _pan } = this
    if (_pan.__getValue().x > 50) {
      this.props.onSwipeStart && this.props.onSwipeStart()
      if (!this._isPopupControlVisible) {
        this._isPopupControlVisible = true
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
    this._isPopupControlVisible = false
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

  returnCardToStartPosition() {
    animateReturnCardToStartPosition(this._pan)
    this.props.onSwipeEnd && this.props.onSwipeEnd()
  }

  _resetState () {
    this._pan.setValue({ x: 0, y: 0 })
    this.hidePopupControls()
    /*
     this.state.enter.setValue(1);
     this._hideControlShare();
     animateEntrance(this.state.enter)
     */
  }

  render () {
    const { insight } = this.props
    const {
      _pan,
      _enter,
      _shareControl,
      _addControl,
    } = this
    const [translateX, translateY] = [ _pan.x, _pan.y ]
    const rotate = _pan.x.interpolate({ inputRange: [ -200, 0, 200 ], outputRange: [ "-30deg", "0deg", "30deg" ] })
    const opacity = _pan.x.interpolate({ inputRange: [ -200, 0, 200 ], outputRange: [ 0.5, 1, 0.5 ] })
    const scale = _enter
    const animatedCardStyles = { transform: [ { translateX }, { translateY }, { rotate }, { scale } ], opacity }
    const interpolateControls = {
      inputRange: [ 0, CONTROL_PIECE, CONTROLS_WIDTH ],
      outputRange: [ 0, -CONTROL_PIECE, -CONTROLS_WIDTH ],
      extrapolate: 'clamp',
    }
    const share = _shareControl.x.interpolate(interpolateControls)
    const shareStyle = { transform: [ { translateX: share } ] }
    const add = _addControl.x.interpolate(interpolateControls)
    const addStyle = { transform: [ { translateX: add } ] }
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View
          style={styles.card}
          {...this._panResponder.panHandlers}
          >
          <Animated.View style={animatedCardStyles}>
            <Insight
              insight={insight}
              fontSize={20}
              onCardPress={() => this.handleCardPress()}/>
          </Animated.View>
        </View>
        <View style={styles.wrapperAddCardControl}>
          <Animated.View style={[{width: CONTROLS_WIDTH}, shareStyle]}>
            <View ref={SHARE_CARD_REF} style={{flex: 1}}>
              <ShareCard />
            </View>
          </Animated.View>
          <Animated.View style={[{width: CONTROLS_WIDTH}, addStyle]}>
            <View ref={ADD_CARD_REF} style={{flex: 1}}>
              <AddCard />
            </View>
          </Animated.View>
        </View>
      </View>
    )
  }
}

export default UserInsightCard
