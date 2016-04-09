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

import { Button, Loader, ScrollListView, Insight, TopicSubscribed } from "../../components";
import { ADD_CARD_REF, CONTROLS_WIDTH, SHARE_CARD_REF, CONTROL_PIECE } from "./const";
import { COUNT_INSIGHTS_COLLECTIONS } from "../../actions/actions";

import {
  likeInsightInTopic,
  dislikeInsightInTopic
} from "../../actions/insight";

import * as device from "../../utils/device";
import Icon from "react-native-vector-icons/FontAwesome";
import baseStyle from "../../styles/base";
import clamp from "clamp";

import { ShareCard, AddCard } from "./add-card-to-collection";
import {
  CommentGood,
  CommentBad,
  AllForNow,
  AllEnded,
  TopicFinished
} from "./part-screens";
import { _panResponder } from "./pan-responder";

import styles from "./style";
const dimensions = Dimensions.get('window');


class AdviceForMe extends Component {

  state = {
    allRatedInsights: [],
    allInsights: [],
    currentInsights: null,
    controlShareIsShow: false,
    comment_bad: false,
    comment_good: false,
    allfor_now: false,
    all_ended: false,
    topic_finished: false,
    shareControl: new Animated.ValueXY({ x: 0, y: 0 }),
    addControl: new Animated.ValueXY({ x: 0, y: 0 }),
    top: dimensions.height / 4.5,
    pan: new Animated.ValueXY(),
    enter: new Animated.Value(0.9)
  }

  constructor (props) {
    super(props)
    this._onPressCard = this._onPressCard.bind(this);
    this._onDelete = this._onDelete.bind(this, {});
    this.addToCollectionNotIgnore = this._onAddToCollection.bind(this, 'not_ignore');
    this._continueLearning = this._continueLearning.bind(this);
    this._resetState = this._resetState.bind(this);
  }

  componentDidMount () {
    this._animateEntrance();
  }

  /**
   * When updated props { go to Settings -> Your topics -> add new topic and go back  }
   * @param nextProps
   */
  componentWillReceiveProps (nextProps) {
    clearTimeout(this._timeOutCollectInsights);
    this._timeOutCollectInsights = setTimeout(()=> {
      this.collectInsights();
    }, 300)
  }


  /**
   * write in redux state amount
   * added to the collection of insight
   */
  componentWillMount () {
    const responder = _panResponder.bind(this)
    this._panResponder = responder();

    this._timeOutCollectInsights = setTimeout(()=> {
      this.collectInsights();
    }, 300)
  }


