import Relay from 'react-relay'

class UserNotificationsSettingsMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { updateUserNotificationsSettings }`
  }

  getVariables () {
    return {
      startAt: this.props.notification.startAt,
      finishAt: this.props.notification.finishAt,
      utcOffset: this.props.notification.utcOffset,
      timesToSend: this.props.notification.timesToSend
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on UpdateUserNotificationsSettingsPayload {
            notificationsSettings
        }
    `
  }

  getConfigs () {
    return [ {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        startAt: this.props.notification.startAt
      }
    }, {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        finishAt: this.props.notification.finishAt
      }
    }, {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        utcOffset: this.props.notification.utcOffset
      }
    }, {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        timesToSend: this.props.notification.timesToSend
      }
    } ]
  }

}


export default UserNotificationsSettingsMutation

