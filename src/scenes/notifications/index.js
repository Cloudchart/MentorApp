import React, {
  Component,
  Text,
  View,
  PushNotificationIOS,
  AlertIOS,
  AsyncStorage
} from 'react-native'
import Relay from 'react-relay'
import { Button, Boris, TransparentButton } from '../../components'
import { NOTIFICATIONS__PERMISSIONS_STATUS } from '../../storage'
import styles from './style'

const CHECK_PERMISSIONS_INTERVAL = 500
const NOTIFICATION_TEXT = 'I will send you advices during the day. Does it suit you?'

class NotificationsScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.checkPermissionsInterval = setInterval(
      this.handleCheckPermissions.bind(this),
      CHECK_PERMISSIONS_INTERVAL
    )
  }

  componentWillUnmount() {
    clearInterval(this.checkPermissionsInterval)
  }

  async handleCheckPermissions() {
    try {
      const permission = await AsyncStorage.getItem(NOTIFICATIONS__PERMISSIONS_STATUS)
      if (permission) {
        clearInterval(this.checkPermissionsInterval)
        // updateUserNotifications();
        this.props.navigator.resetTo({
          scene: 'insights',
          filter: 'UNRATED',
        })
      }
    } catch (err) {
      // nothing
    }
  }

  async handleRequestPermissionsPress() {
    try {
      PushNotificationIOS.requestPermissions()
      await AsyncStorage.setItem(NOTIFICATIONS__PERMISSIONS_STATUS, 'already_requested')
    } catch (err) {
      // nothing
    }
  }

  handleSkipPress() {
    // updateUserNotifications();
    this.props.navigator.resetTo({
      scene: 'insights',
      filter: 'UNRATED',
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Boris
          mood="positive"
          size="big"
          note={NOTIFICATION_TEXT}
          style={styles.boris}
          />
        <View style={styles.containerButtons}>
          <Button
            label="Turn on notifications"
            onPress={() => this.handleRequestPermissionsPress()}
            color="blue"
            />
          <TransparentButton
            label="Skip"
            onPress={() => this.handleSkipPress()}
            color="blue"
            style={styles.transparent}
            />
        </View>
      </View>
    )
  }
}

export default Relay.createContainer(NotificationsScene, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        notificationsSettings {
          startAt
          finishAt
          utcOffset
          timesToSend
        }
      }
    `,
  },
})
