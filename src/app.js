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
import Relay from 'react-relay';
import styles from "./styles/base";
import { CustomSceneConfig } from "./router-conf";
import { renderScreen } from "./routes";
import { navBarRouteMapper, UserNotifications } from "./components";
import moment from "moment";
import * as actions from './actions/actions';
import { EventManager } from './event-manager';
import {
  setUserPushToken,
  activateUser,
  resetUser,
  updateUserNotifications
} from "./actions/user";
import {
  checkPermissions,
  NETAlert,
  checkNET
} from './system';


moment.createFromInputFallback = function (config) {
  config._d = new Date(config._i);
};

/**
 * repaint white StatusBar
 * do not forget to add in the info.plist -  UIViewControllerBasedStatusBarAppearance : NO
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

  constructor (props) {
    super(props)

    PushNotificationIOS.addEventListener('register', this._register.bind(this));
    PushNotificationIOS.addEventListener('notification', this._notification.bind(this));
    AppState.addEventListener('change', this._appStateChange.bind(this))
    NetInfo.addEventListener('change', this._NetInfo.bind(this));
    EventManager.on(actions.HIDE_NOTIFICATION, ()=> {
      this.setState({ networkNone: false })
    });

    checkNET().then((reach)=> {
      if ( reach == 'none' ) {
        this.notifyNetworkError();
      }
    });
  }

  /**
   *
   * @param currentAppState
   * @private
   */
  _appStateChange (currentAppState) {
    this.state.currentAppState = currentAppState;

    if ( !this.state.networkNone ) {
      this._diffTimeStartApp(currentAppState);
    }

    if ( currentAppState == 'active' ) {
      checkNET().then((reach)=> {
        if ( reach == 'none' ) {
          this.notifyNetworkError()
        }
      })
      //checkPermissions();
    }
  }

  notifyNetworkError () {
    this.setState({
      networkNone: this.state.notifications.network
    })
  }

  /**
   *
   * @param reach
   * @private
   */
  _NetInfo (reach) {
    if ( this.state.currentAppState != 'background' && reach == 'none' ) {
      this.notifyNetworkError()
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
      .then((tran)=> {
        this._activateUser()
      })
      .catch(()=> {
        this._activateUser()
      })
  }

  /**
   *
   * @param item
   * @returns {*}
   */
  prepareData (item) {
    if ( _.isDate(item) ) {
      item = item.toString();
    } else if ( _.isObject(item) ) {
      item = JSON.stringify(item);
    } else {
      item = String(item);
    }
    return item;
  };

  /**
   * comparing the time re-entry application
   * @param currentAppState
   * @private
   */
  _diffTimeStartApp (currentAppState) {
    switch ( currentAppState ) {
      case 'active':
        AsyncStorage.setItem(actions.UPDATE_APP_START_TIME, this.prepareData(new Date));
        break;
      case 'background':
        AsyncStorage.setItem(actions.APP_BACKGROUND_TIME, this.prepareData(new Date));
        break;
      default:
    }

    if ( currentAppState == 'background' ) {
      updateUserNotifications(true);
    } else if ( currentAppState == 'active' ) {
      updateUserNotifications();
    }

    // add active
    if ( currentAppState == 'active' ) {
      const now = moment();

      AsyncStorage.getItem(actions.APP_BACKGROUND_TIME, (err, result)=> {
        if ( err || !result ) return;
        const backgroundDate = moment(result);
        if ( !backgroundDate.diff ) return;
        const diffHour = Math.abs(backgroundDate.diff(now, 'hour'));

        if ( diffHour >= 24 ) {
          this._navigator.resetTo({
            scene: 'return_in_app',
            title: ''
          })
        }
      });
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
    props.navigator = navigator;

    return renderScreen({
      scene: route.scene,
      screenParams: {
        navigator,
        ...route,
        ...props
      }
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
    const { isActive, subscribedTopics } = this.props.viewer;
    const { networkNone } = this.state;
    let init_scene = subscribedTopics.edges.length ? 'advice_for_me' : 'welcome';
    let title = 'Virtual Mentor';


    return (
      <View style={styles.scene}>
        <Navigator
          ref={ (navigator) => this._navigator = navigator }
          initialRoute={{ scene: init_scene, title }}
          navigationBar={<NavigationBar routeMapper={this._navBarRouteMapper()} />}
          renderScene={ this._renderScene.bind(this) }
          configureScene={(route, routeStack)=>{
            if(route.FloatFromBottom) {
              return Navigator.SceneConfigs.FloatFromBottom;
            }
            return CustomSceneConfig;
          }}
          sceneStyle={ styles.sceneStyle }
        />

        {!networkNone ? null :
          <UserNotifications notification={networkNone}/> }
      </View>
    )
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
});

global.LOG = (...args) => {
  console.log('/------------------------------\\');
  console.log(...args);
  console.log('\\------------------------------/');
  return args[ args.length - 1 ];
};
