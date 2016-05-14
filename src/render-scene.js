import React from 'react'
import { RootContainer } from 'react-relay'
import store from '../src/store'
import NodeRoute from './routes/node'
import ViewerRoute from './routes/viewer'
import Loader from './components/loader'
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
import ReplaceTopicScene from './scenes/replace-topic'
import FollowUpScene from './scenes/follow-up'
import NotificationsScene from './scenes/notifications'
import ProfileScene from './scenes/profile'
import ReturnToApp from './scenes/return-to-app'
import StarterScene from './scenes/starter'

/**
 * @param {Function} Component
 * @param {Object} [screenParams]
 * @param {Object} [options]
 * @param {Object} [options.route] RelayRoute
 * @param {Boolean} [options.forceFetch]
 * @param {Function} [options.renderFailure]
 * @param {Function} [options.renderFetched]
 */
export function renderSceneContainer(Component, screenParams, options) {
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

/**
 * @param {Object} route
 * @param {String} route.scene
 * @param {Object} route.props
 * @param {Object} navigator
 * @returns {*}
 */
export default function renderScene(route, navigator) {
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
      return renderSceneContainer(WelcomeScene, screenParams)
    case 'starter':
      return renderSceneContainer(StarterScene, screenParams)
    case 'connect':
      return renderSceneContainer(ConnectScene, screenParams)
    case 'questionnaire':
      return renderSceneContainer(QuestionnaireScene, screenParams)
    case 'select_topics':
      return renderSceneContainer(SelectTopicScene, screenParams)
    case 'insights':
      // Hack to fix issue when renderScene is being called twice
      // @see https://github.com/facebook/react-native/pull/3016
      console.log('found isFirstInsightsRenderDone', global.isFirstInsightsRequestDone)
      const { skipFirstRender } = screenParams.renderOptions || {}
      if (skipFirstRender !== true || global.isFirstInsightsRenderDone) {
        global.isFirstInsightsRequestDone = null
        return renderSceneContainer(InsightsScene, screenParams)
      }
      global.isFirstInsightsRenderDone = true
      return (
        <Loader />
      )
    case 'random_advice':
      return renderSceneContainer(RandomAdviceScene, screenParams)
    case 'settings':
      return (
        <SettingsScene {...screenParams}/>
      )
    case 'subscription':
      return (
        <SubscriptionScene {...screenParams}/>
      )
    case 'user-collections':
      return renderSceneContainer(UserCollectionsScene, screenParams, { forceFetch: true })
    case 'user-topics':
      return renderSceneContainer(UserTopicsScene, screenParams, { forceFetch: true })
    case 'explore-topic':
      return renderSceneContainer(ExploreTopicScene, screenParams)
    case 'explore-insights':
      return renderSceneContainer(ExploreInsightsScene, {
        filter: 'PREVIEW',
        ...screenParams,
      }, {
        route: new NodeRoute({
          nodeID: screenParams.topicID,
          filter: 'PREVIEW',
        }),
      })
    case 'replace-topic':
      return renderSceneContainer(ReplaceTopicScene, screenParams)
    case 'follow-up':
      return renderSceneContainer(FollowUpScene, screenParams)
    case 'user-insights_useful':
      return renderSceneContainer(UserInsightsScene, {
        filter: 'USEFUL',
        ...screenParams,
      }, {
        route: new NodeRoute({
          nodeID: screenParams.collectionId,
          filter: 'USEFUL',
        }),
      })
    case 'user-insights_useless':
      return renderSceneContainer(UserInsightsScene, {
        filter: 'USELESS',
        ...screenParams,
      }, {
        route: new NodeRoute({
          nodeID: screenParams.collectionId,
          filter: 'USELESS',
        })
      })
    case 'notifications':
      return renderSceneContainer(NotificationsScene, screenParams)
    case 'profile':
      return renderSceneContainer(ProfileScene, screenParams)
    case 'return-to-app':
      return renderSceneContainer(ReturnToApp, screenParams)
    default:
      return null
  }
}
