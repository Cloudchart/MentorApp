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
import NavigationBar, { routeMapper } from './navigation-bar'
import Loader from './components/loader'
import BannerNotification from './components/banner-notification'
import { checkPermissions } from './system'
import SetUserPushTokenMutation from './mutations/set-user-push-token'
import UpdateUserNotificationsSettingsMutation from './mutations/update-user-notifications-settings'
import {
  APPLICATION__IS_FIRST_LAUNCH,
  APPLICATION__START_TIME,
  APPLICATION__BACKGROUND_TIME,
} from './storage'

/**
 * Repaint white StatusBar
 * Do not forget to add in the info.plist:
 * - UIViewControllerBasedStatusBarAppearance : NO
 */
StatusBar.setBarStyle(1)

export default class Application extends Component {

  constructor(props, context) {
    super(props, context)
    // Build initial route according to fetched data
    console.log('Application constructor')
    if (!__DEV__){
      console.log('disable console.log');
      console.log = () => {}
    }
    this.state = {
      appState: null,
      notificationMessage: null,
      errorMessage: null,
      currentAppState: '',
      isFirstLaunchStateLoading: true,
      isBackgroundTimeStateLoading: true,
      initialRoute: null,
    }
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
    NetInfo.fetch().done(reach => {
      if (reach === 'none') {
        this._displayNetworkError()
      }
    })
  }

  componentDidMount() {
    AsyncStorage.getItem(APPLICATION__IS_FIRST_LAUNCH, (error, result) => {
      console.log('APPLICATION__IS_FIRST_LAUNCH: ', result)
      let isFirstLaunch
      if (result !== null) {
        isFirstLaunch = (result !== 'false')
      } else {
        // By default
        isFirstLaunch = true
      }
      this.setState({
        isFirstLaunch,
        isFirstLaunchStateLoading: false,
      })
    })
    AsyncStorage.getItem(APPLICATION__BACKGROUND_TIME, (error, result) => {
      console.log('APPLICATION__BACKGROUND_TIME: ', result)
      if (result) {
        try {
          const backgroundTime = JSON.stringify(result)
          if (backgroundTime > 0) {
            this.setState({
              previousBackgroundTime: backgroundTime,
              isBackgroundTimeStateLoading: false,
            })
          }
        } catch (err) {
          // nothing
        }
      }
      this.setState({
        isBackgroundTimeStateLoading: false,
      })
    })
  }

  handleAppStateChange(currentAppState) {
    const prevAppState = this.state.currentAppState
    console.log('appStateChange: ', { currentAppState, prevAppState })
    const now = Date.now()
    switch (currentAppState) {
      case 'active':
        AsyncStorage.setItem(APPLICATION__START_TIME, now.toString())
        this._updateUserNotificationSettings({
          startAt: moment(now).format('HH:MM'),
        })
        break
      case 'background':
        AsyncStorage.setItem(APPLICATION__BACKGROUND_TIME, now.toString())
        this._updateUserNotificationSettings({
          finishAt: moment(now).format('HH:MM'),
        })
        break
      default:
        // AsyncStorage.setItem(UPDATE_APP_INACTIVE_TIME, this.prepareData(new Date))
        break
    }
    this.setState({
      currentAppState,
    })
    if (currentAppState == 'active') {
      NetInfo.fetch().done(reach => {
        if (reach == 'none') {
          this._displayNetworkError()
        }
      })
      // checkPermissions()
    }
  }

  handleNetInfoChange(reach) {
    const { currentAppState } = this.state
    if (reach === 'none' && currentAppState !== 'background') {
      this._displayNetworkError()
    }
  }

  handlePushNotificationsRegister(token) {
    // const mutation = new SetUserPushTokenMutation({
    //   user: this.props.viewer,
    //   token,
    // })
    // Relay.Store.commitUpdate(mutation)
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

  _updateUserNotificationSettings(data) {
    // const finalData = {
    //   ...data,
    //   utcOffset: moment().utcOffset(),
    //   timesToSend: 0,
    // }
    // const mutation = new UpdateUserNotificationsSettingsMutation(finalData)
    // Relay.Store.commitUpdate(mutation)
  }

  render() {
    console.log('Application.render()')
    const {
      isFirstLaunchStateLoading, isBackgroundTimeStateLoading,
      isFirstLaunch, previousBackgroundTime,
      notificationMessage, errorMessage,
    } = this.state
    if (isFirstLaunchStateLoading || isBackgroundTimeStateLoading) {
      return (
        <Loader />
      )
    }
    const initialRoute = {
      scene: 'starter',
      isFirstLaunch,
      previousBackgroundTime,
    }
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

// export default Relay.createContainer(Application, {
//   fragments: {
//     viewer: () => Relay.QL`
//       fragment on User {
//         id
//       }
//     `,
//   },
// })