  /**
   * from viewer or from node
   */
  collectInsights () {
    const { dispatch, viewer, node } = this.props;
    let insights = [];
    if ( node && node.insights && node.insights.edges.length ) {
      insights = this._getInsightsFromNode()
    } else {
      insights = this._getInsightsFromTopics()
    }

    this._setCurrentAdvice(insights);
    dispatch({
      type: COUNT_INSIGHTS_COLLECTIONS,
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
    let topicsCompletion = [];

    const insights = node.insights;
    if ( !insights ) return;

    insights.edges.map((inst)=> {
      const insight = inst.node;
      insight.relationTopic = { ...node }
      insightCollection.push({ ...insight })
    })

    // TODO: Statistics for each topic
    topicsCompletion.push({
      totalCount: insights.edges.length,
      ratedCount: insights.ratedCount,
      unratedCount: insights.unratedCount
    });
    this._topicsCompletion(topicsCompletion, insightCollection)
    return insightCollection;
  }

  /**
   * Get insights from an array of topics
   * @returns {*|Array}
   * @private
   */
  _getInsightsFromTopics () {
    const { viewer, node } = this.props
    const { subscribedTopics } = viewer;
    let insightCollection = [];
    let topicsCompletion = [];

    if ( subscribedTopics.edges.length ) {
      subscribedTopics.edges.filter((topic) => {
        const insights = topic.node.insights;
        if ( !insights ) return;
        insights.edges.map((inst)=> {
          const insight = inst.node;
          insight.relationTopic = { ...topic.node }
          insightCollection.push({ ...insight })
        })

        // TODO: Statistics for each topic
        topicsCompletion.push({
          totalCount: insights.edges.length,
          ratedCount: insights.ratedCount,
          unratedCount: insights.unratedCount
        });
      })
    }

    this._topicsCompletion(topicsCompletion, insightCollection)
    return insightCollection;
  }


  /**
   *
   * @param topicsCompletion
   * @param insightCollection
   * @private
   */
  _topicsCompletion (topicsCompletion, insightCollection) {
    let conf = {
      comment_bad: false, comment_good: false,
      allfor_now: false, topic_finished: false, all_ended: false
    };
    if ( !insightCollection.length ) {
      this.setState({
        ...conf,
        all_ended: true,
        allInsights: [],
        currentInsights: null
      })
      return;
    } else {
      this.setState(conf)
    }

    let found = topicsCompletion.find((insight)=> {
      /*console.log('totalCount (%d) ratedCount (%d)  unratedCount (%d)',
       insight.totalCount, insight.ratedCount, insight.unratedCount);*/
      if ( insight.ratedCount == insight.totalCount ) {
        return insight;
      }
    })

    if ( found ) {
      this.setState({ ...conf, topic_finished: true })
    }
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
  _goToNextInsights () {
    const { allInsights, currentInsights, allRatedInsights } = this.state;
    let currentIndex = 0;

    const found = allInsights.find((test, i)=> {
      currentIndex = i;
      return test.id == currentInsights.id;
    })
    const newIdx = found ? currentIndex + 1 : 0;

    if ( !allRatedInsights.includes(currentInsights) ) {
      this.state.allRatedInsights.push(currentInsights)
    }

    this.setState({
      currentInsights: allInsights.length >= newIdx ? allInsights[ newIdx ] : null
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
   * set currentInsights and save all Insights
   * @param insights
   * @private
   */
  _setCurrentAdvice (insights) {
    const allInsights = insights && insights.length ? insights : [];
    this.setState({
      allInsights,
      currentInsights: allInsights.length ? allInsights[ 0 ] : null
    });

    //this._resetState()
  }

  /**
   * if the operation was successful or not,
   * to remove from the array the last insight
   *
   * forceFetch
   * @private
   */
  _removeFromAllRated (saveCurrentInsights) {
    try {
      const { currentInsights, allRatedInsights } = this.state;
      const saveCurrentInsights = { ...currentInsights }
      const index = allRatedInsights.indexOf(saveCurrentInsights);
      allRatedInsights.splice(index, 1)

      if ( saveCurrentInsights ) {
        this.setState({ currentInsights: saveCurrentInsights })
      }

      this.props.relay.forceFetch()
    } catch ( e ) {
    }
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
    if ( currentInsights.confirmation ) {
      this.setState({
        comment_bad: true
      })
    } else {
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
    const saveCurrentInsights = { ...currentInsights }
    let setting = {
      velocity: { x: clamp(100 * -1, 3, 5) * -3, y: 0 },
      deceleration: 0.98,
      ...params
    }

    Animated
      .decay(this.state.pan, setting)
      .start(this._resetState)

    dislikeInsightInTopic(currentInsights)
      .then((tran)=> {
        this._removeFromAllRated()
      })
      .catch((error)=> {
        this._removeFromAllRated(saveCurrentInsights)
      })
  }


  /**
   *
   * @private
   */
  _onLikeInsight (opt_params = true) {
    const { currentInsights } = this.state;
    const saveCurrentInsights = { ...currentInsights }
    let setting = {
      velocity: { x: clamp(7, 3, 5), y: 0 },
      deceleration: 0.98
    }

    Animated
      .decay(this.state.pan, setting)
      .start(this._resetState)

    likeInsightInTopic(currentInsights, opt_params)
      .then((tran)=> {
        this._removeFromAllRated()
      })
      .catch((error)=> {
        this._removeFromAllRated(saveCurrentInsights)
      })
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


  /**
   * show comment_good screen or go to user_collections and reset card
   *
   * @param param - ignore or not {currentInsights.confirmation}
   * @param evt
   * @private
   */
  _onAddToCollection (param, evt) {
    const { currentInsights } = this.state;
    if ( currentInsights.confirmation && param != 'ignore' ) {
      this.setState({ comment_good: true })
    } else {
      setTimeout(()=> { this._onLikeInsight(false) }, 0)
      this._navigatorPush('user_collections', '', this.state.currentInsights)
    }
  }

  _onShare () {
    const { currentInsights } = this.state;
    ActionSheetIOS.showShareActionSheetWithOptions({
        url: currentInsights.origin.url || '',
        message: currentInsights.content,
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
    this.setState({ comment_bad: false })

    if ( opt_param == 'delete' ) {
      setTimeout(()=> {
        this._animationCardLeftAndReset()
      }, 300)
    } else {
      this._returnCardToStartingPosition()
    }
  }

  _commentGoodContinue () {
    this._onAddToCollection('ignore')
    setTimeout(()=> {
      this.setState({ comment_good: false })
    }, 300)
  }

  _continueLearning () {
    setTimeout(()=> {
      this.setState({ topic_finished: false })
    }, 300)
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
      comment_good,
      comment_bad,
      shareControl,
      addControl,
      allfor_now,
      all_ended,
      topic_finished
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
    
    /*if(this.props.readyState){
      return <Loader />
    }*/

    if ( comment_bad ) {
      return <CommentBad {...this.props} undo={this._commentBadUndo.bind(this)}/>
    } else if ( comment_good ) {
      return <CommentGood {...this.props} continue={this._commentGoodContinue.bind(this)}/>
    } else if ( allfor_now ) {
      return <AllForNow {...this.props} />
    } else if ( all_ended ) {
      return <AllEnded {...this.props} />
    } else if ( topic_finished ) {
      return <TopicFinished {...this.props} continueLearning={this._continueLearning}/>
    }

    return (!currentInsights ? null :
        <View style={ styles.container }>
          {!showCardTopicName ? null :
            <TitleAdvice topicName={currentInsights.relationTopic.name ||  '' }/>}

          <Animated.View style={[styles.card, animatedCardStyles]}
            {...this._panResponder.panHandlers}>
            <Insight
              navigator={this.props.navigator}
              insight={currentInsights}
              styleText={styles.cardText}
              onPressCard={this._onPressCard}/>
          </Animated.View>


          {/* controls share */}

          <View style={[styles.wrapperAddCardControl, {top}]}>
            <Animated.View style={[{width : CONTROLS_WIDTH}, shareStyle]}>
              <View ref={SHARE_CARD_REF} style={{flex: 1}}>
                <ShareCard
                  currentInsights={currentInsights}
                  onShare={this._onShare.bind(this)}/>
              </View>
            </Animated.View>

            <Animated.View style={[{width : CONTROLS_WIDTH}, addStyle]}>
              <View ref={ADD_CARD_REF} style={{flex: 1}}>
                <AddCard
                  currentInsights={currentInsights}
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
                  onPress={()=>{ this._onLikeInsight() }}>
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

const ReduxComponent = connect()(AdviceForMe)
var insightFragment = Relay.QL`
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
`;

var insightQuery = Relay.QL`
    fragment on TopicInsightsConnection {
        ratedCount
        unratedCount
        edges {
            node {
                ${insightFragment}
            }
        }
    }
`;

export default Relay.createContainer(ReduxComponent, {
  initialVariables: {
    countInsights: 100,
    filter: 'UNRATED',
    filterInsightsInCollection: 'ALL'
  },
  fragments: {
    node : () => Relay.QL`
        fragment on Topic {
            id
            name
            isSubscribedByViewer
            isPaid
            insights (first: $countInsights, filter : $filter) {
                edges {
                    node {
                        ${insightFragment}
                    }
                }
            }
        }
    `,
    viewer: () => Relay.QL`
        fragment on User {
            subscribedTopics : topics(first: 3, filter: SUBSCRIBED) {
                edges {
                    node {
                        id
                        name
                        isPaid
                        insights(first: $countInsights, filter: $filter ) {
                            ${insightQuery}
                        }
                    }
                }
            }
            collections(first: $countInsights) {
                edges {
                    node {
                        insights(first : $countInsights, filter : $filterInsightsInCollection) {
                            count
                            edges {
                                node {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        }
    `
  }
});
