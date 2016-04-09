import React, {
  AppRegistry,
} from 'react-native';

import {
  setDeviceID,
  setGraphQLURI,
} from './utils/fetchGraphQL'

import Main from './acts/Main'


setGraphQLURI('http://mentor.dev/graphql')
setDeviceID('qweasd')


AppRegistry.registerComponent('Mentor', () => Main);
