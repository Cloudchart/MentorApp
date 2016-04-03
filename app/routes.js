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
  ReturnInApp,
  NetError
} from "./scenes";

import React from "react-native";
import Relay, { RootContainer } from 'react-relay';
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
      return prepareComponentQueryNode(AdviceForMe, screenParams, screenParams.topicId, (data)=> {
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
    case 'topic_detail':
      return <UserTopicsDetail {...screenParams}  />
    case 'notifications':
      return <NotificationsScreen {...screenParams} />
    case 'all_for_now':
      return <AllForNow {...screenParams} />
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
function prepareComponentQueryNode (component, params, id, callback) {
  return (
    <RootContainer
      Component={component}
      route={new QueryNodeId({nodeID : id})}
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
    nodeID: { required: true }
  };
}

