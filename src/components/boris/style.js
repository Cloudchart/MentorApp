import React, { StyleSheet } from "react-native";
import * as device from "../../utils/device";

export default StyleSheet.create({
  container: {
    paddingVertical: device.size(10)
  },
  containerBig: {
    flexDirection: 'column',
    paddingHorizontal: device.size(50)
  },
  containerSmall: {
    flexDirection: 'row',
    paddingLeft: device.size(10),
    paddingRight: device.size(20)
  },
  faceContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  faceContainerBig: {
    alignSelf: 'center',
    marginBottom: device.size(30),
    width: device.size(200),
    height: device.size(200)
  },
  faceContainerSmall: {
    marginRight: device.size(20),
    height: device.size(70),
    width: device.size(70)
  },
  noteContainer: {
    flex: 1,
    borderRadius: 5,
    padding: device.size(18)
  },
  noteContainerPositive: {
    backgroundColor: 'hsl(137, 54%, 50%)'
  },
  noteContainerNegative: {
    backgroundColor: 'white'
  },
  noteText: {
    fontSize: device.fontSize(21),
    fontWeight: '500'
  },
  noteTextNegative: {
    color: 'black'
  },
  noteTextPositive: {
    color: 'white'
  },
  handleImage: {
    left: 0,
    position: 'absolute',
    top: 0
  },
  handleImageBig: {
    left: 15,
    top: -17
  },
  handleImageSmall: {
    left: -19,
    top: 15
  }
})
