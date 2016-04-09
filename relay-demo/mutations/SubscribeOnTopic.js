import Relay from 'react-relay'

class SubscribeOnTopic extends Relay.Mutation {

  static fragments = {
    topic: () => Relay.QL`
      fragment on Topic {
        id
      }
    `,

    user: () => Relay.QL`
      fragment on User {
        id
      }
    `
  };

  getMutation() {
    return Relay.QL`mutation { subscribeOnTopic }`
  }

  getVariables() {
    return {
      topicID: this.props.topic.id
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SubscribeOnTopicMutationPayload {
        topic {
          isSubscribedByViewer
        }
        topicEdge
        user {
          topics
        }
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          topic: this.props.topic.id
        }
      }, {
        type: 'RANGE_ADD',
        parentName: 'user',
        parentID: this.props.user.id,
        connectionName: 'topics',
        edgeName: 'topicEdge',
        rangeBehaviors: {
          'filter(SUBSCRIBED)': 'append'
        }
      }
    ]
  }

}


export default SubscribeOnTopic
