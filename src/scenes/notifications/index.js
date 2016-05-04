import React, {
  Component,
  Text,
  View,
  PushNotificationIOS,
  AlertIOS,
  AsyncStorage
} from "react-native";
import Relay from 'react-relay';
import { Button, Boris, TransparentButton } from "../../components";
import { STORAGE_KEY } from "../../actions/application";
import { updateUserNotifications } from "../../actions/user";
import styles from "./style";

const NOTIFICATION_TEXT = 'I will send you advices during the day. Does it suit you?';

class NotificationsScreen extends Component {

  constructor (props) {
    super(props)

    /**
     * resolution on notification
     * @type {number}
     */
    this.intervalId = setInterval(this.checkPermission.bind(this), 500)
    this._requestPermissions = this._requestPermissions.bind(this)
    this._customAlert = this._customAlert.bind(this)
  }


  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  /**
   *
   */
  async checkPermission () {
    try {
      let permission = await AsyncStorage.getItem(STORAGE_KEY);
      if ( permission ) {
        clearInterval(this.intervalId)
        this._navigatorReplace({
          scene: 'insights',
          filter: 'UNRATED',
        })
      }
    } catch ( error ) {
    }
  }

  /**
   * ask for permission to receive notifications
   * If ever there were a system popup, the record value in AsyncStorage
   * @private
   */
  async _requestPermissions () {
    try {
      PushNotificationIOS.requestPermissions();
      await AsyncStorage.setItem(STORAGE_KEY, 'already_request_permissions');
    } catch ( error ) {
    }
  }

  /**
   * call before you ask permission to be notified
   * @private
   */
  _customAlert () {
    AlertIOS.alert('', NOTIFICATION_TEXT, [
        { text: 'Cancel', onPress: () => {} },
        { text: 'OK', onPress: this._requestPermissions }
      ]
    );
  }

  _navigatorReplace(params) {
    const { navigator } = this.props;
    updateUserNotifications();
    navigator.resetTo(params)
  }

  handleSkipPress() {
    this._navigatorReplace({
      scene: 'insights',
      filter: 'UNRATED',
    })
  }

  render () {
    return (
      <View style={ styles.container }>
        <Boris
          mood="positive"
          size="big"
          note={NOTIFICATION_TEXT}
          style={ styles.boris }
        />

        <View style={ styles.containerButtons }>
          <Button
            label="Turn on notifications"
            onPress={this._requestPermissions}
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

export default Relay.createContainer(NotificationsScreen, {
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
    `
  }
});

