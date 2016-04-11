import React, { StyleSheet } from "react-native";
import * as device from "../../utils/device";

export default StyleSheet.create({
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: '500'
  },
  connectButtonStyle: {
    borderRadius: device.size(12.5),
    justifyContent: 'center',
    paddingHorizontal: device.size(5),
    paddingVertical: device.size(30),
    backgroundColor: '#3b589c'
  }
})