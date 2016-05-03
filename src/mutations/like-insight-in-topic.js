import Relay from 'react-relay'
import UsefulCounter from '../navigation-bar/useful-counter'

class LikeInsightInTopicMutation extends Relay.Mutation {
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
          isFinishedByViewer
        }
        insightEdge
        user {
          insights
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
    //  parentName: 'insights',
    //  parentID: this.props.insight.id,
    //  connectionName: 'insightEdge',
    //  deletedIDFieldName: 'insightID',
    //  pathToConnection: ['user', 'insights'],
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

export default LikeInsightInTopicMutation
