import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";

const buttonPosition = {
  flex: 1,
  position: 'absolute',
  bottom : device.size(20),
  left : 0,
  right : 0
}

export default StyleSheet.create({
  container: {
    ...root_view,
    paddingTop: device.size(15),
    paddingBottom: device.size(15)
  },
  containerBoris: {
    ...buttonPosition,
    bottom : 0,
    flexDirection: 'row',
    paddingHorizontal: device.size(5),
    paddingVertical: device.size(18)
  },
  textBoris: {
    flex: 1,
    position: 'relative',
    left: -23,
    paddingHorizontal: device.size(5),
    paddingVertical: 18,
    fontSize: device.fontSize(18),
    fontWeight: '500',
    color: '#fff'
  },
  collectionsContainer: {},
  linearGradient: {
    flex: 1
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  itemInner: {
    alignItems: 'center',
    flex: 1,
    height: 64,
    paddingVertical: 18
  },
  itemText: {
    color: 'white',
    alignSelf: 'center',
    flex: 1,
    fontSize: device.fontSize(21),
    fontWeight: '500',
    marginHorizontal: 12,
    overflow: 'hidden'
  },

  selected: {
    flex: 1,
    alignSelf: 'center',
    width: 80,
    height: 44,
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
  },

  button: {
    ...buttonPosition
  }
})
