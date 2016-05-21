import Relay from 'react-relay'

export default class DislikeInsightInFollowUpMutation extends Relay.Mutation {
  
  getMutation() {
    return Relay.QL`mutation { dislikeInsightInTopic }`
  }

  getVariables() {
    const { insight, topic } = this.props
    return {
      insightID: insight.id,
      topicID: topic.id,
    }
  }

  getFatQuery () {
    return Relay.QL`
      fragment on DislikeInsightInTopicMutationPayload {
        insight {
          id
        }
        topic {
          id
        }
        user {
          id
        }
      }
    `
  }

  getConfigs() {
    const { insight, topic, user } = this.props
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        insight: insight.id,
        topic: topic.id,
        user: user.id,
      },
    }]
  }
}
