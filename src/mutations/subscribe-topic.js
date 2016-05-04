import Relay from 'react-relay'

class SubscribeOnTopicMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { subscribeOnTopic }`
  }

  getVariables () {
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
          insights(first: 100, filter: UNRATED) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `
  }

  getConfigs () {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          topic: this.props.topic.id,
          user: this.props.user.id
        }
      }, {
        type: 'RANGE_ADD',
        parentName: 'user',
        parentID: this.props.user.id,
        connectionName: 'topics',
        edgeName: 'topicEdge',
        rangeBehaviors: {
          '' : 'append',
          'filter(DEFAULT)' : 'remove',
          'filter(SUBSCRIBED)': 'append'
        }
      }
    ]
  }

}


export default SubscribeOnTopicMutation
