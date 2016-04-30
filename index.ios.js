import React, {
  AppRegistry,
  Component,
  AlertIOS,
  View,
  Text
} from 'react-native';

import Relay, { DefaultNetworkLayer } from 'react-relay';
import { container } from './src/routes';
import { graphqlURL } from './config';
import moment from "moment";
import { Provider } from 'react-redux';
import store from './src/store';
import Application from './src/app';
import { NetError } from './src/scenes';
import DeviceInfo from "react-native-device-info";
import { SAVE_UNIQUE_ID_AND_DATE } from "./src/actions/actions";
import { EventManager } from './src/event-manager';

Relay.injectNetworkLayer(
  new DefaultNetworkLayer(graphqlURL, {
    /*fetchTimeout: 30000,
    retryDelays: [ 3000, 6000 ],*/
    headers: {
      'X-Device-Id': DeviceInfo.getUniqueID()
    }
  })
);

class Mentor extends Component {

  constructor (props) {
    super(props)
    this.state = {
      enable: null
    }

    store.dispatch({
      type: SAVE_UNIQUE_ID_AND_DATE,
      id: DeviceInfo.getUniqueID(),
      appStart: moment()
    })

    EventManager.on('enable:network', ()=> {
      this.setState({
        enable: true
      })
    })
  }

  render () {
    return (
      <Provider store={store}>
        {container(Application, null, null, (error, retry)=> {
          if ( error && (error == 'TypeError: Network request failed') ) {
            return <NetError />
          }
        })}
      </Provider>
    )
  }
}

AppRegistry.registerComponent('Mentor2', () => Mentor);
