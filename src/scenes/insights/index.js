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
import Relay from 'react-relay';
import { connect } from "react-redux";
import { _ } from "lodash";
import { Button, Loader, ScrollListView, TopicSubscribed } from "../../components";
import { RandomAdvice } from '../../components/confirmation-screens/insights-parts';
import * as InsightAnimations from '../../components/insight';
import * as constant from '../../components/insight/const';
import * as actions from '../../actions/actions';
import * as device from "../../utils/device";
import ConfirmationScreens from "./confirmation";
import Insight from "../../components/insight";
import Icon from "react-native-vector-icons/FontAwesome";
import baseStyle from "../../styles/base";
import clamp from "clamp";
import { likeInsightInTopic, dislikeInsightInTopic } from "../../actions/insight";
import { ShareCard, AddCard } from "./add-card-to-collection";
import { _panResponder } from "./pan-responder";
import { nodeQueryTopic, collectionInsightFragment } from "./fragments";

import styles from "./style";
const dimensions = Dimensions.get('window');


class InsightsForMe extends Component {

  state = {
    shouldAddToUserCollectionWithTopicName: true,
    allRatedInsights: [],
    allInsights: [],
    currentInsights: null,
    controlShareIsShow: false,
    confirmationScreensShow: false,
    conditionConfirmation: '',
    shareControl: new Animated.ValueXY({ x: 0, y: 0 }),
    addControl: new Animated.ValueXY({ x: 0, y: 0 }),
    top: dimensions.height / 4.5,
    pan: new Animated.ValueXY(),
    enter: new Animated.Value(0.9)
  }

  constructor (props) {
    super(props)
    this._stopAlert = false;
    this._onPressCard = this._onPressCard.bind(this);
    this._onLikeInsight = _.throttle(this._onLikeInsight.bind(this), 700);
    this._onDelete = _.throttle(this._onDelete.bind(this, {}), 700);
    this._onShare = this._onShare.bind(this);
    this.collectInsights = _.throttle(this.collectInsights.bind(this), 300);
    this._onAddToCollection = this._onAddToCollection.bind(this)
    this._continueLearning = this._continueLearning.bind(this);
    this._resetState = this._resetState.bind(this);
    this._continueLearning = this._continueLearning.bind(this);
    this._commentGoodContinue = this._commentGoodContinue.bind(this);
    this._commentBadUndo = this._commentBadUndo.bind(this);
  }

  /**
   * write in redux state amount
   * added to the collection of insight
   */
  componentWillMount () {
    const responder = _panResponder.bind(this);
    this._panResponder = responder();
    this.collectInsights();
  }


  /**
   * from viewer or from node
   */
  collectInsights () {
    const { dispatch, viewer, node } = this.props;
    let insights = [];
    if ( node && node.insights ) {
      insights = this._getInsightsFromNode()
    } else {
      insights = this._getInsights();
    }

    this._setCurrentAdvice(insights);
    dispatch({
      type: actions.COUNT_INSIGHTS_COLLECTIONS,
      collections: viewer.collections
    })
  }


  /**
   * Get insights from node of topics
   * @returns {Array}
   * @private
   */
  _getInsightsFromNode () {
    const { node } = this.props;
    let insightCollection = [];
    const insights = node.insights;

    if ( !insights ) return;

    insights.edges.map((inst)=> {
      inst.topic = { ...node };
      insightCollection.push({ ...inst })
    });

    this._topicsCompletion(insightCollection)
    return insightCollection;
  }

  /**
   * Get insights from an array of topics
   * @returns {*|Array}
   * @private
   */
  _getInsights () {
    const { viewer } = this.props
    const { insights } = viewer;
    this._topicsCompletion(insights.edges)
    return insights.edges;
  }


  /**
   *
   * @private
   */
  _topicsCompletion (edges) {
    const { filter } = this.props;
    const { currentInsights } = this.state;
    let conf = {
      conditionConfirmation: '',
      confirmationScreensShow: false
    }

    if ( !edges.length ) {
      if ( filter && filter == 'PREVIEW' ) {
        conf = {
          allInsights: [],
          conditionConfirmation: 'add_demo_topic',
          confirmationScreensShow: true
        }
      } else {
        conf = {
          conditionConfirmation: 'all_ended',
          confirmationScreensShow: true,
          allInsights: [],
          currentInsights: null
        }
      }


    }

    // TODO : TopicFinished
    if ( currentInsights && (edges.length && currentInsights.topic.isFinishedByViewer) ) {
      conf = {
        conditionConfirmation: 'topic_finished',
        confirmationScreensShow: true
      }
    }


    this.setState(conf)
  }


