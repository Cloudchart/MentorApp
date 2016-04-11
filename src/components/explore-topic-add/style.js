import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";

export const commentStyle = StyleSheet.create({
  container: {
    ...root_view,
    justifyContent: 'flex-end',
    paddingBottom: device.size(23)
  },
  borisContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: device.size(30)
  },
  button: {
    marginHorizontal: device.size(18),
    marginBottom: device.size(15)
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: device.fontSize(22),
    fontWeight: '500'
  }
})