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

import { Button, Loader, ScrollListView } from "../../components";
import Insight, {
  animationCardLeft,
  animationCardRight,
  returnCardToStartingPosition,
  animateEntrance
} from "../../components/insight";

import { ADD_CARD_REF, CONTROLS_WIDTH, SHARE_CARD_REF, CONTROL_PIECE } from "../../components/insight/const";

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

  state = {
    removeView: false,
    opacityOn: false,
    shareControl: new Animated.ValueXY({ x: 0, y: 0 }),
    addControl: new Animated.ValueXY({ x: 0, y: 0 }),
    pan: new Animated.ValueXY(),
    enter: new Animated.Value(1)
  }

  constructor (props) {
    super(props)
    this._onPressCard = this._onPressCard.bind(this);
    this._onMarkGood = this._onMarkGood.bind(this);
    this._onMarkBad = this._onMarkBad.bind(this);
    this._onShare = this._onShare.bind(this);
  }


  componentWillMount () {
    const responder = _panResponder.bind(this)
    this._panResponder = responder();
  }

  componentDidMount () {

  }

  componentWillUnmount () {

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
   * TODO - forceFetch :(
   * @param params
   * @param evt
   * @private
   */
  _onMarkGood (params, evt) {
    const { insight, collection, forceFetch } = this.props;
    animationCardRight(this.state.pan, this._resetState.bind(this))
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
   * TODO - forceFetch :(
   * @param params
   * @private
   */
  _animationCardLeftAndReset (params) {
    const { collection, insight, forceFetch } = this.props;
    animationCardLeft(params, this.state.pan, this._resetState.bind(this))
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
    const { insight } = this.props;
    let origin = {
      url: '',
      content: ''
    };
    if ( insight && insight.origin ) {
      origin.url = insight.origin.url || '';
      origin.content = insight.origin.content || '';
    }
    ActionSheetIOS.showShareActionSheetWithOptions({
        url: origin.url,
        message: origin.content,
        subject: 'a subject to go in the email heading'
      },
      (error) => {
        this._returnCardToStartingPosition()
      },
      (success, method) => {
        this._returnCardToStartingPosition()
      }
    );
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

  }

  _returnCardToStartingPosition () {
    returnCardToStartingPosition(this.state.pan)
    this.props && this.props.onSwipeStart(true);
  }

  _resetState () {
    this.state.pan.setValue({ x: 0, y: 0 });
    /*
     this.state.enter.setValue(1);
     this._hideControlShare();
     //animateEntrance(this.state.enter)*/
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    const {
      pan,
      enter,
      shareControl,
      addControl,
    } = this.state;

    const { insight } = this.props;

    const [translateX, translateY] = [ pan.x, pan.y ];

    const rotate = pan.x.interpolate({ inputRange: [ -200, 0, 200 ], outputRange: [ "-30deg", "0deg", "30deg" ] });
    const opacity = pan.x.interpolate({ inputRange: [ -200, 0, 200 ], outputRange: [ 0.5, 1, 0.5 ] })
    const scale = enter;

    const animatedCardStyles = { transform: [ { translateX }, { translateY }, { rotate }, { scale } ], opacity }

    const interpolateControls = {
      inputRange: [ 0, CONTROL_PIECE, CONTROLS_WIDTH ],
      outputRange: [ 0, -CONTROL_PIECE, -CONTROLS_WIDTH ],
      extrapolate: 'clamp'
    }
    const share = shareControl.x.interpolate(interpolateControls);
    const shareStyle = { transform: [ { translateX: share } ] }
    const add = addControl.x.interpolate(interpolateControls);
    const addStyle = { transform: [ { translateX: add } ] }

    return (
      <View style={ {flex: 1, flexDirection: 'row'} }>


        <View style={styles.card} {...this._panResponder.panHandlers}>
          <Animated.View style={animatedCardStyles}>
            <Insight
              insight={{...insight}}
              onPressCard={this._onPressCard}/>
          </Animated.View>
        </View>


        <View style={[styles.wrapperAddCardControl]}>
          <Animated.View style={[{width : CONTROLS_WIDTH}, shareStyle]}>
            <View ref={SHARE_CARD_REF} style={{flex: 1}}>
              <ShareCard
                currentInsights={{...insight}}
                onShare={this._onShare}/>
            </View>
          </Animated.View>

          <Animated.View style={[{width : CONTROLS_WIDTH}, addStyle]}>
            <View ref={ADD_CARD_REF} style={{flex: 1}}>
              <AddCard
                currentInsights={{...insight}}
                onMarkGood={this._onMarkGood}/>
            </View>
          </Animated.View>
        </View>
      </View>
    )
  }
}

export default Advice
