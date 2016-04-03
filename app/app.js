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
} from "react-native";
import {
  Connect,
  AdviceForMe,
  Questionnaire,
  Welcome,
  Settings,
  Subscription,
  SystemThemesList,
  UserCollections,
  UserTopics,
  SelectTopic,
  ExploreTopics,
  NotificationsScreen,
  UserTopicsDetail,
  AllForNow,
  Profile,
  WebViewScreen,
  ReturnInApp,
  NetError
} from "./scenes";

import Relay from 'react-relay';
import styles from "./styles/base";
import { CustomSceneConfig } from "./router-conf";
import { renderScreen } from "./routes";
import { navBarRouteMapper } from "./components";
import moment from "moment";
import store from './store';
import { UPDATE_APP_START_TIME, APP_BACKGROUND_TIME } from "./actions/actions";
import DeviceInfo from "react-native-device-info";
import { FBSDKAccessToken } from "react-native-fbsdkcore";
import {
  setUserPushToken,
  activateUser,
  resetUser
} from "./actions/user";
import {
  checkPermissions,
  NETAlert,
  checkNET,
  recordNotifications,
  notificationMessages
} from './system';

/**
 * repaint white StatusBar
 * do not forget to add in the info.plist -  UIViewControllerBasedStatusBarAppearance : NO
 */
StatusBar.setBarStyle(1);


class Application extends Component {

  constructor (props) {
    super(props)
    this.state = {
      userIsAuthorize: '',
      returnInAppAfterOneMinute: false,
      currentAppState: ''
    }

    PushNotificationIOS.addEventListener('register', this._register.bind(this));
    PushNotificationIOS.addEventListener('notification', this._notification.bind(this));
    AppState.addEventListener('change', this._appStateChange.bind(this))
    NetInfo.addEventListener('change', this._NetInfo.bind(this));

    /**
     * if user is authorized show him screen advice_for_me
     */
    FBSDKAccessToken.getCurrentAccessToken((token)=> {
      if ( token ) {
        this.setState({ userIsAuthorize: token })
      } else {
        this.setState({ userIsAuthorize: false })
      }
    })

    checkNET(true)
  }

  /**
   *
   * @param currentAppState
   * @private
   */
  async _appStateChange (currentAppState) {
    this.state.currentAppState = currentAppState;
    try {
      this._diffTimeStartApp(currentAppState)
      if ( currentAppState == 'active' ) {
        checkNET(true)
        checkPermissions();
      }
    } catch ( e ) {
    }
  }

  /**
   *
   * @param reach
   * @private
   */
  _NetInfo (reach) {
    if ( this.state.currentAppState != 'background' && reach == 'none' ) {
      NETAlert()
    }
  }

  /**
   * Send
   * @param token
   * @private
   */
  _register (token) {
    setUserPushToken({ user: this.props.viewer, token })
  }

  _notification (notification) {
    AlertIOS.alert(
      'Notification Received',
      'Alert message: ' + notification.getMessage(),
      [ {
        text: 'Dismiss',
        onPress: null
      } ]
    );
  }

  _activateUser () {
    activateUser({ user: this.props.viewer })
  }

  _resetUser () {
    resetUser({ user: this.props.viewer })
  }

  /**
   * comparing the time re-entry application
   * @param currentAppState
   * @private
   */
  _diffTimeStartApp (currentAppState) {
    const now = moment();

    setTimeout(()=> {
      switch ( currentAppState ) {
        case 'active':
          store.dispatch({
            type: UPDATE_APP_START_TIME,
            appStart: now
          })
          break;
        case 'background':
          store.dispatch({
            type: APP_BACKGROUND_TIME,
            background: moment()
          })
          break;
        default:
      }
    }, 0)

    // add active
    if ( currentAppState == 'active' ) {
      const { application } = store.getState()
      if ( !application.background.diff ) return;
      const diffMinute = Math.abs(application.background.diff(now, 'minute'));
      const diffHour = Math.abs(application.background.diff(now, 'hour'));

      // after one minute
      if ( diffMinute > 1 ) {
        this.setState({
          returnInAppAfterOneMinute: true,
          currentAppState
        })
      }
    }
  }

  /**
   *
   * @param route
   * @param navigator
   * @returns {*}
   * @private
   */
  _renderScene (route, navigator) {
    let props = route.props || {}
    const { returnInAppAfterOneMinute } = this.state;
    props.navigator = navigator;

    const screenParams = {
      viewer: this.props.viewer,
      navigator,
      ...route,
      ...props
    }

    if ( returnInAppAfterOneMinute ) {
      this.state.returnInAppAfterOneMinute = false;
      route.scene = 'return_in_app_after_min';
    }

    return renderScreen({
      scene: route.scene,
      screenParams,
      currentAppState: this.state.currentAppState
    })
  }


  /**
   *
   * @returns {*|{LeftButton, Title, RightButton}}
   * @private
   */
  _navBarRouteMapper () {
    return navBarRouteMapper
  }

  render () {
    const { isActive } = this.props.viewer;
    const { userIsAuthorize } = this.state;
    let init_scene = (userIsAuthorize !== false) ? 'advice_for_me' : 'welcome';
    // || isActive

    if ( typeof userIsAuthorize == 'string' ) {
      return <View />
    }

    return <Navigator
      ref={ (navigator) => this._navigator = navigator }
      initialRoute={{ scene: init_scene, title : 'Virtual Mentor' }}
      navigationBar={<NavigationBar routeMapper={this._navBarRouteMapper()} />}
      renderScene={ this._renderScene.bind(this) }
      configureScene={(route, routeStack)=>CustomSceneConfig}
      sceneStyle={ styles.scene }
    />
  }
}


class NavigationBar extends Navigator.NavigationBar {
  render () {
    var routes = this.props.navState.routeStack;
    if ( routes.length ) {
      var route = routes[ routes.length - 1 ];
    }

    if ( route.sceneConfig && route.sceneConfig.hideBar ) {
      return null;
    }
    return super.render();
  }
}

export default Relay.createContainer(Application, {
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            isActive
            pushToken
            notificationsSettings {
                startAt
                finishAt
                utcOffset
                timesToSend
            }
            ${Welcome.getFragment('viewer')}
            ${Connect.getFragment('viewer')}
            ${Questionnaire.getFragment('viewer')}
            ${Settings.getFragment('viewer')}
            ${Subscription.getFragment('viewer')}
            ${UserCollections.getFragment('viewer')}
            ${UserTopics.getFragment('viewer', 'user')}
            ${SelectTopic.getFragment('viewer')}
            ${ExploreTopics.getFragment('viewer')}
            ${NotificationsScreen.getFragment('viewer')}
            ${UserTopicsDetail.getFragment('viewer')}
            ${Profile.getFragment('viewer')}
            ${WebViewScreen.getFragment('viewer')}
            ${ReturnInApp.getFragment('viewer')}
        }
    `
  }
});
