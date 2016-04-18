import Relay from 'react-relay'

class MarkInsightUselessInCollectionMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { markInsightUselessInCollection }`
  }

  getVariables () {
    const { insight, collection } = this.props;
    return {
      insightID: insight.id,
      collectionID: collection.id
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on MarkInsightUselessInCollectionMutationPayload {
            collection
            insight
            insightID
            insightEdge
        }
    `
  }

  getConfigs () {
    const { insight, collection } = this.props;
    return [ {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        insight: insight.id
      }
    } ]
  }
}


export default MarkInsightUselessInCollectionMutation;

