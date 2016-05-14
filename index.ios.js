import React, {
  AppRegistry,
  Component,
  AsyncStorage,
} from 'react-native'
import Relay, { DefaultNetworkLayer } from 'react-relay'
import { Provider } from 'react-redux'
import store from './src/store'
import { GraphQLServerURL } from './config'
import Application from './src/application'
import Loader from './src/components/loader'
//import NetworkError from './src/scenes/network-error'
import DeviceInfo from 'react-native-device-info'

const networkLayerOptions = {
  /*fetchTimeout: 30000,
   retryDelays: [ 3000, 6000 ],*/
  headers: {
    'X-Device-Id': DeviceInfo.getUniqueID()
  }
}

if (process.env['NODE_ENV'] === 'development') {
  class LoggingNetworkLayer extends DefaultNetworkLayer {
    sendMutation(mutation) {
      const name = mutation._mutation.__concreteNode__.calls[0].name
      const variables = mutation._mutation.__variables__
      console.log('GraphQL mutation request: ', name, variables)
      mutation.then(
          response => console.log('GraphQL mutation done: ', response),
          error => console.error('GraphQL mutation failed: ', error)
      );
      return super.sendMutation(mutation)
    }
  }
  Relay.injectNetworkLayer(
    new LoggingNetworkLayer(GraphQLServerURL, networkLayerOptions)
  )
} else {
  Relay.injectNetworkLayer(
    new DefaultNetworkLayer(GraphQLServerURL, networkLayerOptions)
  )
}

class Mentor extends Component {
  render() {
    return (
      <Provider store={store}>
        <Application />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('Mentor2', () => Mentor)
