import React, { StyleSheet } from 'react-native'
import * as device from '../utils/device'

const HEIGHT = 150;
const BOTTOM_POSITION = 0;

export default StyleSheet.create({
  popoverWrapper: {
    flex: 1,
    position: 'relative'
  },

  popover: {
    flex: 1,
    position: 'absolute',
    right: device.size(5),
    bottom: device.size(-(BOTTOM_POSITION + HEIGHT)),
    height: device.size(HEIGHT),
    borderRadius: device.size(5),
    backgroundColor: '#fff',
    overflow: 'hidden',
    paddingHorizontal: device.size(8),
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  },
  itemTextWrapper: {
    flex: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    borderTopWidth: 1,
    //paddingVertical: device.size(8),
    //paddingHorizontal: device.size(8)
  },
  itemText: {
    color: '#000',
    alignSelf: 'flex-start',
    flex: 1,
    lineHeight: device.fontSize(34),
    fontSize: device.fontSize(18),
    fontWeight: '500'
  }
})
