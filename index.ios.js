import React, {
  AppRegistry,
  Component,
  AlertIOS,
  View,
  Text
} from 'react-native'
import Relay, { DefaultNetworkLayer } from 'react-relay'
import { renderRootContainer } from './src/routes'
import { GraphQLServerURL } from './config'
import moment from 'moment'
import { Provider } from 'react-redux'
import store from './src/store'
import Application from './src/application'
import NetworkError from './src/scenes/network-error'
import DeviceInfo from 'react-native-device-info'
import { SAVE_UNIQUE_ID_AND_DATE } from './src/actions/application'
import { EventManager } from './src/event-manager'

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
  constructor (props, context) {
    super(props, context)
    this.state = {
      enable: null,
    }
    store.dispatch({
      type: SAVE_UNIQUE_ID_AND_DATE,
      id: DeviceInfo.getUniqueID(),
      appStart: moment(),
    })
    EventManager.on('enable:network', () => this.handleNetworkEnable())
  }

  handleNetworkEnable() {
    this.setState({
      enable: true,
    })
  }

  _renderFailure(error) {
    if (error && error == 'TypeError: Network request failed') {
      return (
        <NetworkError />
      )
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Application />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('Mentor2', () => Mentor)
