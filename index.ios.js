import React, {
  AppRegistry,
  Component,
  AlertIOS,
  View,
  Text
} from 'react-native';

import Relay, { DefaultNetworkLayer } from 'react-relay';
import { prepareRootRouter } from './app/routes';
import { graphqlURL } from './app/relay-conf';
import moment from "moment";
import { Provider } from 'react-redux';
import store from './app/store';
import DeviceInfo from "react-native-device-info";
import { SAVE_UNIQUE_ID_AND_DATE } from "./app/actions/actions";
import { EventManager } from './app/event_manager';

Relay.injectNetworkLayer(
  new DefaultNetworkLayer(graphqlURL, {
    headers: {
      'X-Device-Id': 'startup-makers'
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
        {prepareRootRouter(store)}
      </Provider>
    )
  }
}

AppRegistry.registerComponent('Mentor2', () => Mentor);
