import React, { StyleSheet, Dimensions } from "react-native";
import { root_view } from "../../styles/base";
import * as device from "../../utils/device";
import { CONTROLS_WIDTH } from "./const";
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
    color: '#000',
    alignSelf: 'center',
    fontSize: device.fontSize(22),
    fontWeight: '500'
  }
})

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
    color : '#fff',
    alignSelf: 'center',
    paddingBottom: device.size(20),
    fontSize: device.fontSize(32)
  }
})


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
    alignSelf: 'center',
    top: device.size(-60),
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
