import React, {
    Component,
    Text,
    View,
    PushNotificationIOS
} from "react-native";
import { Button, Boris, TransparentButton } from "../../components";
import { connect } from "react-redux";
import styles from "./style";


class NotificationsScreen extends Component {

  constructor (props) {
    super(props)

    /**
     * resolution on notification
     * @type {number}
     */
    this.intervalId = setInterval(()=> {
      PushNotificationIOS.checkPermissions((permissions) => {
        const { badge, sound, alert } = permissions;
        if ( badge || sound || alert ) {
          clearInterval(this.intervalId)
          setTimeout(()=> {
            this._navigatorReplace('advice_for_me')
          }, 500)
        }
      });
    }, 500)

    this._requestPermissions = this._requestPermissions.bind(this)
  }


  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  _requestPermissions () {
    PushNotificationIOS.requestPermissions();
  }

  _navigatorReplace (scene, title = "") {
    const { navigator } = this.props;
    navigator.replace({ scene, title: title || scene })
  }

  render () {

    return (
        <View style={ styles.container }>
          <Boris
              mood="positive"
              size="big"
              note="I will send you advices during the day. Does it suit you?"
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
                onPress={ ()=>{ this._navigatorReplace('advice_for_me') }}
                color="blue"
                style={styles.transparent}
            />
          </View>
        </View>
    )
  }
}

export default connect(state => ({
  user: state.user
}))(NotificationsScreen)
