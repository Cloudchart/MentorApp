import React, {
  Component,
  View,
} from 'react-native'

import Relay, {
  DefaultNetworkLayer,
  RootContainer
} from 'react-relay'

import ViewerRoute from '../routes/ViewerRoute'

import MainAct from '../acts/Main'


Relay.injectNetworkLayer(
  new DefaultNetworkLayer('https://virtualmentor.io/graphql', {
    headers: {
      'X-Device-Id': 'startup-makers'
    }
  })
)


export default class extends Component {

  render() {
    return <RootContainer
      Component = { MainAct }
      route     = { new ViewerRoute() }
    />
  }

}
