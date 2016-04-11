import Relay from 'react-relay'

class ResetUserMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { resetUser }`
  }

  getVariables () {
    return {
      userId: this.props.user.id
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on ResetUserPayload {
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


export default ResetUserMutation

