import * as Scenes from './scenes';
import React, { View } from "react-native";
import Relay, { RootContainer } from 'react-relay';
import { Loader } from "./components";
import styles from "./styles/base";
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
      return <Scenes.Connect {...screenParams} />
    case 'advice_for_me':
      return prepareComponentQueryNode(
        Scenes.InsightsForMe,
        screenParams,
        {
          id: screenParams.topicId,
          filter: screenParams.filter || 'UNRATED'
        },
        (data)=> {
          return <Scenes.InsightsForMe {...screenParams} {...data} />
        }
      )
    case 'questionnaire':
      return <Scenes.Questionnaire {...screenParams} />
    case 'select_topics':
      return <Scenes.SelectTopic {...screenParams}  />
    case 'welcome':
      return <Scenes.Welcome {...screenParams}  />
    case 'settings':
      return <Scenes.Settings {...screenParams} />
    case 'subscription':
      return <Scenes.Subscription {...screenParams} />
    case 'user-collections':
      return <Scenes.UserCollections {...screenParams} />
    case 'user-topics':
      return <Scenes.UserTopics {...screenParams} />
    case 'explore-topic':
      return <Scenes.ExploreTopics {...screenParams} />
    case 'replace-topic':
      return <Scenes.ReplaceTopic {...screenParams} />
    case 'insights_useful':
      return prepareComponentQueryNode(Scenes.UserInsightsUseful, screenParams, {
          id: screenParams.collectionId,
          filter: 'USEFUL'
        },
        (data, readyState)=> {
          return <Scenes.UserInsightsUseful {...screenParams} {...data} />
        }
      )
    case 'insights_useless':
      return prepareComponentQueryNode(Scenes.UserInsightsUseless, screenParams, {
          id: screenParams.collectionId,
          filter: 'USELESS'
        },
        (data, readyState)=> {
          return <Scenes.UserInsightsUseless
            {...screenParams}
            {...data}
            readyState={readyState}/>
        }
      )
    case 'notifications':
      return <Scenes.NotificationsScreen {...screenParams} />
    case 'profile':
      return <Scenes.Profile {...screenParams}  />
    case 'web-view':
      return <Scenes.WebViewScreen {...screenParams}  />
    case 'return_in_app_after_min':
      return <Scenes.ReturnInApp {...screenParams} />
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
      renderLoading={(error, retry) => {
         <View style={styles.scene} />
      }}
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
      renderLoading={(error, retry) => {
         <View style={styles.scene} />
      }}
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



