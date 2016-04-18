import Relay from 'react-relay'

class MarkInsightUsefulInCollectionMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { markInsightUsefulInCollection }`
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
        fragment on MarkInsightUsefulInCollectionMutationPayload @relay(pattern: true) {
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

export default MarkInsightUsefulInCollectionMutation;

