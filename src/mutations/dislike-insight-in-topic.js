import Relay from 'react-relay'

export default class DislikeInsightInTopicMutation extends Relay.Mutation {
  
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
          isFinishedByViewer
        }
        insightEdge
        user {
          insights(first: 100, filter: UNRATED) {
            edges {
              node {
                id
              }
            }
          }
          collections(first: 100) {
            edges {
              node {
                insights {
                  usefulCount
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
    //  type: 'RANGE_DELETE',
    //  parentName: 'topic',
    //  parentID: topic.id,
    //  connectionName: 'topics',
    //  deletedIDFieldName: 'insightID',
    //  pathToConnection: ['user', 'topics']
    //}, {
      type: 'RANGE_ADD',
      parentName: 'topic',
      parentID: topic.id,
      connectionName: 'insights',
      edgeName: 'topicInsightEdge',
      rangeBehaviors: {
        'filter(RATED)': 'append',
        'filter(UNRATED)': 'remove',
      },
    }]
  }
}

