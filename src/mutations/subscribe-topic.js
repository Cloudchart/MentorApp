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
    const { user, topic } = this.props
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        topic: topic.id,
        user: user.id,
      },
    }, {
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: user.id,
      connectionName: 'topics',
      edgeName: 'topicEdge',
      rangeBehaviors: {
        '': 'append',
        'filter(DEFAULT)': 'remove',
        'filter(SUBSCRIBED)': 'append'
      },
    }]
  }
}

export default SubscribeOnTopicMutation
