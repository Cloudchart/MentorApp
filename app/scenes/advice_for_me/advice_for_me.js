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
} from "react-native";

import { Button, Loader, ScrollListView, Card } from "../../components";
import { ADD_CARD_REF, CONTROLS_WIDTH, SHARE_CARD_REF, CONTROL_PIECE } from "./const";
import { USER_MARK_ADVICE_NEGATIVE } from "../../module_dal/actions/actions";

import * as device from "../../utils/device";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import baseStyle from "../../styles/base";
import clamp from "clamp";

import { ShareCard, AddCard } from "./add_card_to_collection";
import { _panResponder } from "./pan_responder";
import CommentGood from "./comment_good";
import CommentBad from "./comment_bad";

import styles from "./style";
const dimensions = Dimensions.get('window');


class AdviceForMe extends Component {

  constructor (props) {
    super(props)

    this.state = {
      controlShareIsShow: false,
      comment_bad: false,
      comment_good: false,
      loader: true,
      shareControl: new Animated.ValueXY({ x: 0, y: 0 }),
      addControl: new Animated.ValueXY({ x: 0, y: 0 }),
      top: dimensions.height / 4.5,
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.9),
      currentAdvice: {}
    };
    this.controlsCardMeasureWidth = 0;


    this._onPressCard = this._onPressCard.bind(this);
    this._onDelete = this._onDelete.bind(this, {});
    this._onAddAdviceToTheCollection = this._onAddAdviceToTheCollection.bind(this)
    this.addToCollectionNotIgnore = this._onAddToCollection.bind(this, 'not_ignore');
  }

  componentDidMount () {
    this._animateEntrance();
    setTimeout(()=> {
      this.setState({ loader: false })
      setTimeout(this.measureView.bind(this), 0);
    }, 1000);
  }

  /**
   * measure control add to collection
   */
  measureView () {
    /*this.refs[SHARE_CONTROLS_REF].measure((x, y, width, height) => {
     this.controlsCardMeasureWidth = width;
     });*/
  }


  componentWillMount () {
    this._setCurrentAdvice()
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
    let current = advices.list.indexOf(this.state.currentAdvice);
    let newIdx = current + 1;
    if ( newIdx > advices.list.length - 1 ) {
      this._navigatorPush('all_for_now', '')
      return;
    }

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


  _setCurrentAdvice () {
    const { advices } = this.props;
    this.state.currentAdvice = advices.list[ 0 ];
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
   * Delete card
   * show comment_bad screen if {currentAdvice.confirmation == true}
   * @param params
   * @param evt
   * @private
   */
  _onDelete (params, evt) {
    const { currentAdvice } = this.state;
    if ( currentAdvice.confirmation ) {
      this.setState({
        comment_bad: true
      })
    } else {
      this._animationCardRightAndReset(params || {})
    }
  }

  _animationCardRightAndReset (params = {}) {
    const { dispatch } = this.props;
    let setting = {
      velocity: { x: clamp(100 * -1, 3, 5) * -2, y: 0 },
      deceleration: 0.98,
      ...params
    }

    Animated.decay(this.state.pan, setting)
            .start(this._resetState.bind(this))

    setTimeout(()=> {
      dispatch({
        type: USER_MARK_ADVICE_NEGATIVE,
        id: this.state.currentAdvice.id
      })
    }, 0)
  }

  /**
   * show control piece
   * @private
   */
  _showControlPiece () {
    const { pan } = this.state;
    if ( pan.__getValue().x > 50 ) {
      if ( !this.state.showPiece ) {
        this.state.showPiece = true;
        const param = {
          toValue: CONTROL_PIECE,
          duration: 200,
          friction: device.size(9 * 1.2)
        }
        setTimeout(()=> {
          Animated.spring(this.state.addControl, param).start()
          Animated.spring(this.state.shareControl, param).start()
        }, 0)
      }
    }
  }


  /**
   * show full control
   * @private
   */
  _onShowFullAdd () {
    Animated.spring(this.state.addControl, {
          toValue: CONTROLS_WIDTH,
          duration: 100,
          friction: 8
        }
    ).start();
    this._isShowControlShare()
  }

  _onShowFullShare () {
    Animated.spring(this.state.shareControl, {
          toValue: CONTROLS_WIDTH,
          duration: 100,
          friction: 8
        }
    ).start();
    this._isShowControlShare()
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
   * @param param - ignore or not {currentAdvice.confirmation}
   * @param evt
   * @private
   */
  _onAddToCollection (param, evt) {
    const { currentAdvice } = this.state;
    if ( currentAdvice.confirmation && param != 'ignore' ) {
      this.setState({
        comment_good: true
      })
    } else {
      setTimeout(()=> {
        this._returnCardToStartingPosition()
        this._hideControlShare();
        this._goToNextAdvice();
        this._navigatorPush('user_collections', '', this.state.currentAdvice)
      }, 0)
    }
  }

  _onShare () {
    const { currentAdvice } = this.state;

    ActionSheetIOS.showShareActionSheetWithOptions({
          url: currentAdvice.url || '',
          message: currentAdvice.text,
          subject: 'a subject to go in the email heading'
        },
        (error) => {
          //console.error(error);
        },
        (success, method) => {
          var text;
          if ( success ) {
            text = `Shared via ${method}`;
          } else {
            text = 'You didn\'t share';
          }
          //this.setState({text});
        });
  }


  _isShowControlShare () {
    this.setState({
      controlShareIsShow: true
    })
  }

  _isHideControlShare () {
    this.setState({
      controlShareIsShow: false
    })
  }

  _onPressCard (dataCard) {
    this.setState({
      showCardTopicName: this.state.showCardTopicName ? false : true
    })
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
   *
   * return from bad comment screen
   * delete card or reset position
   *
   * @param opt_param
   * @private
   */
  _commentBadUndo (opt_param, evt) {
    this.setState({
      comment_bad: false
    })

    if ( opt_param == 'delete' ) {
      setTimeout(()=> {
        this._animationCardRightAndReset()
      }, 300)
    } else {
      this._returnCardToStartingPosition()
    }
  }

  _commentGoodContinue () {
    this._onAddToCollection('ignore')

    setTimeout(()=> {
      this.setState({
        comment_good: false
      })
    }, 300)
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    const {
        loader,
        top, pan,
        enter,
        currentAdvice, showCardTopicName,
        controlShareIsShow,
        comment_good,
        comment_bad,
        shareControl,
        addControl
    } = this.state;

    const [translateX, translateY] = [ pan.x, pan.y ];

    const rotate = pan.x.interpolate({ inputRange: [ -200, 0, 200 ], outputRange: [ "-30deg", "0deg", "30deg" ] });
    const opacity = pan.x.interpolate({ inputRange: [ -200, 0, 200 ], outputRange: [ 0.5, 1, 0.5 ] })
    const scale = enter;

    const animatedCardStyles = { transform: [ { translateX }, { translateY }, { rotate }, { scale } ], opacity };
    const yupScale = pan.x.interpolate({ inputRange: [ 0, 150 ], outputRange: [ 0.8, 1 ], extrapolate: 'clamp' });
    const nopeScale = pan.x.interpolate({ inputRange: [ -150, 0 ], outputRange: [ 1, 0.8 ], extrapolate: 'clamp' });
    const animatedNopeStyles = { transform: [ { scale: nopeScale } ] }
    const animatedYupStyles = { transform: [ { scale: yupScale } ] }

    const interpolateControls = {
      inputRange: [ 0, CONTROL_PIECE, CONTROLS_WIDTH ],
      outputRange: [ 0, -CONTROL_PIECE, -CONTROLS_WIDTH ],
      extrapolate: 'clamp'
    }
    const share = shareControl.x.interpolate(interpolateControls);
    const shareStyle = { transform: [ { translateX: share } ] }
    const add = addControl.x.interpolate(interpolateControls);
    const addStyle = { transform: [ { translateX: add } ] }


    if ( loader ) {
      return <Loader />
    }

    if ( comment_bad ) {
      return <CommentBad {...this.props} undo={this._commentBadUndo.bind(this)}/>
    }

    if ( comment_good ) {
      return <CommentGood {...this.props} continue={this._commentGoodContinue.bind(this)}/>
    }

    return (
        <View style={ styles.container }>
          {!showCardTopicName ? null :
              <TitleAdvice topicName={currentAdvice.topic_name}/>}

          <Animated.View style={[styles.card, animatedCardStyles]}
              {...this._panResponder.panHandlers}>
            <Card
                openWebView={this._openWebView.bind(this)}
                {...currentAdvice}
                styleText={styles.cardText}
                onPressCard={this._onPressCard}/>
          </Animated.View>


          {/* controls share */}

          <View style={[styles.wrapperAddCardControl, {top}]}>
            <Animated.View style={[{width : CONTROLS_WIDTH}, shareStyle]}>
              <View ref={SHARE_CARD_REF} style={{flex: 1}}>
                <ShareCard
                    currentAdvice={currentAdvice}
                    onShare={this._onShare.bind(this)}/>
              </View>
            </Animated.View>

            <Animated.View style={[{width : CONTROLS_WIDTH}, addStyle]}>
              <View ref={ADD_CARD_REF} style={{flex: 1}}>
                <AddCard
                    currentAdvice={currentAdvice}
                    onAddToCollection={this.addToCollectionNotIgnore}/>
              </View>
            </Animated.View>
          </View>


          {/* controls */}
          {showCardTopicName ? null :
              <View style={styles.controlWrapper }>
                <Animated.View style={[styles.controlLeft, animatedNopeStyles]}>
                  <TouchableOpacity
                      activeOpacity={ 0.95 }
                      style={[styles.controlInner, {paddingTop: 0, left : -1}]}
                      onPress={this._onDelete}>
                    <Icon name="times" style={[baseStyle.crumbIcon, styles.icons]}/>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.controlRight, animatedYupStyles]}>
                  <TouchableOpacity
                      activeOpacity={ 0.95 }
                      style={styles.controlInner}
                      onPress={this._onAddAdviceToTheCollection}>
                    <Icon name="plus" style={[baseStyle.crumbIcon, styles.icons]}/>
                  </TouchableOpacity>
                </Animated.View>
              </View>}
        </View>
    )
  }
}


const TitleAdvice = (props) => {
  return (
      <View style={styles.titleAdvice}>
        <Text style={styles.titleAdviceText}>{props.topicName}</Text>
      </View>
  )
}

export default connect(state => ({
  user: state.user,
  advices: state.advices
}))(AdviceForMe)
