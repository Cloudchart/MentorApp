import React, { StyleSheet } from 'react-native'
import * as device from '../../utils/device'

export default StyleSheet.create({
  notification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingTop: 40,
    opacity: 0.90,
    backgroundColor: '#338ada',
    alignItems: 'center',
  },
  notificationText: {
    color: '#fff',
    alignSelf: 'center',
    paddingTop: 10,
    fontSize: device.fontSize(18),
  }
})

