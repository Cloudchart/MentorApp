import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import {
  CommentBad,
  CommentGood,
  AllForNow,
  AllEnded,
  TopicFinished,
  RandomAdvice
} from '../../components/confirmation-screens/insights-parts';
import * as actions from '../../actions/actions';
import { SubscribeTopicAdd } from "../../components";

class ConfirmationScreens extends Component {

  constructor (props) {
    super(props)

    this._randomAdviceUndo = this._randomAdviceUndo.bind(this);
  }

  commentBad () {
    const { currentInsights } = this.props;
    if(!currentInsights) return;
    return (
      <CommentBad
        {...currentInsights.node}
        undo={this.props.commentBadUndo}/>
    )
  }

  commentGood () {
    const { currentInsights } = this.props;
    if(!currentInsights) return;
    return (
      <CommentGood
        {...currentInsights.node}
        {...this.props}
        continue={this.props.commentGoodContinue}/>
    )
  }

  allForNow () {
    return <AllForNow {...this.props} />
  }

  allEnded () {
    return <AllEnded {...this.props} />
  }

  topicFinished () {
    return <TopicFinished {...this.props}
      continueLearning={this.props.continueLearning}/>
  }

  subscribeTopicAdd () {
    const { currentInsights, viewer, navigator } = this.props;
    return (
      <SubscribeTopicAdd
        {...this.props}
        undo={()=>{ navigator.pop() }}
        user={this.props.viewer}
        topic={currentInsights ? currentInsights.topic : null}
        subscribedTopics={viewer.subscribedTopics}/>
    )
  }

  _randomAdviceUndo () {
    this.props.dispatch({ type: actions.ACTION_SHOW_RANDOM_ADVICE, show: false })
  }

  render () {
    const { condition, reactions } = this.props;

    switch ( condition ) {
      case 'comment_bad':
        return this.commentBad();
      case 'comment_good':
        return this.commentGood();
      case 'allfor_now':
        return this.allForNow();
      case 'all_ended':
        return this.allEnded();
      case 'topic_finished':
        return this.topicFinished();
      case 'add_demo_topic':
        return this.subscribeTopicAdd();
      default:
    }

    if ( reactions.show ) {
      return (
        <RandomAdvice
          {...this.props}
          undo={this._randomAdviceUndo}/>
      )
    }

    return null;
  }
}

export default connect(state => ({
  reactions: state.reactions
}))(ConfirmationScreens)
