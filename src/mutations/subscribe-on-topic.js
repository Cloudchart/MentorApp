import Relay from 'react-relay'

export default class SubscribeOnTopicMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { subscribeOnTopic }`
  }

  getVariables() {
    return {
      topicID: this.props.topic.id,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SubscribeOnTopicMutationPayload {
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
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        topic: this.props.topic.id,
        user: this.props.user.id,
      },
    }]
  }
}
