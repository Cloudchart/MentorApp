import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";

export default StyleSheet.create({
  container: {
    ...root_view,
    paddingBottom: device.size(20)
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
    color: '#fff',
    alignSelf: 'center',
    flex: 1,
    fontSize: 21,
    fontWeight: '500',
    marginHorizontal: 12,
    overflow: 'hidden'
  },
  borisContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: device.size(30)
  },
  button: {
    marginHorizontal: device.size(18)
  },
  buttonText: {
    color: '#000',
    alignSelf: 'center',
    fontSize: device.fontSize(22),
    fontWeight: '500'
  },

  iconBasketView: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: device.size(4)
  },

  iconBasket: {
    color: '#fff',
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: device.fontSize(20)
  }
})