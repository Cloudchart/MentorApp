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
import BannerNotification from './components/banner-notification'
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
  UPDATE_APP_START_TIME,
  UPDATE_APP_BACKGROUND_TIME,
} from './actions/application'
import SetUserPushTokenMutation from './mutations/set-user-push-token'

moment.createFromInputFallback = function (config) {
  config._d = new Date(config._i)
}

/**
 * Repaint white StatusBar
 * Do not forget to add in the info.plist:
 * - UIViewControllerBasedStatusBarAppearance : NO
 */
StatusBar.setBarStyle(1)

export default class Application extends Component {

  constructor(props, context) {
    super(props, context)
    // Bind event handlers to component instance
    this._handlePushNotificationsRegister = this.handlePushNotificationsRegister.bind(this)
    this._handlePushNotificationReceived = this.handlePushNotificationReceived.bind(this)
    this._handleAppStateChange = this.handleAppStateChange.bind(this)
    this._handleNetInfoChange = this.handleNetInfoChange.bind(this)
    // Attach event handlers
    PushNotificationIOS.addEventListener('register', this._handlePushNotificationsRegister)
    PushNotificationIOS.addEventListener('notification', this._handlePushNotificationReceived)
    AppState.addEventListener('change', this._handleAppStateChange)
    NetInfo.addEventListener('change', this._handleNetInfoChange)
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
      notificationMessage: null,
      errorMessage: null,
      currentAppState: '',
      initialRoute,
    }
    checkNET().then(reach => {
      if (reach === 'none') {
        this._displayNetworkError()
      }
    })
    setTimeout(() => this.setState({ notificationMessage: 'Push message test' }))
  }

  handleAppStateChange(currentAppState) {
    console.log('appStateChange: ', currentAppState)
    const { networkErrorMessage } = this.state
    const prevAppState = this.state.appState
    this.setState({
      appState: currentAppState,
    })
    if (!networkErrorMessage) {
      this._diffTimeStartApp(currentAppState, prevAppState)
    }
    if (currentAppState == 'active') {
      checkNET().then(reach => {
        if (reach == 'none') {
          this._displayNetworkError()
        }
      })
      // checkPermissions()
    }
  }

  handleNetInfoChange(reach) {
    const { currentAppState } = this.state
    if (currentAppState !== 'background' && reach === 'none') {
      this._displayNetworkError()
    }
  }

  handlePushNotificationsRegister(token) {
    const mutation = new SetUserPushTokenMutation({
      user: this.props.viewer,
      token,
    })
    Relay.Store.commitUpdate(mutation)
  }

  handlePushNotificationReceived(notification) {
    this.setState({
      notificationMessage: notification && notification.getMessage(),
    })
  }

  _displayNetworkError() {
    this.setState({
      errorMessage: 'No Internet Connection',
    })
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
    console.log('Application.render()')
    const { initialRoute, notificationMessage, errorMessage } = this.state
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
        {notificationMessage && (
          <BannerNotification
            style={styles.pushNotification}
            timeout={30000}
            onHide={() => this.setState({ notificationMessage: null })}
            >
            {notificationMessage}
          </BannerNotification>
        )}
        {errorMessage && (
          <BannerNotification
            style={styles.errorNotification}
            onHide={() => this.setState({ errorMessage: null })}
            >
            {errorMessage}
          </BannerNotification>
        )}
      </View>
    )
  }
}

Relay.createContainer(Application, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
})
