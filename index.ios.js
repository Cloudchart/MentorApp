import React, {
    AppRegistry,
    Component,
    PushNotificationIOS,
    AlertIOS
} from 'react-native';
import moment from "moment";
import {Provider} from 'react-redux';
import store from './app/store';
import DeviceInfo from "react-native-device-info";
import Router from './app/router';
import { SAVE_UNIQUE_ID_AND_DATE, UPDATE_APP_START_TIME } from "./app/module_dal/actions/actions";


class Mentor extends Component {

  constructor(props) {
    super(props)
    this.state = {}

    PushNotificationIOS.addEventListener('register', this._register.bind(this));
    PushNotificationIOS.addEventListener('notification', this._notification.bind(this));

    store.dispatch({
      type: SAVE_UNIQUE_ID_AND_DATE,
      id: DeviceInfo.getUniqueID(),
      appStart : moment()
    })
  }

  _register(token) {
    //console.log('You are registered and the device token is: ', token)
  }

  _notification(notification) {
    AlertIOS.alert(
        'Notification Received',
        'Alert message: ' + notification.getMessage(),
        [{
          text: 'Dismiss',
          onPress: null
        }]
    );
  }

  render() {
    return (
        <Provider store={store}>
          <Router {...this.props} store={store} />
        </Provider>
    )
  }
}


AppRegistry.registerComponent('Mentor2', () => Mentor);