  _navigatorPush (scene, title = "", data, conf) {
    const { navigator } = this.props;
    navigator.push({ scene, title: title, advice: data, sceneConfig: conf })
  }

  /**
   * Show next Insight
   * set currentInsights and save prev currentInsights
   * @private
   */
  _goToNextInsights (insights_opt_param) {
    const { allInsights, currentInsights } = this.state;
    let localAllInsights = _.compact(allInsights);
    let conf = {};

    localAllInsights = localAllInsights.filter((insight, i)=> {
      const node = insight.node;
      return node.id != currentInsights.node.id;
    });

    if ( !insights_opt_param ) {
      conf.allInsights = localAllInsights;
      conf.currentInsights = localAllInsights.length ? localAllInsights[ 0 ] : null;
    } else {
      conf.allInsights = insights_opt_param;
      conf.currentInsights = insights_opt_param.length ? insights_opt_param[ 0 ] : null;
    }

    if ( !conf.allInsights.length ) {
      this._topicsCompletion(conf.allInsights);
      return;
    }

    // test isFinishedByViewer
    //currentInsights.topic.isFinishedByViewer = true;
    this._topicsCompletion(conf.allInsights);

    this.setState({ ...conf });
  }

  _animateEntrance () {
    InsightAnimations.animateEntrance(this.state.enter);
  }


  /**
   * set currentInsights and save all Insights
   * @private
   */
  _setCurrentAdvice (insights) {
    const allInsights = insights && insights.length ? insights : [];
    this.setState({
      allInsights,
      currentInsights: allInsights.length ? allInsights[ 0 ] : null
    });

    //setTimeout(()=> {this._animateEntrance()}, 200)
  }

  /**
   * if the operation was successful or not,
   * to remove from the array the last insight
   *
   * forceFetch
   * @private
   */
  _removeFromLocalStack (saveCurrentInsights, setCurrent) {
    const { allRatedInsights, allInsights } = this.state;
    let deleted = [];
    let localAllInsights = allInsights;
    let index = 0;

    //this.props.relay.forceFetch();

    const foundIns = allRatedInsights.find((insight, i)=> {
      index = i;
      const node = insight.node;
      return node.id == saveCurrentInsights.node.id;
    })

    if ( foundIns ) {
      deleted = this.state.allRatedInsights.splice(index, 1);
    }

    if ( setCurrent && !this._stopAlert ) {
      this._stopAlert = true;
      localAllInsights.unshift(deleted[ 0 ]);
      setTimeout(()=> {this._showAlertErrorMutation(localAllInsights, index)}, 0)
    }
  }

  /**
   *
   * @param currentInsights
   * @private
   */
  _saveToLocalStack (currentInsights) {
    const { allRatedInsights } = this.state;

    if ( !allRatedInsights.length ) {
      this.state.allRatedInsights.push(currentInsights)
      return;
    }

    const found = allRatedInsights.find((insight) => insight.node.id == currentInsights.node.id)

    if ( !found ) {
      this.state.allRatedInsights.push(currentInsights)
    }
  }

  /**
   *
   * @param index
   * @private
   */
  _showAlertErrorMutation (allInsights, index) {
    AlertIOS.alert('Error save advice', 'return back to the list ?', [
        {
          text: 'Cancel', onPress: () => {
          this.state.allRatedInsights.splice(index, 1);
          this._stopAlert = false;
        }
        },
        {
          text: 'OK', onPress: ()=> {
          this._goToNextInsights(allInsights);
          this._stopAlert = false;
        }
        }
      ]
    );
  }


  /**
   *
   * dislikeInsightInTopic action
   * show comment_bad screen if {currentInsights.confirmation == true}
   * @param params
   * @param evt
   * @private
   */
  _onDelete (params, evt) {
    const { currentInsights } = this.state;
    if ( !currentInsights ) return;
    if ( currentInsights.node.dislikeReaction ) {
      this.setState({
        confirmationScreensShow: true,
        conditionConfirmation: 'comment_bad'
      })
    }
    else {
      this._animationCardLeftAndReset(params || {})
    }
  }

