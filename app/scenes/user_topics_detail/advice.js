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

import { Button, Loader, ScrollListView, Card } from "../../components";
import { ADD_CARD_REF, CONTROLS_WIDTH, SHARE_CARD_REF, CONTROL_PIECE } from "./const";
import { USER_MARK_ADVICE, USER_MARK_ADVICE_NEGATIVE } from "../../module_dal/actions/actions";

import * as device from "../../utils/device";
import { connect } from "react-redux";
import clamp from "clamp";

import { ShareCard, AddCard } from "./add_card_to_collection";
import { _panResponder } from "./pan_responder";

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
      enter: new Animated.Value(0.9)
    };
    this.controlsCardMeasureWidth = 0;

    this._onPressCard = this._onPressCard.bind(this);
    this._onPressIn = this._onPressIn.bind(this);
    this._onShare = this._onShare.bind(this);
    this._addToCollectionNotIgnore = this._onAddToCollection.bind(this, 'not_ignore');
    this._openWebView = this._openWebView.bind(this);
  }

  componentDidMount () {
    this._animateEntrance();
  }

  componentWillMount () {
    const responder = _panResponder.bind(this)
    this._panResponder = responder();
  }

  componentWillUnmount () {

  }

  _navigatorPush (scene, title = "", data, conf) {
    const { navigator } = this.props;
    navigator.push({ scene, title: title, advice: data, sceneConfig: conf })
  }

  _goToNextAdvice () {
    const { advices } = this.props;
    let current = advices.list.indexOf(this.props.currentAdvice);
    let newIdx = current + 1;

    this.setState({
      currentAdvice: advices.list[ newIdx ]
    });
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
   * @param id
   * @private
   */
  _openWebView (advice) {
    if ( advice && advice.url ) {
      this._navigatorPush('web_view', '', advice, { hideBar: true });
    }
  }


  /**
   *
   * Mark Bad card
   * show comment_bad screen if {currentAdvice.confirmation == true}
   * @param params
   * @param evt
   * @private
   */
  _onMarkBad (params, evt) {
    const { currentAdvice, onMarkBad } = this.props;
    this._animationCardRightAndReset(params)

    setTimeout(()=> {
      onMarkBad(currentAdvice)
    }, 0)
  }

  _animationCardRightAndReset (params = {}) {
    let setting = {
      velocity: { x: clamp(100 * -1, 3, 5) * -2, y: 0 },
      deceleration: 0.98,
      ...params
    }

    Animated.decay(this.state.pan, setting)
            .start()
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


  // TODO:
  _onAddAdviceToTheCollection () {
    let setting = {
      velocity: { x: clamp(7, 3, 5), y: 0 },
      deceleration: 0.98
    }
    Animated.decay(this.state.pan, setting)
            .start(this._resetState.bind(this))
  }

  /**
   * show comment_good screen or go to user_collections and reset card
   *
   * dispatch action USER_MARK_ADVICE
   * @param param - ignore or not {currentAdvice.confirmation}
   * @param evt
   * @private
   */
  _onAddToCollection (param, evt) {

    const { currentAdvice } = this.props;

    if ( currentAdvice.confirmation && param != 'ignore' ) {
      /*this.setState({
       comment_good: true
       })*/
    } else {


      setTimeout(()=> {
        this._hideControlShare();
        //this._goToNextAdvice();
      }, 0)
    }
  }

  _onShare () {
    const { currentAdvice } = this.props;
    this.props.onShare(currentAdvice)
  }


  _onPressCard (dataCard) {

  }

  /**
   * A long press show controls or hide
   * @param props
   * @private
   */
  _onPressIn (props) {
    if ( this.state.controlShareIsShow ) {
      this._hideControlShare()
    } else {
      this._parallelShowControl()
      this.props.onPressIn && this.props.onPressIn()
    }
  }


  _parallelShowControl () {
    const param = {
      toValue: CONTROLS_WIDTH,
      duration: 100,
      friction: 8
    }
    setTimeout(()=> {
      Animated.spring(this.state.addControl, param).start()
      Animated.spring(this.state.shareControl, param).start()
    }, 0)
    this._isShowControlShare()
  }

  _isHideControlShare () {
    this.setState({ controlShareIsShow: false })
  }

  _isShowControlShare () {
    this.setState({ controlShareIsShow: true })
  }

  _returnCardToStartingPosition () {
    Animated.spring(this.state.pan, {
      toValue: { x: 0, y: 0 },
      friction: 4
    }).start()
  }

  _resetState () {
    this.state.pan.setValue({ x: 0, y: 0 });
    this.state.enter.setValue(0.9);
    this._hideControlShare();
    this._goToNextAdvice();
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

    const { currentAdvice, allAdviceOpacityOn } = this.props;

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
            <Card
                {...currentAdvice}
                openWebView={this._openWebView}
                doNotToggle={controlShareIsShow}
                styleText={styles.cardText}
                onPressIn={this._onPressIn}
                onPressCard={this._onPressCard}/>
          </Animated.View>

          <View style={[styles.wrapperAddCardControl]}>
            <Animated.View style={[{width : CONTROLS_WIDTH}, shareStyle]}>
              <ShareCard
                  currentAdvice={currentAdvice}
                  onShare={this._onShare}/>
            </Animated.View>

            <Animated.View style={[{width : CONTROLS_WIDTH}, addStyle]}>
              <AddCard
                  currentAdvice={currentAdvice}
                  onAddToCollection={this._addToCollectionNotIgnore}/>
            </Animated.View>
          </View>
        </View>
    )
  }
}

export default connect(state => ({
  user: state.user,
  advices: state.advices
}))(Advice)
