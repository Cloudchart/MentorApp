import React, {
  Component,
  Navigator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PushNotificationIOS,
  AppState,
  AlertIOS,
  AsyncStorage,
  NetInfo,
} from 'react-native'
import Relay from 'react-relay'
import moment from 'moment'
import styles from './styles/base'
import renderScene from './render-scene'
import { CustomFloatFromRight } from './scene-configs'
import { UserNotifications } from './components'
import { EventManager } from './event-manager'
import NavigationBar, { routeMapper } from './navigation-bar'
import {
  updateUserNotifications,
} from './actions/user'
import {
  checkPermissions,
  NETAlert,
  checkNET,
} from './system'
import {
  HIDE_NOTIFICATION,
  UPDATE_APP_START_TIME,
  UPDATE_APP_BACKGROUND_TIME,
} from './actions/application'
import SetUserPushTokenMutation from './mutations/set-user-push-token'


moment.createFromInputFallback = function (config) {
  config._d = new Date(config._i);
};

/**
 * Repaint white StatusBar
 * Do not forget to add in the info.plist:
 * - UIViewControllerBasedStatusBarAppearance : NO
 */
StatusBar.setBarStyle(1);

export default class Application extends Component {

  constructor(props, context) {
    super(props, context)
    // Bind event handlers to component instance
    this._handlePushNotificationsRegister = this.handlePushNotificationsRegister.bind(this)
    this._handlePushNotificationsNotification = this.handlePushNotificationsNotification.bind(this)
    this._handleAppStateChange = this.handleAppStateChange.bind(this)
    this._handleNetInfoChange = this.handleNetInfoChange.bind(this)
    // Attach event handlers
    PushNotificationIOS.addEventListener('register', this._handlePushNotificationsRegister)
    PushNotificationIOS.addEventListener('notification', this._handlePushNotificationsNotification)
    AppState.addEventListener('change', this._handleAppStateChange)
    NetInfo.addEventListener('change', this._handleNetInfoChange)
    // @todo remove EventManager
    EventManager.on(HIDE_NOTIFICATION, () => {
      this.setState({ networkNone: false })
    })
    // Build initial route according to fetched data
    let initialRoute
    //const { subscribedTopics } = props.viewer
    console.log('Application constructor')
    //if (subscribedTopics.edges.length === 0) {
    if (true) {
      initialRoute = {
        scene: 'welcome',
        title: 'Virtual Mentor',
      }
    } else {
      initialRoute = {
        scene: 'insights',
        filter: 'UNRATED',
      }
    }
    this.state = {
      appState: null,
      notifications: {
        network: 'No Internet Connection',
      },
      networkNone: false,
      currentAppState: '',
      initialRoute,
    }
    checkNET().then(reach => {
      if (reach === 'none') {
        this.notifyNetworkError()
      }
    })
  }

  handleAppStateChange(currentAppState) {
    console.log('appStateChange: ', currentAppState)
    const { networkNone } = this.state
    const prevAppState = this.state.appState
    this.setState({
      appState: currentAppState,
    })
    if (!networkNone) {
      this._diffTimeStartApp(currentAppState, prevAppState)
    }
    if (currentAppState == 'active') {
      checkNET().then(reach => {
        if (reach == 'none') {
          this.notifyNetworkError()
        }
      })
      // checkPermissions()
    }
  }

  notifyNetworkError() {
    const { notifications } = this.state
    this.setState({
      networkNone: notifications.network,
    })
  }

  handleNetInfoChange(reach) {
    const { currentAppState } = this.state
    if (currentAppState !== 'background' && reach === 'none') {
      this.notifyNetworkError()
    }
  }

  handlePushNotificationsRegister(token) {
    //const mutation = new SetUserPushTokenMutation({
    //  user: viewer,
    //  token,
    //})
    //Relay.Store.commitUpdate(mutation)
  }

  handlePushNotificationsNotification(notification) {
    AlertIOS.alert(
      'Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null
      }]
    );
  }

  /**
   * comparing the time re-entry application
   * @param currentAppState
   * @private
   */
  _diffTimeStartApp(currentAppState, prevAppState) {
    switch (currentAppState) {
      case 'active':
        AsyncStorage.setItem(UPDATE_APP_START_TIME, (new Date()).toString())
        updateUserNotifications()
        break
      case 'background':
        AsyncStorage.setItem(UPDATE_APP_BACKGROUND_TIME, (new Date()).toString())
        updateUserNotifications(true)
        break
      default:
        // AsyncStorage.setItem(UPDATE_APP_INACTIVE_TIME, this.prepareData(new Date))
        break
    }
    if (currentAppState == 'active' && prevAppState !== 'inactive') {
      const now = moment()
      AsyncStorage.getItem(UPDATE_APP_BACKGROUND_TIME, (error, result) => {
        if (error || !result) return
        const backgroundDate = moment(result)
        if (!backgroundDate.diff) {
          return
        }
        const hours = Math.abs(backgroundDate.diff(now, 'hour'))
        if (hours >= 24) {
          this._navigator.resetTo({
            scene: 'return_to_app',
            title: '',
          })
        }
      })
    }
  }

  render() {
    //const { viewer } = this.props
    console.log('Application.render()')
    const { initialRoute, networkNone } = this.state
    return (
      <View style={styles.scene}>
        <Navigator
          ref={navigator => this._navigator = navigator}
          initialRoute={initialRoute}
          navigationBar={
            <NavigationBar routeMapper={routeMapper()} />
          }
          renderScene={(route, navigator) => renderScene(route, navigator)}
          configureScene={route => {
            if (route.FloatFromBottom) {
              return Navigator.SceneConfigs.FloatFromBottom
            }
            if (route.FloatFromLeft) {
              return Navigator.SceneConfigs.FloatFromLeft
            }
            return CustomFloatFromRight
          }}
          sceneStyle={styles.sceneStyle}
        />
        {networkNone && (
          <UserNotifications notification={networkNone}/>
        )}
      </View>
    )
  }
}

//Relay.createContainer(Application, {
//  fragments: {
//    viewer: () => Relay.QL`
//      fragment on User {
//        email
//        notificationsSettings {
//          startAt
//          finishAt
//          utcOffset
//          timesToSend
//        }
//        subscribedTopics: topics(first: 1, filter: SUBSCRIBED) {
//          availableSlotsCount
//          edges {
//            node {
//              id
//            }
//          }
//        }
//      }
//    `
//  }
//})
