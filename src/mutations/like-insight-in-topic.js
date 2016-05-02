import Relay from 'react-relay'

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
        insight
        insightID
        topic
        insightEdge
      }
    `
  }

  getConfigs() {
    const { insight, topic } = this.props
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        insight: this.props.insight.id
      }
    }, {
    //  type: 'RANGE_DELETE',
    //  parentName: 'insights',
    //  parentID: this.props.insight.id,
    //  connectionName: 'insightEdge',
    //  deletedIDFieldName: 'insightID',
    //  pathToConnection: ['user', 'insights'],
    //}, {
      type: 'RANGE_ADD',
      parentName: 'insight',
      parentID: this.props.insight.id,
      connectionName: 'insights',
      edgeName: 'insightEdge',
      rangeBehaviors: {
        'filter(RATED)': 'append',
        'filter(UNRATED)': 'remove'
      }
    }]
  }
}

export default LikeInsightInTopicMutation
