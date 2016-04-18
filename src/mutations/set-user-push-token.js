import Relay from 'react-relay'

class SetUserPushTokenMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { setUserPushToken }`
  }

  getVariables () {
    const { token, user } = this.props;
    return {
      token: token,
      userId : user.id
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
    const { token, user } = this.props;
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          user: user.id
        }
      }
    ]
  }

}


export default SetUserPushTokenMutation

