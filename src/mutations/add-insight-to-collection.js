import Relay from 'react-relay'

export default class AddInsightToCollectionMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { addInsightToCollection }`
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
