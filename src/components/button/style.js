import React, { StyleSheet } from "react-native";
import * as device from "../../utils/device";

export const Colors = {
  blue: 'hsl(202, 78%, 51%)',
  green: 'hsl(137, 54%, 50%)',
  orange: 'hsl(44, 94%, 54%)',
  red: 'hsl(359, 73%, 55%)'
}


export default StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  transparent : {
    alignItems: 'center'
  },
  button: {
    borderRadius: device.size(12.5),
    height: device.size(57),
    justifyContent: 'center',
    marginHorizontal: device.size(30)
  },

  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: device.fontSize(20),
    fontWeight: '500'
  },

  buttonLabel: {
    fontSize: device.fontSize(18),
    fontWeight: '400'
  }
})
