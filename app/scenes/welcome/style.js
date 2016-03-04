import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";


export default StyleSheet.create({
  container: {
    ...root_view,
    flexDirection : 'row',
  },

  boris: {
    flex : 1,
    marginTop : device.size(-30),
    alignSelf: 'center',
    paddingBottom: device.size(60)
  },

  continue: {
    position: 'absolute',
    bottom: device.size(30),
    left: 0,
    right: 0
  }
})
