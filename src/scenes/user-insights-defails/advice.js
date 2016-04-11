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
  PanResponder
} from "react-native";

import { Button, Loader, ScrollListView, Insight } from "../../components";
import { ADD_CARD_REF, CONTROLS_WIDTH, SHARE_CARD_REF, CONTROL_PIECE } from "./const";

import * as device from "../../utils/device";
import clamp from "clamp";

import { ShareCard, AddCard } from "./add-card-to-collection";
import { _panResponder } from "./pan-responder";

import {
  markInsightUsefulInCollection,
  markInsightUselessInCollection
} from "../../actions/collections";

import styles from "./style";
const dimensions = Dimensions.get('window');


class Advice extends Component {

  constructor (props) {
    super(props)

    this.state = {
      opacityOn: false,
      controlShareIsShow: false,
      shareControl: new Animated.ValueXY({ x: 0, y: 0 }),
      addControl: new Animated.ValueXY({ x: 0, y: 0 }),
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.8)
    };
    this.controlsCardMeasureWidth = 0;
    this._onPressCard = this._onPressCard.bind(this);
    this._onMarkGood = this._onMarkGood.bind(this);
    this._onMarkBad = this._onMarkBad.bind(this);
    this._onShare = this._onShare.bind(this);
  }

  componentDidMount () {
    this._animateEntrance();
  }

  componentWillMount () {
    const responder = _panResponder.bind(this)
    this._panResponder = responder();
  }

  _navigatorPush (scene, title = "", data, conf) {
    const { navigator } = this.props;
    navigator.push({ scene, title: title, advice: data, sceneConfig: conf })
  }


  _animateEntrance () {
    Animated.spring(this.state.enter, {
        toValue: 1,
        duration: 500,
        friction: 8
      }
    ).start();
  }

  /**
   *
   * Mark Bad card
   * show comment_bad screen if {insight.confirmation == true}
   * @param params
   * @param evt
   * @private
   */
  _onMarkBad (params, evt) {
    this._animationCardLeftAndReset(params)
  }

  /**
   *
   * @param params
   * @param evt
   * @private
   */
  _onMarkGood (params, evt) {
    const { insight, collection, forceFetch } = this.props;
    const saveInsight = { ...insight }

    let setting = {
      velocity: { x: clamp(7, 3, 5), y: 0 },
      deceleration: 0.98
    }

    Animated.decay(this.state.pan, setting)
            .start(this._resetState.bind(this))

    markInsightUsefulInCollection({ insight, collection })
      .then((transaction)=> {
        forceFetch && forceFetch()
      })
      .catch((error)=> {
        forceFetch && forceFetch()
      })
  }

  /**
   *
   * @param params
   * @private
   */
  _animationCardLeftAndReset (params) {
    const { collection, insight, forceFetch } = this.props;
    const saveInsight = { ...insight }

    let setting = {
      velocity: { x: clamp(100 * -1, 3, 5) * -2, y: 0 },
      deceleration: 0.98,
      ...params
    }


    Animated.decay(this.state.pan, setting)
            .start(this._resetState.bind(this))

    markInsightUselessInCollection({ insight, collection })
      .then((transaction)=> {
        forceFetch && forceFetch()
      })
      .catch((error)=> {
        forceFetch && forceFetch()
      })
  }


  /**
   * hide full control
   * @private
   */
  _hideControlShare () {
    this.state.shareControl.setValue({ x: 0, y: 0 })
    this.state.addControl.setValue({ x: 0, y: 0 })
    this.state.showPiece = false;
    this._isHideControlShare()
  }

  _onShare () {
    this.props.onShare && this.props.onShare()
  }

  _onPressCard (dataCard) {

  }

  /**
   * show control piece
   * and scrollEnabled = false
   * @private
   */
  _showControlPiece () {
    const { pan } = this.state;
    if ( pan.__getValue().x > 50 ) {
      this.props && this.props.onSwipeStart(false);

      if ( !this.state.showPiece ) {
        this.state.showPiece = true;
        const param = {
          toValue: CONTROL_PIECE,
          duration: 200,
          friction: device.size(9 * 1.2)
        }
        setTimeout(()=> {
          Animated.spring(this.state.addControl, param).start();
          Animated.spring(this.state.shareControl, param).start();
        }, 0)
      }
    }
  }

  _isHideControlShare () {
    this.setState({ controlShareIsShow: false })
  }

  _returnCardToStartingPosition () {
    Animated.spring(this.state.pan, {
      toValue: { x: 0, y: 0 },
      friction: 4
    }).start()
    this.props && this.props.onSwipeStart(true);
  }

  _resetState () {
    this.state.pan.setValue({ x: 0, y: 0 });
    this.state.enter.setValue(0.9);
    this._hideControlShare();
    //this._goToNextAdvice();
    this._animateEntrance();
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    const {
      pan,
      enter,
      controlShareIsShow,
      shareControl,
      addControl
    } = this.state;

    const { insight, allAdviceOpacityOn } = this.props;

    const [translateX, translateY] = [ pan.x, pan.y ];

    const rotate = pan.x.interpolate({ inputRange: [ -200, 0, 200 ], outputRange: [ "-30deg", "0deg", "30deg" ] });
    const opacity = pan.x.interpolate({ inputRange: [ -200, 0, 200 ], outputRange: [ 0.5, 1, 0.5 ] })
    const scale = enter;

    const animatedCardStyles = { transform: [ { translateX }, { translateY }, { rotate }, { scale } ], opacity };

    const interpolateControls = {
      inputRange: [ 0, CONTROL_PIECE, CONTROLS_WIDTH ],
      outputRange: [ 0, -CONTROL_PIECE, -CONTROLS_WIDTH ],
      extrapolate: 'clamp'
    }
    const share = shareControl.x.interpolate(interpolateControls);
    const shareStyle = { transform: [ { translateX: share } ] }
    const add = addControl.x.interpolate(interpolateControls);
    const addStyle = { transform: [ { translateX: add } ] }

    const blockOpacity = !controlShareIsShow && allAdviceOpacityOn ? 0.7 : 1

    return (
      <View style={ {flex: 1, flexDirection: 'row'} }>

        <Animated.View style={[styles.card, animatedCardStyles]} {...this._panResponder.panHandlers}>
          <Insight
            insight={insight}
            navigator={this.props.navigator}
            doNotToggle={controlShareIsShow}
            styleText={styles.cardText}
            onPressCard={this._onPressCard}/>
        </Animated.View>

        <View style={[styles.wrapperAddCardControl]}>
          <Animated.View style={[{width : CONTROLS_WIDTH}, shareStyle]}>
            <View ref={SHARE_CARD_REF} style={{flex: 1}}>
              <ShareCard
                currentInsights={insight}
                onShare={this._onShare}/>
            </View>
          </Animated.View>

          <Animated.View style={[{width : CONTROLS_WIDTH}, addStyle]}>
            <View ref={ADD_CARD_REF} style={{flex: 1}}>
              <AddCard
                currentInsights={insight}
                onMarkGood={this._onMarkGood}/>
            </View>
          </Animated.View>
        </View>
      </View>
    )
  }
}

export default Advice
