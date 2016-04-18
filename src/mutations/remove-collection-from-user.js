import Relay from 'react-relay'

class RemoveCollectionFromUserMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { removeCollectionFromUser }`
  }

  getVariables () {
    return {
      collectionID: this.props.collection.id
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on RemoveCollectionFromUserMutationPayload {
            collection
            collectionID
        }
    `
  }

  getConfigs () {
    return [
      {
        type: 'RANGE_DELETE',
        parentName: 'collection',
        parentID: this.props.collection.id,
        connectionName: 'collections',
        deletedIDFieldName: 'collectionID',
        pathToConnection: [ 'user', 'collections' ]
      },
      {
        type: 'NODE_DELETE',
        parentName: 'collection',
        parentID: this.props.collection.id,
        connectionName: 'collections',
        deletedIDFieldName: 'collectionID'
      }
    ]
  }
}

function filterCollections (collections, collectionId) {
  return collections.filter((item) => item.node.__dataID__ != collectionId)
}


export default RemoveCollectionFromUserMutation;
