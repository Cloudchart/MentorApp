import React, { StyleSheet, Dimensions } from "react-native";
import * as device from "../../utils/device";
const dimensions = Dimensions.get('window');

export default StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loaderMini: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position : 'absolute',
    width : 50,
    height : 50,
    backgroundColor : 'red',
    opacity : 0.5,
    transform : [
      {
        translateX : (dimensions.width / 2) - 25,
        translateY : (dimensions.height / 2) - 25
      }
    ]
  }
});