  /**
   * dislikeInsightInTopic and  _resetState -> show next insight
   * if the operation fails with an error -> return back last insight
   * @param params
   * @private
   */
  _animationCardLeftAndReset (params) {
    const { currentInsights } = this.state;
    const { filter } = this.props;
    const saveCurrentInsights = { ...currentInsights }
    this._saveToLocalStack(saveCurrentInsights);
    InsightAnimations.animationCardLeft(params, this.state.pan, this._resetState)

    if ( filter && filter == 'PREVIEW' ) {
      return;
    }

    dislikeInsightInTopic(currentInsights)
      .then((tran)=> {
        this._removeFromLocalStack(saveCurrentInsights)
      })
      .catch((error)=> {
        this._removeFromLocalStack(saveCurrentInsights, true)
      })
  }


  /**
   *
   * @private
   */
  _onLikeInsight () {
    const { currentInsights, shouldAddToUserCollectionWithTopicName } = this.state;
    const { dispatch, filter } = this.props;
    const saveCurrentInsights = { ...currentInsights };
    this._saveToLocalStack(saveCurrentInsights);
    InsightAnimations.animationCardRight(this.state.pan, this._resetState)

    if ( filter && filter == 'PREVIEW' ) {
      return;
    }

    likeInsightInTopic(currentInsights, shouldAddToUserCollectionWithTopicName)
      .then((tran)=> {
        dispatch({ type: actions.COUNT_INSIGHTS_PLUS })
        this._removeFromLocalStack(saveCurrentInsights)
      })
      .catch((error)=> {
        this._removeFromLocalStack(saveCurrentInsights, true)
      })
  }

