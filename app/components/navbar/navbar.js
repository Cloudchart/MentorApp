import React, {
    Component,
    Image,
    LayoutAnimation,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { EventManager } from "../../event_manager";
import _ from "lodash";
import * as device from "../../utils/device";
import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import styles from "../../styles/base";
import Trash from "./trash";
import AngleLeft from "./back";
import Search from "./search";
import CounterAdvice from "./counter_advice";
import { ACTION_ADD_USER_COLLECTION } from "../../module_dal/actions/actions";

const backRouterIcon = [
  'topic_detail',
  'user_collections',
  'subscription',
  'profile',
  'user_topics',
  'explore_topic',
  'settings',
  'web_view'
]
const settings = [
  'advice_for_me',
  'all_for_now'
]

export const navBarRouteMapper = {
  LeftButton: (route, navigator) => {

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
        return <NavLogo />
      case 'all_for_now':
        return <NavLogo />
      default:
        return <LaunchTitle title={title}/>
    }
  },
  RightButton: (route, navigator) => {
    switch ( route.scene ) {
      case 'user_collections':
        if ( route.add == 'no' ) return <View />
        return <Add />
      case 'topic_detail':
        return <Trash navigator={navigator} route={route}/>
      case 'advice_for_me':
        return <CounterAdvice navigator={navigator}/>
      case 'all_for_now':
        return <CounterAdvice navigator={navigator}/>
      case 'user_topics':
        return <Search navigator={navigator}/>
      default:
        return <View />
    }
  }
}


const Settings = (props) => {
  function push () {
    props.navigator.push({ scene: 'settings', title: 'Settings' })
  }

  return (
      <TouchableOpacity
          activeOpacity={ 0.75 }
          style={styles.crumbIconPlaceholder}
          onPress={push}>
        <Icon name="cog" style={styles.crumbIconSettings}/>
      </TouchableOpacity>
  )
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
    props.navigator.replace({ scene: props.scene, title: props.title || '' })
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

const NavLogo = (props) => {
  return (
      <View style={styles.crumbIconPlaceholder}>
        <Image
            style={{width : device.size(30), height : device.size(30)}}
            source={require('../../images/navbar_logo.png')}/>
      </View>
  )
}

const LaunchTitle = (props) => {
  return (
      <View style={styles.title}>
        <Text style={styles.title_blank}>&nbsp;</Text>
        <Text style={styles.title_item}>{props.title || ''}</Text>
      </View>
  );
}