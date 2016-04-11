import Relay from 'react-relay'

class AddInsightToCollectionMutation extends Relay.Mutation {

  static fragments = {
    collection: () => Relay.QL`
        fragment on UserCollection {
            id
        }
    `
  };


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
            insight {
                id
                content
            }
            insightID
            insightEdge
        }
    `
  }

  getConfigs () {
    const { collection, insight } = this.props;
    return [
      {
        type: "FIELDS_CHANGE",
        fieldIDs: {
          insight: insight.id
        }
      },
      {
        type: 'RANGE_ADD',
        parentName: 'insight',
        parentID: insight.id,
        connectionName: 'insight',
        edgeName: 'insightEdge',
        rangeBehaviors: {
          '': 'append',
          'filter(ALL)': 'append'
        }
      }
    ];
  }
}

export default AddInsightToCollectionMutation;
