import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";


const button = {
  color: '#fff',
  alignSelf: 'center',
  fontSize: device.fontSize(22),
  fontWeight: '500'
}

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
    ...button
  },
  buttonTextBlack: {
    ...button,
    color: '#000'
  }
});

export const allForNowStyle = StyleSheet.create({
  container: {
    ...root_view,
    justifyContent: 'flex-end',
    paddingBottom: device.size(20)
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
    ...button
  }
});

export const topicFinished = StyleSheet.create({
  container: {
    ...root_view,
    justifyContent: 'flex-end'
  },

  star: {
    alignItems: 'center',
    marginTop: device.size(30)
  },

  text: {
    color: '#fff',
    alignSelf: 'center',
    paddingBottom: device.size(20),
    fontSize: device.fontSize(32)
  }
});
