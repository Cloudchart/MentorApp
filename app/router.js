import React, {
    Component,
    Navigator,
    StatusBarIOS,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    PushNotificationIOS,
    AppState
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
    ReturnInApp
} from "./scenes";

import moment from "moment";
import styles from "./styles/base";
import { CustomSceneConfig } from "./router_conf";
import { navBarRouteMapper } from "./components";

import { FBSDKAccessToken } from "react-native-fbsdkcore";
import { UPDATE_APP_START_TIME, APP_BACKGROUND_TIME } from "./module_dal/actions/actions";
/**
 * repaint white StatusBarIOS
 * do not forget to add in the info.plist -  UIViewControllerBasedStatusBarAppearance : NO
 */
StatusBarIOS.setStyle(1);


class Router extends Component {

  constructor (props) {
    super(props)
    this.state = {
      userIsAuthorize: '',
      returnInAppAfterOneMinute: false,
      currentAppState: ''
    }

    FBSDKAccessToken.getCurrentAccessToken((token)=> {
      if ( token ) {
        this.setState({ userIsAuthorize: token })
      } else {
        this.setState({ userIsAuthorize: false })
      }
    })


    AppState.addEventListener('change', (currentAppState)=> {
      this._diffTimeStartApp(currentAppState)
    })
  }

  componentDidMount () {

  }

  /**
   * comparing the time re-entry application
   * @param currentAppState
   * @private
   */
  _diffTimeStartApp (currentAppState) {
    const { store } = this.props;
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

  _renderScene (route, navigator) {
    let props = route.props || {}
    const { returnInAppAfterOneMinute } = this.state;
    props.navigator = navigator;

    const screenParams = {
      navigator,
      ...route,
      ...props
    }


    if ( returnInAppAfterOneMinute ) {
      this.state.returnInAppAfterOneMinute = false;
      route.scene = 'return_in_app_after_min';
    }

    switch ( route.scene ) {
      case 'connect':
        return <Connect {...screenParams} />
      case 'advice_for_me':
        return <AdviceForMe {...screenParams} />
      case 'questionnaire':
        return <Questionnaire {...screenParams} />
      case 'select_topics':
        return <SelectTopic {...screenParams} />
      case 'welcome':
        return <Welcome {...screenParams} />
      case 'settings':
        return <Settings {...screenParams} />
      case 'subscription':
        return <Subscription {...screenParams} />
      case 'system_themes_list':
        return <SystemThemesList {...screenParams} />
      case 'user_collections':
        return <UserCollections {...screenParams} />
      case 'user_topics':
        return <UserTopics {...screenParams} />
      case 'explore_topic':
        return <ExploreTopics {...screenParams} />
      case 'topic_detail':
        return <UserTopicsDetail {...screenParams} />
      case 'notifications':
        return <NotificationsScreen {...screenParams} />
      case 'all_for_now':
        return <AllForNow {...screenParams} />
      case 'profile':
        return <Profile {...screenParams} />
      case 'web_view':
        return <WebViewScreen {...screenParams} />
      case 'return_in_app_after_min':
        return <ReturnInApp {...screenParams} appState={this.state.currentAppState}/>
      default:
        return null
    }
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
    const { userIsAuthorize } = this.state;
    let init_scene = userIsAuthorize !== false ? 'advice_for_me' : 'welcome';

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


export default Router
