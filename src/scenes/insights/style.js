import React, { StyleSheet, Dimensions } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";
import { CONTROLS_WIDTH } from "../../components/insight/const";
const dimensions = Dimensions.get('window');


const controls = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: device.size(50),
  width: device.size(100),
  height: device.size(100),
  overflow: 'hidden',
  position: 'absolute',
  bottom: device.size(5)
}

export default StyleSheet.create({
  container: {
    ...root_view,
    flexDirection: 'row'
  },
  wrapperAddCardControl: {
    flex: 1,
    position: 'absolute',
    right: -CONTROLS_WIDTH
  },
  card: {
    flex: 1,
    position: 'absolute',
    top: device.size(-20),
    bottom : 0,
    left : 0,
    right : 0,
    flexDirection: 'row',
    paddingHorizontal: device.size(10),
    paddingVertical: device.size(10)
  },
  controlWrapper: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  controlInner: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: device.size(8)
  },

  controlLeft: {
    ...controls,
    left: device.size(5),
    backgroundColor: '#ea3941'
  },

  controlRight: {
    ...controls,
    right: device.size(5),
    backgroundColor: '#00c468'
  },

  icons: {
    fontSize: device.fontSize(70),
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

  titleAdvice: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    right: 0,
    left: 0,
    top: device.size(-10)
  },

  titleAdviceText: {
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: device.fontSize(20),
    paddingVertical: device.size(16),
    color: '#00c568',
    fontWeight: '500'
  }

})
