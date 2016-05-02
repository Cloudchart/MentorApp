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
import { SAVE_UNIQUE_ID_AND_DATE } from './src/actions/actions'
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
  constructor (props) {
    super(props)
    this.state = {
      enable: null
    }
    store.dispatch({
      type: SAVE_UNIQUE_ID_AND_DATE,
      id: DeviceInfo.getUniqueID(),
      appStart: moment(),
    })
    EventManager.on('enable:network', () => {
      this.setState({
        enable: true
      })
    })
  }

  render () {
    const renderFailure = (error) => {
      if (error && (error == 'TypeError: Network request failed')) {
        return (
          <NetworkError />
        )
      }
    }
    return (
      <Provider store={store}>
        {renderRootContainer(Application, null, { renderFailure })}
      </Provider>
    )
  }
}

AppRegistry.registerComponent('Mentor2', () => Mentor)
