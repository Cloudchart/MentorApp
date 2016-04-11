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
        fragment on MarkInsightUsefulInCollectionMutationPayload {
            insight
            insightID
            collection {
                id
                name
                insights
            }
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
        type: 'RANGE_ADD',
        parentName: 'collection',
        parentID: collection.id,
        connectionName: 'collections',
        edgeName: 'insightEdge',
        rangeBehaviors: {
          'filter(USELESS)': 'append'
        }
      }
    ]
  }
}

export default MarkInsightUsefulInCollectionMutation;

