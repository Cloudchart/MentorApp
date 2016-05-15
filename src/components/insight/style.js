import React, { StyleSheet, Dimensions } from "react-native";
import * as device from "../../utils/device";
const dimensions = Dimensions.get('window');

const text = {
  color: '#00c468',
  fontSize: device.fontSize(20)
};

const itemInner = {
  flex: 1,
  flexDirection: 'row',
  borderRadius: device.size(6),
  paddingHorizontal: device.size(18),
  paddingVertical: device.size(18),
  backgroundColor: '#fff'
};

const itemText = {
  color: '#000',
  flex: 1,
  //lineHeight: device.fontSize(40),
  fontSize: device.fontSize(34),
  fontWeight: '500',
  overflow: 'hidden'
};

export default StyleSheet.create({
  item: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: device.size(10),
    paddingVertical: device.size(5),
    backgroundColor: 'transparent'
  },
  itemScaling: {
    paddingVertical: device.size(10),
    paddingHorizontal: 0,
  },
  itemInner: {
    ...itemInner
  },
  itemInnerScaling: {
    ...itemInner,
    position: 'absolute',
    left: device.size(10),
    right: device.size(10),
    opacity: 0,
  },

  itemInnerLike: {
    ...itemInner,
    backgroundColor: '#43c266'
  },

  itemText: {
    ...itemText
  },
  itemTextScaling: {
    color: '#aaaaaa',
  },

  itemTextLike : {
    ...itemText,
    color : '#fff'
  },

  itemMore: {
    flex: 1,
    height: 0,
    overflow: 'hidden'
  },
  itemMoreInner: {
    flex: 1,
    paddingHorizontal: device.size(18),
    paddingTop: device.size(18)
  },
  itemMoreControl: {
    flex: 1,
    flexDirection: 'row'
  },
  itemMoreControlLeft: {
    flex: 1
  },
  itemMoreControlRight: {
    flex: 1
  },

  itemMoreControlLeftText: {
    ...text,
    color: '#de3a41',
    alignSelf: 'flex-start'
  },
  itemMoreControlRightText: {
    ...text,
    color: '#43c266',
    alignSelf: 'flex-end'
  },

  itemMoreText: {
    ...text
  },
  itemMoreTextTime: {
    flex: 1,
    flexDirection: 'column',
    color: '#fff',
    fontWeight: '500',
    marginTop: device.size(8),
    paddingBottom: device.size(2),
    fontSize: device.fontSize(20)
  },
  itemTime: {
    flex: 1
  },
  crumbIcon: {
    color: '#fff',
    fontSize: device.fontSize(20)
  }
});

