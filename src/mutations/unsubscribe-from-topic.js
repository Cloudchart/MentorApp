import Relay from 'react-relay'

export default class UnsubscribeFromTopicMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { unsubscribeFromTopic }`
  }

  getVariables() {
    return {
      topicID: this.props.topic.id,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UnsubscribeFromTopicMutationPayload {
        topic {
          isSubscribedByViewer
        }
        user {
          topics {
            availableSlotsCount
          }
        }
      }
    `
  }

  getConfigs() {
    const { user, topic } = this.props
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        topic: topic.id,
        user: user.id,
      },
    }]
  }
}