  /**
   * show control piece
   * @private
   */
  _showControlPiece () {
    const { pan } = this.state;
    const { filter } = this.props;

    if ( filter && filter == 'PREVIEW' ) {
      return;
    }

    if ( pan.__getValue().x > 50 ) {
      if ( !this.state.showPiece ) {
        this.state.showPiece = true;
        const param = {
          toValue: constant.CONTROL_PIECE,
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
        toValue: constant.CONTROLS_WIDTH,
        duration: 100,
        friction: 8
      }
    ).start();
    this._isShowControlShare()
  }

  _onShowFullShare () {
    Animated.spring(this.state.shareControl, {
        toValue: constant.CONTROLS_WIDTH,
        duration: 100,
        friction: 8
      }
    ).start();
    this._isShowControlShare()
  }

  _parallelHideControl () {
    const param = {
      toValue: 0,
      duration: 100,
      friction: 8
    }
    setTimeout(()=> {
      Animated.spring(this.state.addControl, param).start()
      Animated.spring(this.state.shareControl, param).start()
    }, 0);
    this.state.showPiece = false;
    this._isHideControlShare()
  }


  /**
   * hide full control
   * @private
   */
  _hideControlShare () {
    this._parallelHideControl();
  }


  /**
   * show comment_good screen or go to user-collections and reset card
   *
   * @param param - ignore or not {currentInsights.confirmation}
   * @param evt
   * @private
   */
  _onAddToCollection (param = true, reaction_ignore) {
    const { currentInsights, shouldAddToUserCollectionWithTopicName } = this.state;
    if ( !currentInsights ) return;
    this.state.shouldAddToUserCollectionWithTopicName = param;
    if ( currentInsights.node.likeReaction && !reaction_ignore ) {
      this.setState({
        confirmationScreensShow: true,
        conditionConfirmation: 'comment_good',
        shouldAddToUserCollectionWithTopicName: param
      });
      return;
    }

    this._onLikeInsight()
    if ( !param ) {
      this._navigatorPush('user-collections', 'Add to collection', currentInsights.node)
    }
  }

  _onShare () {
    const { currentInsights } = this.state;
    ActionSheetIOS.showShareActionSheetWithOptions({
        url: currentInsights.node.origin.url || '',
        message: currentInsights.node.content,
        subject: 'a subject to go in the email heading'
      },
      (error) => {},
      (success, method) => {}
    );
  }


  _isShowControlShare () {
    this.setState({ controlShareIsShow: true })
  }

  _isHideControlShare () {
    this.setState({ controlShareIsShow: false })
  }

  _onPressCard () {
    this.setState({
      showCardTopicName: this.state.showCardTopicName ? false : true
    })
  }


  _returnCardToStartingPosition () {
    InsightAnimations.returnCardToStartingPosition(this.state.pan)
  }

  _resetState () {
    this.state.pan.setValue({ x: 0, y: 0 });
    this.state.enter.setValue(0.9);
    this._hideControlShare();
    this._goToNextInsights();
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
    this.setState({ confirmationScreensShow: false })

    if ( opt_param == 'delete' ) {
      setTimeout(()=> {
        this._animationCardLeftAndReset()
      }, 300)
    } else {
      this._returnCardToStartingPosition()
    }
  }

  _commentGoodContinue () {
    const { shouldAddToUserCollectionWithTopicName } = this.state;
    this.setState({ confirmationScreensShow: false });
    setTimeout(()=> {
      this._onAddToCollection(shouldAddToUserCollectionWithTopicName, 'ignore');
    }, 300)
  }

  _continueLearning () {
    this.setState({ confirmationScreensShow: false })
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    const {
      top, pan,
      enter,
      currentInsights,
      showCardTopicName,
      shareControl,
      addControl,
      conditionConfirmation,
      confirmationScreensShow
    } = this.state;
    const { node, reactions, viewer, navigator, filter } = this.props;

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
      inputRange: [ 0, constant.CONTROL_PIECE, constant.CONTROLS_WIDTH ],
      outputRange: [ 0, -constant.CONTROL_PIECE, -constant.CONTROLS_WIDTH ],
      extrapolate: 'clamp'
    }
    const share = shareControl.x.interpolate(interpolateControls);
    const shareStyle = { transform: [ { translateX: share } ] }
    const add = addControl.x.interpolate(interpolateControls);
    const addStyle = { transform: [ { translateX: add } ] }

    if ( reactions.show || confirmationScreensShow ) {
      return (
        <ConfirmationScreens
          condition={conditionConfirmation}
          reactions={reactions}
          viewer={viewer}
          navigator={navigator}
          currentInsights={currentInsights}
          continueLearning={this._continueLearning}
          commentGoodContinue={this._commentGoodContinue}
          commentBadUndo={this._commentBadUndo}/>
      )
    }

    return (
      <View style={ styles.container }>
        {!showCardTopicName || (node && node.insights) ? null :
          <TitleAdvice topicName={currentInsights.topic.name ||  '' }/>}

        {!currentInsights ? null :
          <Animated.View style={[styles.card, animatedCardStyles]}
            {...this._panResponder.panHandlers}>
            <Insight
              style={{alignSelf: 'center'}}
              navigator={this.props.navigator}
              insight={currentInsights.node}
              onPressCard={this._onPressCard}/>
          </Animated.View>}


        {/* controls share */}
        <View style={[styles.wrapperAddCardControl, {top}]}>
          <Animated.View style={[{width : constant.CONTROLS_WIDTH}, shareStyle]}>
            <View ref={constant.SHARE_CARD_REF} style={{flex: 1}}>
              <ShareCard />
            </View>
          </Animated.View>

          <Animated.View style={[{width : constant.CONTROLS_WIDTH}, addStyle]}>
            <View ref={constant.ADD_CARD_REF} style={{flex: 1}}>
              <AddCard />
            </View>
          </Animated.View>
        </View>

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
                onPress={()=>{this._onAddToCollection()}}>
                <Icon name="plus" style={[baseStyle.crumbIcon, styles.icons]}/>
              </TouchableOpacity>
            </Animated.View>
          </View>
        }
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

const ReduxComponent = connect(state => ({
  reactions: state.reactions
}))(InsightsForMe)

export default Relay.createContainer(ReduxComponent, {
  initialVariables: {
    countInsights: 100,
    filter: 'UNRATED',
    filterInsights: 'UNRATED',
    filterInsightsInCollection: 'ALL'
  },
  fragments: {
    node : () => Relay.QL`
        fragment on Topic {
            ${nodeQueryTopic}
        }
    `,
    viewer: () => Relay.QL`
        fragment on User {
            ${RandomAdvice.getFragment('viewer')}
            ${collectionInsightFragment}
            subscribedTopics: topics(first: 100, filter: SUBSCRIBED) {
                availableSlotsCount
                edges {
                    node {
                        id
                        name
                    }
                }
            }
        }
    `
  }
});
