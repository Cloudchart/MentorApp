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
        fragment on AddCollectionToUserMutationPayload {
            collection {
                id
                name
            }
            collectionEdge
        }
    `
  }

  getConfigs () {
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
                    collectionEdge
                }
          `
        ]
      }
    ]
  }
}


export default AddCollectionToUserMutation

