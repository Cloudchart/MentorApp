import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";

export default StyleSheet.create({
  container: {
    ...root_view
  },
  containerButtons: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0
  },
  boris: {
    marginBottom: device.size(40)
  },

  skipButtonStyle: {
    paddingVertical: device.size(20)
  }
})