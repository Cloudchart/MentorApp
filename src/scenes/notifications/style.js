import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";

export default StyleSheet.create({
  container: {
    ...root_view
  },
  boris: {
    marginBottom: device.size(40)
  },
  containerButtons: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0
  },
  transparent : {
    paddingVertical: device.size(25)
  }
})
