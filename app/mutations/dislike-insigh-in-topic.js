import Relay from 'react-relay'

class DislikeInsightInTopicMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { dislikeInsightInTopic }`
  }

  getVariables () {
    return {
      insightID: this.props.insight.id,
      topicID: this.props.topic.id
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on DislikeInsightInTopicMutationPayload {
            insight
            insightID
            topic
            insightEdge
        }
    `
  }

  getConfigs () {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          insight: this.props.insight.id,
          topic: this.props.insight.topic
        }
      },
      {
        type: 'RANGE_ADD',
        parentName: 'topic',
        parentID: this.props.topic.id,
        connectionName: 'topics',
        edgeName: 'insightEdge',
        rangeBehaviors: {
          'filter(RATED)': 'append'
        }
      }
    ]
  }
}

export default DislikeInsightInTopicMutation;
