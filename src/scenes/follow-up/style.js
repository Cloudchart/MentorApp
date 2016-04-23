import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";
import { CONTROLS_WIDTH } from "../../components/insight/const";

export default StyleSheet.create({
  container: {
    ...root_view,
    position: 'relative',
    paddingTop: device.size(10),
    paddingBottom: device.size(20)
  },
  scroll : {
    flex: 1,
    paddingTop: device.size(130)
  },
  crumbIcon: {
    color: '#fff',
    fontSize: device.fontSize(20)
  },
  borisContainer: {
    flex: 1,
    position: 'absolute',
    top : 0,
    left : 0,
    right : 0,
    justifyContent: 'center'
  },
  button: {
    marginTop: device.size(10)
  },
  
  card: {
    flex: 1,
    alignSelf: 'center',
    position: 'relative',
    paddingHorizontal: device.size(10),
    paddingVertical: device.size(10),
    backgroundColor: 'transparent'
  },

  icons: {
    fontSize: device.fontSize(60),
    color: '#fff',
    backgroundColor: 'transparent'
  },

  borisContainerCenter: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: device.size(30)
  }
})
