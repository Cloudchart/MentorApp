import Relay from 'react-relay'

class UnsubscribeFromTopic extends Relay.Mutation {

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
    return Relay.QL`mutation { unsubscribeFromTopic }`
  }

  getVariables() {
    return {
      topicID: this.props.topic.id
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UnsubscribeFromTopicMutationPayload {
        topic {
          isSubscribedByViewer
        }
        topicID
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
        type: 'RANGE_DELETE',
        parentName: 'user',
        parentID: this.props.user.id,
        connectionName: 'topics',
        deletedIDFieldName: 'topicID',
        pathToConnection: ['user', 'topics'],
      }
    ]
  }

}


export default UnsubscribeFromTopic
