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
  UserInsightsUseful,
  UserInsightsUseless,
  Profile,
  WebViewScreen,
  ReturnInApp,
  NetError
} from "./scenes";

import React from "react-native";
import Relay, { RootContainer } from 'react-relay';
import { Loader } from "./components";
import Application from './app';

/**
 *
 * @param params
 * @returns {*}
 */
export function renderScreen (params) {
  const { scene, screenParams, currentAppState } = params;

  switch ( scene ) {
    case 'connect':
      return <Connect {...screenParams} />
    case 'advice_for_me':
      return prepareComponentQueryNode(
        AdviceForMe,
        screenParams,
        {
          id: screenParams.topicId,
          filter: 'UNRATED'
        },
        (data)=> {
          return <AdviceForMe {...screenParams} {...data} />
        }
      )
    case 'questionnaire':
      return <Questionnaire {...screenParams} />
    case 'select_topics':
      return <SelectTopic {...screenParams} />
    case 'welcome':
      return <Welcome {...screenParams}  />
    case 'settings':
      return <Settings {...screenParams} />
    case 'subscription':
      return <Subscription {...screenParams} />
    case 'system_themes_list':
      return <SystemThemesList {...screenParams}  />
    case 'user_collections':
      return <UserCollections {...screenParams} />
    case 'user_topics':
      return <UserTopics {...screenParams} />
    case 'explore_topic':
      return <ExploreTopics {...screenParams} />
    case 'insights_useful':
      return prepareComponentQueryNode(UserInsightsUseful, screenParams, {
          id: screenParams.collectionId,
          filter: 'USEFUL'
        },
        (data, readyState)=> {
          return <UserInsightsUseful
            {...screenParams}
            {...data}
            readyState={readyState} />
        }
      )
    case 'insights_useless':
      return prepareComponentQueryNode(UserInsightsUseless, screenParams, {
          id: screenParams.collectionId,
          filter: 'USELESS'
        },
        (data, readyState)=> {
          return <UserInsightsUseless
            {...screenParams}
            {...data}
            readyState={readyState} />}
      )
    case 'notifications':
      return <NotificationsScreen {...screenParams} />
    case 'profile':
      return <Profile {...screenParams}  />
    case 'web_view':
      return <WebViewScreen {...screenParams}  />
    case 'return_in_app_after_min':
      return <ReturnInApp {...screenParams} />
    default:
      return null
  }
}

/**
 *
 * @param component
 * @param params
 * @param id
 * @returns {XML}
 */
function prepareComponentQueryNode (component, params, route, callback) {
  return (
    <RootContainer
      Component={component}
      route={new QueryNodeId({nodeID : route.id, filter : route.filter })}
      forceFetch={true}
      renderFetched={callback}/>
  )
}

/**
 *
 * @param store
 * @returns {XML}
 */
export function prepareRootRouter (store) {
  return (
    <RootContainer
      store={store}
      Component={Application}
      route={new ViewerRoute()}
      renderFailure={(error, retry) => {
        if(error &&  (error == 'TypeError: Network request failed')) {
            return (
              <NetError />
            );
        }
      }}
    />
  )
}

/**
 *
 */
export class ViewerRoute extends Relay.Route {
  static routeName = 'ViewerRoute';
  static queries = {
    viewer: () => Relay.QL`
        query {
            viewer
        }
    `
  };
}

/**
 *
 */
class QueryNodeId extends Relay.Route {
  static routeName = 'QueryNodeId';
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
  static paramDefinitions = {
    nodeID: { required: true },
    filter: { required: true }
  };
}



