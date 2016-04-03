import Relay from 'react-relay'

class ActivateUserMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { activateUser }`
  }

  getVariables () {
    return {
      userId: this.props.user.id
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on ActivateUserPayload {
            user
        }
    `
  }

  getConfigs () {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          user: this.props.user
        }
      }
    ]
  }

}


export default ActivateUserMutation

