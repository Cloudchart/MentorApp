import React from 'react'
import renderRootContainer from './render-root-container'
import Loader from './components/loader'
import NodeRoute from './routes/node'
import ViewerRoute from './routes/viewer'
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

/**
 * @param {String} scene
 * @param {Object} screenParams
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
      if (global.isFirstInsightsRequestDone) {
        return renderRootContainer(InsightsScene, screenParams)
        global.isFirstInsightsRequestDone = null
      }
      global.isFirstInsightsRequestDone = true
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
      return renderRootContainer(ReplaceTopicScene, screenParams)
    case 'follow-up':
      return renderRootContainer(FollowUpScene, screenParams)
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
      return renderRootContainer(NotificationsScene, screenParams)
    case 'profile':
      return renderRootContainer(ProfileScene, screenParams)
    case 'return_in_app':
      return renderRootContainer(ReturnToApp, screenParams)
    default:
      return null
  }
}
