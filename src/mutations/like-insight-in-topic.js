import Relay from 'react-relay'

class LikeInsightInTopicMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { likeInsightInTopic }`
  }

  getVariables () {
    const { insight, topic, shouldAddToUserCollectionWithTopicName } = this.props;
    return {
      insightID: insight.id,
      topicID: topic.id,
      shouldAddToUserCollectionWithTopicName: shouldAddToUserCollectionWithTopicName
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on LikeInsightInTopicMutationPayload {
            insight
            insightID
            topic
            insightEdge
        }
    `
  }

  getConfigs () {
    const { insight, topic } = this.props;
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          insight: insight.id,
          topic: topic.id
        }
      }, {
        type: 'RANGE_ADD',
        parentName: 'topic',
        parentID: topic.id,
        connectionName: 'topics',
        edgeName: 'insightEdge',
        rangeBehaviors: {
          'filter(RATED)': 'append'
        }
      }
    ]
  }
}

export default LikeInsightInTopicMutation;
