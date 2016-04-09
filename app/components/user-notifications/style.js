import React, { StyleSheet } from "react-native";
import * as device from "../../utils/device";

export default StyleSheet.create({
  notifications: {
    position : 'absolute',
    top: 0,
    left :0,
    right : 0,
    paddingVertical : 20,
    opacity : 0.90,
    backgroundColor: '#F23558',
    alignItems: 'center'
  },
  notificationsText : {
    color : '#fff',
    alignSelf: 'center',
    fontSize: device.fontSize(18)
  }
});

