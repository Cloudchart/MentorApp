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
            insight
            insightID
            collection
            insightEdge
        }
    `
  }

  getConfigs () {
    const { insight, collection } = this.props;
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          insight: insight.id,
          collection: collection.id
        }
      }, {
        type: 'RANGE_DELETE',
        parentName: 'collection',
        parentID: collection.id,
        connectionName: 'collections',
        deletedIDFieldName: 'insightID',
        pathToConnection: [ 'user', 'collections' ]
      }
    ]
  }
}


export default MarkInsightUselessInCollectionMutation;

