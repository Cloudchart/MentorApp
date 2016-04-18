import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { EventManager } from "../../event-manager";
import _ from "lodash";
import * as device from "../../utils/device";
import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import styles from "../../styles/base";
import Trash from "./trash";
import Settings from "./settings";
import AngleLeft from "./back";
import NavLogo from "./nav-logo";
import CounterAdvice from "./counter_advice";
import { ACTION_ADD_USER_COLLECTION } from "../../actions/actions";

const backRouterIcon = [
  'insights_useless',
  'insights_useful',
  'user-collections',
  'subscription',
  //'select_topics',
  'replace-topic',
  'connect',
  'questionnaire',
  'notifications',
  'profile',
  'user-topics',
  'explore-topic',
  'settings',
  'web_view'
]
const settings = [
  'advice_for_me',
  'all_for_now'
]

export const navBarRouteMapper = {
  LeftButton: (route, navigator) => {

    if ( route.scene == 'advice_for_me' && route.filter ) {
      return <AngleLeft navigator={navigator}/>
    }

    if ( route.scene == 'select_topics' && route.filterUserAddedTopic ) {
      return <AngleLeft navigator={navigator}/>
    }

    if ( _.includes(backRouterIcon, route.scene) ) {
      return <AngleLeft navigator={navigator}/>
    }
    if ( _.includes(settings, route.scene) ) {
      return <Settings navigator={navigator}/>
    }

    return <View />
  },
  Title: (route) => {
    const { title } = route;
    switch ( route.scene ) {
      case 'advice_for_me':
        if ( route.filter ) {
          return <LaunchTitle title={title}/>
        }
        return <NavLogo />
      case 'all_for_now':
        return <NavLogo />
      default:
        return <LaunchTitle title={title}/>
    }
  },
  RightButton: (route, navigator) => {
    switch ( route.scene ) {
      case 'user-collections':
        if ( route.add == 'no' ) return <View />
        return <Add />
      case 'insights_useless':
        return <Trash navigator={navigator} route={route}/>
      case 'insights_useful':
        return <Trash navigator={navigator} route={route}/>
      case 'advice_for_me':
        if ( route.filter != 'PREVIEW' ) {
          return <CounterAdvice navigator={navigator}/>
        }
      default:
        return <View />
    }
  }
}

const Add = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={ 0.75 }
      style={styles.crumbIconPlaceholder}
      onPress={() => { EventManager.emit(ACTION_ADD_USER_COLLECTION) }}>
      <IconMaterial name="add" style={styles.crumbIconPlus}/>
    </TouchableOpacity>
  )
}

const AngleLeftReplace = (props) => {

  function replace () {
    if ( props.back ) {
      props.back()
    } else {
      props.navigator.replace({ scene: props.scene, title: props.title || '' })
    }

  }

  return (
    <TouchableOpacity
      activeOpacity={ 0.75 }
      style={styles.crumbIconPlaceholder}
      onPress={replace}>
      <Icon name="angle-left" style={styles.crumbIconAngle}/>
    </TouchableOpacity>
  )
}

const LaunchTitle = (props) => {
  const title = props.title && props.title.length > 31 ?
    `${props.title.substr(0, 31)}...` : props.title;
  return (
    <View style={styles.title}>
      <Text style={styles.title_blank}>&nbsp;</Text>
      <Text style={styles.title_item} numberOfLines={ 1 }>{title || ''}</Text>
    </View>
  );
}
