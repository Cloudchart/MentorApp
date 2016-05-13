import Relay from 'react-relay'

export default class NodeRoute extends Relay.Route {
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
