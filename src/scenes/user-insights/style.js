import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";
import { CONTROLS_WIDTH } from "../../components/insight/const";

export default StyleSheet.create({
  container: {
    ...root_view,
    position: 'relative',
    paddingTop: 0,
    paddingBottom: device.size(20)
  },
  scroll : {
    // posit
    // flex: 1,
    // paddingTop: device.size(130)
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
  borisContainerInList: {
    flex: 1,
    position: 'relative',
    top : 0,
    left : 0,
    right : 0,
    justifyContent: 'center'
  },
  button: {
    marginTop: device.size(10)
  },

  wrapperAddCardControl: {
    flex: 1,
    position: 'absolute',
    top : 5,
    right: -CONTROLS_WIDTH
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

  controlShare: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: device.size(16),
    paddingVertical: device.size(20),
    borderBottomColor: '#00aced'
  },
  controlShareText: {
    alignSelf: 'flex-start',
    fontSize: device.fontSize(22),
    backgroundColor: 'transparent',
    color: '#fff',
    fontWeight: '500',
    marginLeft: device.size(15)
  },
  borisContainerCenter: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: device.size(30)
  }
})
