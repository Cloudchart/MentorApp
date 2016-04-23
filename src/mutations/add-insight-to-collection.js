import Relay from 'react-relay'

class AddInsightToCollectionMutation extends Relay.Mutation {

  getVariables () {
    const { insight, collection } = this.props;
    return {
      insightID: insight.id,
      collectionID: collection.id
    }
  }

  getMutation () {
    return Relay.QL`mutation { addInsightToCollection }`
  }

  getFatQuery () {
    return Relay.QL`
        fragment on AddInsightToCollectionMutationPayload {
            insight
            insightID
            collection
            insightEdge
        }
    `
  }

  getConfigs () {
    const { insight } = this.props;
    return [
      {
        type: "FIELDS_CHANGE",
        fieldIDs: {
          insight: insight.id
        }
      } ];
  }
}

export default AddInsightToCollectionMutation;
