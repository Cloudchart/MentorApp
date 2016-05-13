import Relay from 'react-relay'

export default class SetUserPushTokenMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { setUserPushToken }`
  }

  getVariables() {
    return {
      token: this.props.token,
      userId: this.props.user.id,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SetUserPushTokenPayload {
        user
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      },
    }]
  }
}
