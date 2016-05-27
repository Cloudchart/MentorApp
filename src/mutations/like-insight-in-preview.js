import Relay from 'react-relay'

export default class LikeInsightInPreviewMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { likeInsightInTopic }`
  }

  getVariables() {
    const { insight, topic } = this.props
    return {
      insightID: insight.id,
      topicID: topic.id,
      shouldAddToUserCollectionWithTopicName: true,
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
        }
        user {
          id
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
    // }, {
    //   type: 'RANGE_ADD',
    //   parentName: 'topic',
    //   parentID: topic.id,
    //   connectionName: 'insights',
    //   edgeName: 'insightEdge',
    //   rangeBehaviors: {
    //     'filter(PREVIEW)': 'remove',
    //   },
    }]
  }
}

