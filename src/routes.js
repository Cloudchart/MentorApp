import React, { View } from 'react-native'
import Relay, { RootContainer } from 'react-relay'
import store from '../src/store'
import { Loader } from './components'
import * as Scenes from './scenes'
import InsightsScene from './scenes/insights'
import RandomAdviceScene from './scenes/random-advice'
import SubscriptionScene from './scenes/subscription'
import UserCollectionsScene from './scenes/user-collections'
import UserTopicsScene from './scenes/user-topics'
import UserInsightsScene from './scenes/user-insights'
import ExploreTopicScene from './scenes/explore-topic'
import SettingsScene from './scenes/settings'
import QuestionnaireScene from './scenes/questionnaire'
import WelcomeScene from './scenes/welcome'
import SelectTopicScene from './scenes/select-topic'
import ConnectScene from './scenes/connect'
import ExploreInsightsScene from './scenes/insights/explore'

/**
 * @param {String} scene
 * @param {Object} screenParams
 * @returns {*}
 */
export function renderScene(route, navigator) {
  const { scene, props } = route
  console.log('routes: renderScene()', { route })
  const routeProps = props || {}
  const screenParams = {
    navigator,
    ...route,
    ...routeProps,
  }
  switch (scene) {
    case 'welcome':
      return renderRootContainer(WelcomeScene, screenParams)
    case 'connect':
      return renderRootContainer(ConnectScene, screenParams)
    case 'questionnaire':
      return renderRootContainer(QuestionnaireScene, screenParams)
    case 'select_topics':
      return renderRootContainer(SelectTopicScene, screenParams)
    case 'insights':
      // Hack to fix issue when renderScene is being called twice
      // @see https://github.com/facebook/react-native/pull/3016
      if (global.isNotFirstInsightsRequest) {
        return renderRootContainer(InsightsScene, screenParams)
      }
      global.isNotFirstInsightsRequest = true
      return (
        <Loader />
      )
    case 'random_advice':
      return renderRootContainer(RandomAdviceScene, screenParams)
    case 'settings':
      return (
        <SettingsScene {...screenParams}/>
      )
    case 'subscription':
      return (
        <SubscriptionScene {...screenParams}/>
      )
    case 'user-collections':
      return renderRootContainer(UserCollectionsScene, screenParams, { forceFetch: true })
    case 'user-topics':
      return renderRootContainer(UserTopicsScene, screenParams, { forceFetch: true })
    case 'explore-topic':
      return renderRootContainer(ExploreTopicScene, screenParams)
    case 'explore-insights':
      return renderRootContainer(ExploreInsightsScene, {
        filter: 'PREVIEW',
        ...screenParams,
      }, {
        route: new NodeRoute({
          nodeID: screenParams.topicID,
          filter: 'PREVIEW',
        }),
      })
    case 'replace-topic':
      return renderRootContainer(Scenes.ReplaceTopic, screenParams)
    case 'follow-up':
      return renderRootContainer(Scenes.FollowUp, screenParams)
    case 'user-insights_useful':
      return renderRootContainer(UserInsightsScene, {
        filter: 'USEFUL',
        ...screenParams,
      }, {
        route: new NodeRoute({
          nodeID: screenParams.collectionId,
          filter: 'USEFUL',
        }),
      })
    case 'user-insights_useless':
      return renderRootContainer(UserInsightsScene, {
        filter: 'USELESS',
        ...screenParams,
      }, {
        route: new NodeRoute({
          nodeID: screenParams.collectionId,
          filter: 'USELESS',
        })
      })
    case 'notifications':
      return renderRootContainer(Scenes.NotificationsScreen, screenParams)
    case 'profile':
      return renderRootContainer(Scenes.Profile, screenParams)
    case 'return_in_app':
      return renderRootContainer(Scenes.ReturnInApp, screenParams)
    default:
      return null
  }
}

/**
 * @param {Function} Component
 * @param {Object} [screenParams]
 * @param {Object} [options]
 * @param {Object} [options.route]
 * @param {Function} [options.renderFailure]
 * @param {Boolean} [options.forceFetch]
 */
export function renderRootContainer(Component, screenParams, options) {
  const { route, forceFetch, renderFailure, renderFetched } = options || {}
  const finalRoute = route ? route : new ViewerRoute()
  const finalParams = screenParams ? screenParams : {}
  const finalRenderFailure = renderFailure ? renderFailure : null
  const finalForceFetch = forceFetch !== undefined ? forceFetch : false
  const finalRenderFetched =
    (renderFetched !== undefined) ?
      renderFetched :
        data => (
          <Component {...finalParams} {...data} />
        )
  return (
    <RootContainer
      store={store}
      Component={Component}
      route={finalRoute}
      forceFetch={finalForceFetch}
      renderLoading={() => (
        <Loader />
      )}
      renderFailure={finalRenderFailure}
      renderFetched={finalRenderFetched}
    />
  )
}

export class ViewerRoute extends Relay.Route {
  static routeName = 'ViewerRoute'
  static queries = {
    viewer: () => Relay.QL`query { viewer }`,
  };
}

export class NodeRoute extends Relay.Route {
  static routeName = 'NodeRoute'
  static paramDefinitions = {
    nodeID: { required: true },
    filter: { required: true },
  }
  static queries = {
    node: () => Relay.QL`
      query {
        node(id: $nodeID)
      }
    `,
    viewer: () => Relay.QL`
      query {
        viewer
      }
    `,
  }
}
