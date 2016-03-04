import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";

export default StyleSheet.create({
  container: {
    ...root_view,
    justifyContent: 'flex-end',
    paddingBottom: device.size(30)
  },
  items: {
    flex: 1
  },
  item: {
    height: 64,
    justifyContent: 'center'
  },
  itemText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: device.fontSize(21),
    fontWeight: '500'
  },
  button: {
    backgroundColor: 'hsl(202, 78%, 51%)',
    height: device.size(57),
    justifyContent: 'center',
    marginHorizontal: device.size(30)
  }
})