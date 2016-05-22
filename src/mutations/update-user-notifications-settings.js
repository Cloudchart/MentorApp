import Relay from 'react-relay'

export default class UpdateUserNotificationsSettingsMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { updateUserNotificationsSettings }`
  }

  getVariables() {
    const { startAt, finishAt, utcOffset, timesToSend } = this.props
    const variables = {
      startAt,
      utcOffset,
      timesToSend,
    }
    if (finishAt) {
      variables.finishAt = finishAt
    }
    return variables
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateUserNotificationsSettingsPayload {
        notificationsSettings
      }
    `
  }

  getConfigs() {
    return []
  }
}
