import React, { StyleSheet } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";
export const CONTROLS_WIDTH = device.size(240);

export default StyleSheet.create({
  container: {
    ...root_view,
    position: 'relative',
    paddingTop: device.size(10),
    paddingBottom: device.size(20)
  },
  scroll : {
    flex: 1,
    paddingTop: device.size(120)
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


  wrapperAddCardControl: {
    flex: 1,
    position: 'absolute',
    top : 40,
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
  //pass into a component Card
  cardText: {
    color: '#000',
    flex: 1,
    lineHeight: device.fontSize(40),
    fontSize: device.fontSize(34),
    fontWeight: '500',
    overflow: 'hidden'
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
  }
})
