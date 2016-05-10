import Relay from 'react-relay'

export default class MarkInsightUsefulInCollectionMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { markInsightUsefulInCollection }`
  }

  getVariables() {
    const { insight, collection } = this.props
    return {
      insightID: insight.id,
      collectionID: collection.id,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on MarkInsightUsefulInCollectionMutationPayload {
        insight {
          id
        }
        collection {
          id
          insights(first: 100, filter: ALL) {
            usefulCount
            uselessCount
            edges {
              node {
                id
              }
            }
          }
        }
        insightEdge
      }
    `
  }

  getConfigs() {
    const { insight, collection } = this.props
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        insight: insight.id,
        collection: collection.id,
      },
    }, {
      type: 'RANGE_ADD',
      parentName: 'collection',
      parentID: collection.id,
      connectionName: 'insights',
      edgeName: 'insightEdge',
      rangeBehaviors: {
        '': 'ignore',
        'filter(USEFUL)': 'append',
        'filter(USELESS)': 'remove',
      },
    }]
  }
}
