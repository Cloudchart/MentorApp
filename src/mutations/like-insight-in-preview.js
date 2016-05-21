import Relay from 'react-relay'

export default class LikeInsightInPreviewMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { likeInsightInTopic }`
  }

  getVariables() {
    const { insight, topic, shouldAddToUserCollectionWithTopicName } = this.props
    return {
      insightID: insight.id,
      topicID: topic.id,
      shouldAddToUserCollectionWithTopicName,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on LikeInsightInTopicMutationPayload {
        insight {
          id
        }
        topic {
          id
          insights(first: 100, filter: PREVIEW) {
            edges {
              node {
                id
              }
            }
          }
        }
        insightEdge
        user {
          collections(first: 100) {
            edges {
              node {
                insights {
                  usefulCount
                  uselessCount
                }
              }
            }
          }
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
    }, {
      type: 'RANGE_ADD',
      parentName: 'topic',
      parentID: topic.id,
      connectionName: 'insights',
      edgeName: 'insightEdge',
      rangeBehaviors: {
        'filter(PREVIEW)': 'remove',
      },
    }]
  }
}

