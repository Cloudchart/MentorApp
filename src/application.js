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
import * as actions from './actions/actions'
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

  state = {
    notifications: {
      network: 'No Internet Connection'
    },
    networkNone: false,
    currentAppState: ''
  }

  constructor(props) {
    super(props)

    PushNotificationIOS.addEventListener('register', this._register.bind(this));
    PushNotificationIOS.addEventListener('notification', this._notification.bind(this));

    AppState.addEventListener('change', this._appStateChange.bind(this))
    NetInfo.addEventListener('change', this._NetInfo.bind(this));

    EventManager.on(actions.HIDE_NOTIFICATION, ()=> {
      this.setState({networkNone: false})
    });

    checkNET().then((reach)=> {
      if (reach == 'none') {
        this.notifyNetworkError();
      }
    });
  }

  _appStateChange(currentAppState) {
    this.state.currentAppState = currentAppState;

    if (!this.state.networkNone) {
      this._diffTimeStartApp(currentAppState);
    }

    if (currentAppState == 'active') {
      checkNET().then((reach)=> {
        if (reach == 'none') {
          this.notifyNetworkError()
        }
      })
      //checkPermissions();
    }
  }

  notifyNetworkError() {
    this.setState({
      networkNone: this.state.notifications.network
    })
  }

  _NetInfo(reach) {
    if (this.state.currentAppState != 'background' && reach == 'none') {
      this.notifyNetworkError()
    }
  }

  _register(token) {
    setUserPushToken({
      user: this.props.viewer,
      token
    })
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
  _diffTimeStartApp(currentAppState) {
    switch (currentAppState) {
      case 'active':
        AsyncStorage.setItem(actions.UPDATE_APP_START_TIME, this.prepareData(new Date))
        break
      case 'background':
        AsyncStorage.setItem(actions.APP_BACKGROUND_TIME, this.prepareData(new Date))
        break
      default:
        break
    }

    if (currentAppState == 'background') {
      updateUserNotifications(true)
    } else if (currentAppState == 'active') {
      updateUserNotifications()
    }

    if (currentAppState == 'active') {
      const now = moment()
      AsyncStorage.getItem(actions.APP_BACKGROUND_TIME, (err, result) => {
        if (err || !result) return
        const backgroundDate = moment(result)
        if (!backgroundDate.diff) {
          return
        }
        const diffHour = Math.abs(backgroundDate.diff(now, 'hour'))
        if (diffHour >= 24) {
          this._navigator.resetTo({
            scene: 'return_in_app',
            title: '',
          })
        }
      });
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
    return renderScreen({
      scene: route.scene,
      screenParams: {
        navigator,
        ...route,
        ...props
      },
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
