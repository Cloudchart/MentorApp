import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";

export default StyleSheet.create({
  container: {
    ...root_view,
    paddingTop: device.size(10)
  },
  collectionsContainer: {},

  collectionItem: {
    flex: 1,
    backgroundColor: 'hsl(0, 0%, 11%)',
    borderBottomColor: 'hsl(137, 59%, 43%)',
    borderBottomWidth: 2
  },

  collectionItemInner: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: device.size(64),
    paddingHorizontal: device.size(18)
  },

  newCollection: {
    
    height: device.size(64),
    backgroundColor: 'hsla(137, 54%, 50%, 0.5)'
  },

  collectionItemMore: {
    backgroundColor: '#292929',
    flex: 1,
    position: 'relative',
    height: 0,
    overflow: 'hidden'
  },

  collectionItemMoreInner: {
    flex: 1,
    paddingHorizontal: device.size(15),
    paddingVertical: device.size(13)
  },
  collectionItemMoreText: {
    color: '#fff',
    fontSize: device.fontSize(15)
  },

  collectionButton: {
    alignItems: 'center',
    flexDirection: 'row',
    height: device.size(64),
    paddingHorizontal: device.size(18),
  },

  collectionText: {
    color: 'white',
    flex: 1,
    fontSize: device.fontSize(18),
    fontWeight: '400',
    marginHorizontal: device.size(12),
    overflow: 'hidden'
  },

  textMore: {
    flex: 1,
    color: 'hsl(137, 59%, 43%)',
    position: 'absolute',
    bottom: device.fontSize(10),
    left: 0,
    fontSize: device.fontSize(18),
    fontWeight: '300',
    marginHorizontal: device.size(12),
  },

  collectionCounterText: {
    color: 'hsl(137, 59%, 43%)',
    fontSize: device.fontSize(18),
    fontWeight: '300'
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
