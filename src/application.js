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
  NetInfo
} from 'react-native'
import Relay from 'react-relay'
import styles from './styles/base'
import { CustomSceneConfig } from './router-conf'
import { renderScreen } from './routes'
import { UserNotifications } from './components'
import moment from 'moment'
import { EventManager } from './event-manager'
import { NavigationBar, routeMapper } from './navigation-bar'
import {
  setUserPushToken,
  activateUser,
  resetUser,
  updateUserNotifications
} from './actions/user'
import {
  checkPermissions,
  NETAlert,
  checkNET
} from './system'
import {
  HIDE_NOTIFICATION,
  UPDATE_APP_START_TIME,
  UPDATE_APP_BACKGROUND_TIME,
} from './actions/application'


moment.createFromInputFallback = function (config) {
  config._d = new Date(config._i);
};

/**
 * Repaint white StatusBar
 * Do not forget to add in the info.plist:
 * UIViewControllerBasedStatusBarAppearance : NO
 */
StatusBar.setBarStyle(1);

class Application extends Component {

  constructor(props) {
    super(props)

    PushNotificationIOS.addEventListener('register', this.handlePushNotificationsRegister.bind(this))
    PushNotificationIOS.addEventListener('notification', this.handlePushNotificationsNotification.bind(this))

    AppState.addEventListener('change', this.handleAppStateChange.bind(this))
    NetInfo.addEventListener('change', this.handleNetInfoChange.bind(this));

    EventManager.on(HIDE_NOTIFICATION, () => {
      this.setState({ networkNone: false })
    })

    this.state = {
      appState: null,
      notifications: {
        network: 'No Internet Connection',
      },
      networkNone: false,
      currentAppState: '',
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
    const { viewer } = this.props
    setUserPushToken({
      user: viewer,
      token,
    })
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

  _activateUser() {
    activateUser({ user: this.props.viewer })
  }

  _resetUser() {
    resetUser({ user: this.props.viewer })
      .then(() => {
        this._activateUser()
      })
      .catch(() => {
        this._activateUser()
      })
  }

  prepareData(item) {
    if (_.isDate(item)) {
      item = item.toString();
    } else if (_.isObject(item)) {
      item = JSON.stringify(item);
    } else {
      item = String(item);
    }
    return item;
  }

  /**
   * comparing the time re-entry application
   * @param currentAppState
   * @private
   */
  _diffTimeStartApp(currentAppState, prevAppState) {
    switch (currentAppState) {
      case 'active':
        AsyncStorage.setItem(UPDATE_APP_START_TIME, this.prepareData(new Date))
        updateUserNotifications()
        break
      case 'background':
        AsyncStorage.setItem(UPDATE_APP_BACKGROUND_TIME, this.prepareData(new Date))
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
            scene: 'return_in_app',
            title: '',
          })
        }
      })
    }
  }

  /**
   * @param route
   * @param navigator
   * @returns {*}
   * @private
   */
  _renderScene(route, navigator) {
    const props = route.props || {}
    props.navigator = navigator
    console.log('renderScene', { route })
    return renderScreen(route.scene, {
      navigator,
      ...route,
      ...props
    })
  }

  render() {
    const { viewer } = this.props
    const { networkNone } = this.state
    const { subscribedTopics } = viewer
    let initialRoute;
    if(subscribedTopics.edges.length === 0) {
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
    return (
      <View style={styles.scene}>
        <Navigator
          ref={navigator => this._navigator = navigator}
          initialRoute={initialRoute}
          navigationBar={
            <NavigationBar routeMapper={routeMapper(viewer)} />
          }
          renderScene={(route, navigator) => this._renderScene(route, navigator)}
          configureScene={route => {
            if (route.FloatFromBottom) {
              return Navigator.SceneConfigs.FloatFromBottom
            }
            return CustomSceneConfig
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

export default Relay.createContainer(Application, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        email
        notificationsSettings {
          startAt
          finishAt
          utcOffset
          timesToSend
        }
        subscribedTopics: topics(first: 1, filter: SUBSCRIBED) {
          availableSlotsCount
          edges {
            node {
              id
            }
          }
        }
      }
    `
  }
})
