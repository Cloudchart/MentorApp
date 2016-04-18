import React, { StyleSheet, Dimensions } from "react-native";
import * as device from "../../utils/device";
const dimensions = Dimensions.get('window');


export default StyleSheet.create({
  item: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: device.size(14),
    paddingVertical: device.size(14),
    backgroundColor: 'transparent'
  },
  itemInner: {
    flex: 1,
    flexDirection : 'row',
    borderRadius: device.size(6),
    paddingHorizontal: device.size(18),
    paddingVertical: device.size(18),
    backgroundColor: '#fff',
    //height: device.size(dimensions.height / 2)
  },
  itemText: {
    color: '#000',
    flex: 1,
    lineHeight: device.fontSize(40),
    fontSize: device.fontSize(34),
    fontWeight: '500',
    overflow: 'hidden'
  },
  itemMore: {
    flex: 1,
    height: 0,
    overflow: 'hidden'
  },
  itemMoreInner: {
    flex: 1,
    paddingHorizontal: device.size(18),
    paddingVertical: device.size(18)
  },
  itemMoreText: {
    flex: 1,
    color: '#00c468',
    fontSize: device.fontSize(20)
  },
  itemMoreTextTime: {
    flex: 1,
    flexDirection: 'column',
    color: '#fff',
    fontWeight: '500',
    marginTop: device.size(10),
    fontSize: device.fontSize(20)
  },
  itemTime: {
    flex: 1
  },
  crumbIcon: {
    color: '#fff',
    fontSize: device.fontSize(20)
  }
});

