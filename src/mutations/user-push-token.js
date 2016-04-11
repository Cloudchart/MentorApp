import Relay from 'react-relay'

class SetUserPushTokenMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { setUserPushToken }`
  }

  getVariables () {
    return {
      token: this.props.token
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on SetUserPushTokenPayload {
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


export default SetUserPushTokenMutation

