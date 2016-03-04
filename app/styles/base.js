import React, { StyleSheet } from "react-native";
import * as device from "../utils/device";


export const root_view = {
  flex: 1,
  position: 'relative',
  backgroundColor: '#000',
  paddingTop: device.size(35)
}

const crumbIconPlaceholder = {
  height: device.size(45),
  paddingTop: device.size(10),
  paddingRight: device.size(12),
  paddingLeft: device.size(12)
}

const crumbIcon = {
  fontSize: device.fontSize(26),
  color: '#01b058',
  backgroundColor: 'transparent'
}

export const _flex = {
  flex: 1
}

export const StatusBarStyle = StyleSheet.create({
  header: {
    backgroundColor: '#000'
  }
})


const crumbIconWrapper = {
  flexDirection: 'row',
  borderRadius: device.size(5),
  alignItems: 'center',
  backgroundColor: '#808080',
  marginTop: device.size(10),
  marginRight: device.size(15),
  paddingHorizontal: device.size(6),
  paddingVertical: device.size(4)
}

export default StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: device.size(65)
  },
  root_view_wrapper: {
    flex: 1
  },

  title_blank: {
    width: 3000,
    fontSize: device.fontSize(18),
    lineHeight: device.fontSize(32),
    color: '#fff'
  },
  title_plain: {
    fontSize: device.fontSize(18),
    lineHeight: device.fontSize(34),
    color: '#4c4b4d',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  title: {
    backgroundColor: '#000',
    borderBottomColor: '#E8E8E6',
    //borderBottomWidth: 1,
    position: 'relative',
    top: device.size(-20),
    height: device.size(65)
  },
  title_item: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: device.size(12),
    fontSize: device.fontSize(18),
    lineHeight: device.fontSize(27),
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500'
  },

  crumbIconPlaceholder: {
    ...crumbIconPlaceholder
  },
  crumbIconWrapper: {
    ...crumbIconWrapper
  },
  crumbIconWrapperGreen: {
    ...crumbIconWrapper,
    flex: 0,
    backgroundColor: '#00c568',
    paddingHorizontal: device.size(10)
  },
  crumbIcon: {
    ...crumbIcon
  },
  crumbIconPlus: {
    ...crumbIcon,
    fontSize: device.fontSize(30)
  },
  crumbIconBasket: {
    ...crumbIcon,
    color: '#fff',
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: device.fontSize(16)
  },

  crumbIconBasketText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: device.fontSize(16)
  },
  crumbIconAngle: {
    ...crumbIcon,
    fontSize: device.fontSize(35),
    bottom: 4
  },

  crumbIconSearch: {
    ...crumbIcon,
    fontSize: device.fontSize(24),
    fontWeight: '200',
    bottom: 0
  },

  crumbIconSettings: {
    ...crumbIcon,
    fontSize: device.fontSize(35),
    color: '#00c568',
    bottom: 2
  },

  folderIcon: {
    color: '#00af58'
  }
})
