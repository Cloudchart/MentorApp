import * as Scenes from './scenes';
import React, { View } from "react-native";
import Relay, { RootContainer } from 'react-relay';
import store from '../src/store';
import _ from 'lodash';
import { Loader } from "./components";

/**
 *
 * @param params
 * @returns {*}
 */
export function renderScreen (params) {
  const { scene, screenParams } = params;
  switch ( scene ) {
    case 'connect':
      return container(Scenes.Connect, screenParams);
    case 'advice_for_me':
      const InsightsForMeFilter = screenParams.filter || 'UNRATED';
      return container(
        Scenes.InsightsForMe,
        screenParams,
        new QueryNodeId({
          nodeID: screenParams.topicId,
          filter: InsightsForMeFilter
        }),
        null,
        InsightsForMeFilter == 'PREVIEW' ? false : true
      );
    case 'questionnaire':
      return container(Scenes.Questionnaire, screenParams);
    case 'select_topics':
      return container(Scenes.SelectTopic, screenParams);
    case 'welcome':
      return container(Scenes.Welcome, screenParams);
    case 'settings':
      return container(Scenes.Settings, screenParams);
    case 'subscription':
      return container(Scenes.Subscription, screenParams);
    case 'user-collections':
      return container(Scenes.UserCollections, screenParams, null, null, true);
    case 'user-topics':
      return container(Scenes.UserTopics, screenParams, null, null, true);
    case 'explore-topic':
      return container(Scenes.ExploreTopics, screenParams);
    case 'replace-topic':
      return container(Scenes.ReplaceTopic, screenParams);
    case 'follow-up':
      return container(Scenes.FollowUp, screenParams);
    case 'insights_useful':
      return container(
        Scenes.UserInsightsUseful,
        screenParams,
        new QueryNodeId({
          nodeID: screenParams.collectionId,
          filter: 'USEFUL'
        }),
        null,
        true
      );
    case 'insights_useless':
      return container(
        Scenes.UserInsightsUseless,
        screenParams,
        new QueryNodeId({
          nodeID: screenParams.collectionId,
          filter: 'USELESS'
        }),
        null,
        true
      );
    case 'notifications':
      return container(Scenes.NotificationsScreen, screenParams);
    case 'profile':
      return container(Scenes.Profile, screenParams);
    case 'web-view':
      return container(Scenes.WebViewScreen, screenParams);
    case 'return_in_app':
      return container(Scenes.ReturnInApp, screenParams);
    default:
      return null
  }
}

/**
 *
 * @param Component
 * @param screenParams
 * @param opt_router
 * @param renderFailure
 * @param forceFetch
 * @returns {XML}
 */
export function container (Component, screenParams, opt_router, renderFailure, forceFetch) {
  const router = opt_router ? opt_router : new ViewerRoute();
  const params = screenParams ? screenParams : {};
  const failure = renderFailure ? renderFailure : ()=> {};
  const forceF = forceFetch ? forceFetch : false;
  const renderFetched = _.throttle((data, readyState)=> {
    return <Component {...params} {...data} />
  }, 300);

  return (
    <RootContainer
      store={store}
      Component={Component}
      route={router}
      forceFetch={forceF}
      renderLoading={() => <Loader />}
      renderFailure={failure}
      renderFetched={renderFetched}
    />
  )
}

/**
 *
 */
export class ViewerRoute extends Relay.Route {
  static routeName = 'ViewerRoute';
  static queries = {
    viewer: () => Relay.QL` query { viewer }`
  };
}

/**
 *
 */
class QueryNodeId extends Relay.Route {
  static routeName = 'QueryNodeId';
  static paramDefinitions = {
    nodeID: { required: true },
    filter: { required: true }
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
    `
  }
}



