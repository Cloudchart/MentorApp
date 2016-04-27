import React, { StyleSheet } from "react-native";
import * as device from "../../utils/device";

export default StyleSheet.create({
  container: {
    flex: 1
  },
  yourPlanHeader: {
    color: '#fff',
    alignSelf: 'center',
    paddingTop: device.size(20),
    paddingBottom: device.size(20),
    fontSize: device.fontSize(32)
  },
  yourPlanProduct: {
    color: 'rgb(249, 188, 54)',
    alignSelf: 'center',
    fontSize: device.fontSize(18),
    fontWeight: '400'
  },
  transparentText: {
    color: 'transparent'
  },
  noteText: {
    color: 'white',
    fontSize: device.fontSize(18),
    fontWeight: '500',
    marginHorizontal: device.size(20),
    marginTop: device.size(15)
  },
  subscriptionsContainer: {
    flex: 1,
    marginHorizontal: device.size(20),
    marginVertical: device.size(10)
  },
  subscription: {
    alignItems: 'center',
    backgroundColor: 'rgb(247, 187, 53)',
    borderRadius: device.size(15),
    flexDirection: 'row',
    height: device.size(85),
    marginVertical: device.size(10),
    paddingHorizontal: device.size(20)
  },
  disabledSubscription: {
    alignItems: 'center',
    backgroundColor: 'rgba(247, 187, 53, .5)',
    borderRadius: device.size(15),
    flexDirection: 'row',
    height: device.size(85),
    marginVertical: device.size(10),
    paddingHorizontal: device.size(20)
  },
  subscriptionTitle: {
    flex: 1
  },
  subscriptionTitleText: {
    fontSize: device.fontSize(20),
    fontWeight: '400'
  },
  subscriptionPrice: {
    marginLeft: 10
  },
  subscriptionPriceText: {
    fontSize: device.fontSize(20),
    fontWeight: '600',
  },
  subscriptionDisabledText: {
    // backgroundColor: '#eee',
    opacity: 0.75
  },
  subscriptionPriceTextNote: {
    fontSize: device.fontSize(12),
    fontWeight: '300'
  },
  subscriptionTitleNote: {
    fontSize: device.fontSize(14),
    fontWeight: '400'
  },
  deleted: {
    borderTopColor: 'rgb(206, 11, 36)',
    borderTopWidth: 1.5,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    transform: [
      {rotate: '-10deg'},
      {translateY: device.size(12)},
      {translateX: device.size(-2)}
    ],
  },
  subscriptionsFootnote: {
    marginTop: device.size(10)
  },
  subscriptionsFootnoteText: {
    color: 'rgb(146, 146, 146)',
    textAlign: 'center'
  },
  denyControl: {
    alignSelf: 'center',
    marginVertical: device.size(20)
  },
  denyControlText: {
    color: 'rgb(249, 188, 54)',
    fontSize: device.fontSize(18),
    fontWeight: '400'
  }
})
