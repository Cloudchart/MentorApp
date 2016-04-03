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
    return {
      insightID: this.props.insight.id,
      collectionID: this.props.collection.id
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on AddInsightToCollectionMutationPayload {
            insight {
                id
                content
            }
            insightEdge
        }
    `
  }

  getConfigs () {
    return [
      {
        type: 'REQUIRED_CHILDREN',
        children: [
            Relay.QL`
                fragment on AddInsightToCollectionMutationPayload {
                    insight {
                        id
                        content
                    }
                    insightEdge
                }
          `
        ]
      }
    ]
  }

  getOptimisticResponse() {
    return {
      insight: {
        id : this.props.insight.id,
        content : this.props.insight.content
      }
    };
  }
}

export default AddInsightToCollectionMutation;
