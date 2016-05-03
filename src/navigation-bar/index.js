import React, {
  Navigator,
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Relay from 'react-relay'
import { ViewerRoute, NodeRoute } from '../routes.js'
import { EventManager } from '../event-manager'
import * as device from '../utils/device'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import styles from '../styles/base'
import ArrowLeft from './arrow-left'
import Settings from './settings'
import NavLogo from './nav-logo'
import TrashCounter from './trash-counter'
import UsefulCounter from './useful-counter'
import { ACTION_ADD_USER_COLLECTION } from '../actions/actions'

const showBackIconInScenes = [
  'insights_useless',
  'insights_useful',
  'user-collections',
  'subscription',
  'replace-topic',
  'questionnaire',
  'profile',
  'user-topics',
  'explore-topic',
  'settings',
]
const showSettingsIconInScenes = [
  'insights',
  'all_for_now',
]

export const routeMapper = (viewer) => ({
  LeftButton: (route, navigator) => {
    const { scene } = route;
    switch (scene) {
      case 'insights':
        if (route.filter !== 'UNRATED') {
          return (
            <ArrowLeft navigator={navigator}/>
          )
        }
        break
      case 'select_topics':
        if (route.filterUserAddedTopic) {
          return (
            <ArrowLeft navigator={navigator}/>
          )
        }
      default:
        break
    }
    if (showBackIconInScenes.indexOf(scene) >= 0) {
      return (
        <ArrowLeft navigator={navigator}/>
      )
    }
    if (showSettingsIconInScenes.indexOf(scene) >= 0) {
      return (
        <Settings navigator={navigator}/>
      )
    }
    return (
      <View />
    )
  },

  Title: (route, navigator) => {
    switch (route.scene) {
      case 'insights':
        if (route.filter !== 'UNRATED') {
          return (
            <LaunchTitle title={route.title}/>
          )
        }
        return (
          <NavLogo navigator={navigator}/>
        )
      case 'all_for_now':
        return (
          <NavLogo navigator={navigator}/>
        )
      default:
        break;
    }
    return (
      <LaunchTitle title={route.title}/>
    )
  },

  RightButton: (route, navigator) => {
    switch (route.scene) {
      case 'user-collections':
        if (route.add !== 'no') {
          return (
            <Add />
          )
        }
        break
      case 'insights_useless':
        const { screenParams } = route
        const relayRoute = new NodeRoute({
          nodeID: screenParams.collectionId,
          filter: 'USELESS',
        })
        return (
          <Relay.RootContainer
            Component={TrashCounter}
            route={relayRoute}
            renderFetched={data => (
              <TrashCounter {...data} navigator={navigator}/>
            )}
            />
        )
      case 'insights_useful':
        return (
          <TrashCounter navigator={navigator} route={route}/>
        )
      case 'follow-up':
        return (
          <Skip navigator={navigator} route={route}/>
        )
      case 'insights':
        if (route.filter === 'UNRATED') {
          return (
            <Relay.RootContainer
              Component={UsefulCounter}
              route={new ViewerRoute()}
              renderFetched={data => (
                <UsefulCounter {...data} navigator={navigator}/>
              )}
              />
          )
        }
        break
      default:
        break
    }
    return (
      <View />
    )
  }
})

const Add = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.crumbIconPlaceholder}
      onPress={() => { EventManager.emit(ACTION_ADD_USER_COLLECTION) }}
      >
      <IconMaterial name="add" style={styles.crumbIconPlus}/>
    </TouchableOpacity>
  )
}

const Skip = ({ navigator, route, title }) => {
  const handleSkipPress = () => {
    const customProps = route.buttonSkipProps || {}
    navigator.replace({
      scene: route.buttonSkip,
      title: title || '',
      ...customProps,
    })
  }
  return (
    <TouchableOpacity
      activeOpacity={ 0.75 }
      style={styles.crumbIconPlaceholder}
      onPress={() => handleSkipPress()}
      >
      <Text style={[styles.navBarText, {color : '#2a9ce0'}]}>
        Skip
      </Text>
    </TouchableOpacity>
  )
}

const AngleLeftReplace = ({ back, navigator, scene, title }) => {
  const handleReplacePress = () => {
    if (back) {
      back()
    } else {
      navigator.replace({
        scene: scene,
        title: title || ''
      })
    }
  }
  return (
    <TouchableOpacity
      activeOpacity={ 0.75 }
      style={styles.crumbIconPlaceholder}
      onPress={() => handleReplacePress()}
      >
      <Icon name="angle-left" style={styles.crumbIconAngle}/>
    </TouchableOpacity>
  )
}

const LaunchTitle = ({ title }) => {
  const preparedTitle =
    (title && title.length > 31) ?
      `${title.substr(0, 31)}...` :
      title
  return (
    <View style={styles.title}>
      <Text style={styles.title_blank}>&nbsp;</Text>
      <Text style={styles.title_item} numberOfLines={1}>
        {preparedTitle || ''}
      </Text>
    </View>
  )
}

export class NavigationBar extends Navigator.NavigationBar {
  render() {
    const { navState } = this.props
    const routes = navState.routeStack
    let route
    if (routes.length > 0) {
      route = routes[routes.length - 1]
    }
    if (route.sceneConfig && route.sceneConfig.hideBar) {
      console.log('NavigationBar hideBar: ', route)
      return null
    }
    return super.render()
  }
}
