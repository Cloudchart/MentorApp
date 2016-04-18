import Relay from 'react-relay'

class AddCollectionToUserMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { addCollectionToUser }`
  }

  getVariables () {
    return {
      name: this.props.collection.name
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on AddCollectionToUserMutationPayload @relay(pattern: true) {
            collection {
                id
                name
            }
            collectionID
            collectionEdge
        }
    `
  }

  getConfigs () {
    const { user } = this.props;
    return [
      {
        type: 'REQUIRED_CHILDREN',
        children: [
            Relay.QL`
                fragment on AddCollectionToUserMutationPayload {
                    collection {
                        id
                        name
                    }
                    collectionID
                    collectionEdge
                }
          `
        ]
      }
    ]
  }
}


export default AddCollectionToUserMutation

