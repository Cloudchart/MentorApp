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
        topicID
        topicEdge
        user {
          insights(first: 1, filter: UNRATED) {
            edges {
              node {
                id
                content
              }
            }
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
    }, {
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: user.id,
      connectionName: 'topics',
      edgeName: 'topicEdge',
      rangeBehaviors: {
        'filter(DEFAULT)': 'append',
        'filter(SUBSCRIBED)': 'append'
      },
    }]
  }
}
