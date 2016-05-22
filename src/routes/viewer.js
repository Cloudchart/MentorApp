import Relay from 'react-relay'

export default class ViewerRoute extends Relay.Route {

  static routeName = 'ViewerRoute'

  static queries = {
    viewer: () => Relay.QL`query { viewer }`,
  }
}
