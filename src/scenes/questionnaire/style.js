import React, { StyleSheet } from 'react-native'
import * as device from '../../utils/device'
import { root_view } from '../../styles/base'

const button = {
  color: '#fff',
  alignSelf: 'center',
  fontSize: device.fontSize(22),
  fontWeight: '500'
}

export const reactionStyles = StyleSheet.create({
  container: {
    ...root_view,
    justifyContent: 'flex-end',
    paddingBottom: device.size(23),
  },
  borisContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: device.size(30),
  },
  button: {
    marginHorizontal: device.size(18),
    marginBottom: device.size(15),
  },
  buttonText: {
    ...button,
  },
  buttonTextBlack: {
    ...button,
    color: '#000',
  }
})

export default StyleSheet.create({
  container: {
    ...root_view,
    paddingTop: device.size(0),
    paddingBottom: device.size(20)
  },
  boris: {
    paddingBottom: device.size(30)
  },
  answerList: {
    flex: 1,
    borderRadius: 5,
    marginHorizontal: device.size(20),
    overflow : 'hidden'
  },
  answer: {
    backgroundColor: 'white',
    height: device.size(55),
    justifyContent: 'center',
    paddingHorizontal: device.size(20),
    borderTopColor: '#000',
    borderTopWidth: 1
  },
  answersButFirst: {
    borderTopColor: 'black',
    borderTopWidth: 1
  },
  answerText: {
    color: 'black',
    fontSize: device.fontSize(21),
    fontWeight: '500'
  }
})
