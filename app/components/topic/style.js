import React, { StyleSheet } from "react-native";
import * as device from "../../utils/device";

export default StyleSheet.create({
  item: {
    justifyContent: 'center',
    position: 'relative',
    flex: 1
  },
  itemInner: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: device.size(18)
  },
  itemText: {
    color: 'white',
    alignSelf: 'center',
    flex: 1,
    fontSize: device.fontSize(21),
    fontWeight: '500',
    overflow: 'hidden'
  },
  selected: {
    flex: 1,
    alignSelf: 'center',
    width: device.size(80),
    height: device.size(44),
    overflow: 'hidden',
    position: 'absolute',
    marginTop: device.size(23),
    top: 0,
    right: 0
  },
  selectedIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    color: '#58de87',
    fontSize: device.fontSize(28)
  }
})