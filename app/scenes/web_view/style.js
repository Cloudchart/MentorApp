import React, { StyleSheet } from "react-native";
import * as device from "../../utils/device";

const buttons = {};

export default StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  navigation: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    backgroundColor: 'transparent',
    top: device.size(-47),
    right: 0,
    left: 0
  },

  leftButton: {
    ...buttons
  },

  rightButton: {
    ...buttons,
    alignSelf: 'flex-end'
  },
  webView : {
    marginTop : device.size(10)
  }
})