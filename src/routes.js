import React, { View } from "react-native"
import Relay, { RootContainer } from 'react-relay'
import store from '../src/store'
import _ from 'lodash'
import { Loader } from "./components"
import * as Scenes from './scenes'
import InsightsScene from './scenes/insights'
import RandomAdviceScene from './scenes/random-advice'
import SubscriptionScene from './scenes/subscription'

/**
 *
 * @param params
 * @returns {*}
 */
//let firstEnter = false;
export function renderScreen(params) {
  const { scene, screenParams } = params;
  switch (scene) {
    case 'welcome':
      return renderRootContainer(Scenes.Welcome, screenParams)
    case 'connect':
      return renderRootContainer(Scenes.Connect, screenParams)
    case 'questionnaire':
      return renderRootContainer(Scenes.Questionnaire, screenParams)
    case 'select_topics':
      return renderRootContainer(Scenes.SelectTopic, screenParams)
    case 'insights':
      return renderRootContainer(InsightsScene, screenParams)
      //const InsightsForMeFilter = screenParams.filter || 'UNRATED';
      //return renderRootContainer(
      //  Scenes.InsightScene,
      //  screenParams,
      //  new NodeRoute({
      //    nodeID: screenParams.topicId,
      //    filter: InsightsForMeFilter
      //  }),
      //  null,
      //  !firstEnter
      //);
    case 'random_advice':
      return renderRootContainer(RandomAdviceScene, screenParams)
    case 'settings':
      return renderRootContainer(Scenes.Settings, screenParams);
    case 'subscription':
      return (
        <SubscriptionScene {...screenParams}/>
      )
    case 'user-collections':
      return renderRootContainer(Scenes.UserCollections, screenParams, { forceFetch: true })
    case 'user-topics':
      return renderRootContainer(Scenes.UserTopics, screenParams, { forceFetch: true })
    case 'explore-topic':
      return renderRootContainer(Scenes.ExploreTopics, screenParams)
    case 'replace-topic':
      return renderRootContainer(Scenes.ReplaceTopic, screenParams)
    case 'follow-up':
      return renderRootContainer(Scenes.FollowUp, screenParams)
    case 'insights_useful':
      return renderRootContainer(Scenes.UserInsightsUseful, screenParams, {
        route: new NodeRoute({
          nodeID: screenParams.collectionId,
          filter: 'USEFUL',
        }),
        forceFetch: true,
      })
    case 'insights_useless':
      return renderRootContainer(Scenes.UserInsightsUseless, screenParams, {
        route: new NodeRoute({
          nodeID: screenParams.collectionId,
          filter: 'USELESS',
        }),
        forceFetch: true,
      })
    case 'notifications':
      return renderRootContainer(Scenes.NotificationsScreen, screenParams);
    case 'profile':
      return renderRootContainer(Scenes.Profile, screenParams);
    case 'return_in_app':
      return renderRootContainer(Scenes.ReturnInApp, screenParams);
    default:
      return null
  }
}

/**
 * @param Component
 * @param screenParams
 * @param [options]
 */
export function renderRootContainer(Component, screenParams, options) {
  const { route, renderFailure, forceFetch } = options || {}
  const finalRoute = route ? route : new ViewerRoute()
  const finalParams = screenParams ? screenParams : {}
  const finalRenderFailure = renderFailure ? renderFailure : () => {}
  const finalForceFetch = forceFetch !== undefined ? forceFetch : false
  //firstEnter = true;
  const renderFetched = _.throttle((data, readyState) => {
    return <Component {...finalParams} {...data} />
  }, 300);

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
      renderFetched={renderFetched}
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
