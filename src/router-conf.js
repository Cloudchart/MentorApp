/**
 * Warning! This config doesn't work properly and can cause some issues with renderScene
 */
import React, { Component, Navigator, Dimensions, PixelRatio } from 'react-native'

const buildStyleInterpolator = require('buildStyleInterpolator')
const SCREEN_WIDTH = Dimensions.get('window').width
const sourceConfig = Navigator.SceneConfigs.FloatFromRight
const baseConfig = {
  gestures: {},
  ...sourceConfig,
}

const customLeftToRightGesture = {
  snapVelocity: 8,
  edgeHitWidth: SCREEN_WIDTH,
}
const fadeToTheLeft = {
  // Rotate *requires* you to break out each individual component of
  // rotation (x, y, z, w)
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: -Math.round(Dimensions.get('window').width * 0.3), y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  // Uncomment to try rotation:
  // Quick guide to reasoning about rotations:
  // http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-17-quaternions/#Quaternions
  // transformRotateRadians: {
  //   from: {x: 0, y: 0, z: 0, w: 1},
  //   to: {x: 0, y: 0, z: -0.47, w: 0.87},
  //   min: 0,
  //   max: 1,
  //   type: 'linear',
  //   extrapolate: true
  // },
  transformScale: {
    from: { x: 1, y: 1, z: 1 },
    to: { x: 1, y: 1, z: 1 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
  },
  opacity: {
    from: 1,
    to: 1,
    min: 1,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100,
  },
  translateX: {
    from: 0,
    to: -Math.round(Dimensions.get('window').width * 0.3),
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  }
}
const fromTheRight = {
  opacity: {
    value: 1.0,
    type: 'constant',
  },
  transformTranslate: {
    from: { x: Dimensions.get('window').width, y: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  translateX: {
    from: Dimensions.get('window').width,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  scaleX: {
    value: 1,
    type: 'constant',
  },
  scaleY: {
    value: 1,
    type: 'constant',
  },
}

export const CustomSceneConfig = {
  ...baseConfig,
  springTension: 70,
  springFriction: 1,
  // Velocity to start at when transitioning without gesture
  defaultTransitionVelocity: 1.5,
  // Animation interpolators for horizontal transitioning:
  animationInterpolators: {
    into: buildStyleInterpolator(fromTheRight),
    out: buildStyleInterpolator(fadeToTheLeft),
  },
  gestures: {
    pop: customLeftToRightGesture,
  },
}


