import React, {
  Animated,
  Easing,
  Dimensions,
  PanResponder
} from "react-native";
import clamp from "clamp";
import {
  SWIPE_THRESHOLD,
  SWIPE_THRESHOLD_MINI,
  ADD_CARD_REF,
  CONTROLS_WIDTH,
  SHARE_CARD_REF,
  CONTROL_PIECE,
  DEVIATION
} from "../../components/insight/const";

/**
 * if a negative number
 * @param n
 * @returns {boolean}
 */
function negative(n) {
  return n < 0;
}

let _whatToDoOnRelease = '';

function onPanResponderGrant() {
  this._pan.setOffset({
    x: this._pan.x._value,
    y: this._pan.y._value
  })
  this._pan.setValue({ x: 0, y: 0 })
}

function onPanResponderMove(raw, gestureState) {
  const _overControlAdd = overControlAdd.bind(this)
  const _overControlShare = overControlShare.bind(this)

  this.refs[ ADD_CARD_REF ].measure((x, y, width, height, px, py) => {
    _overControlAdd({ x, y, width, height, px, py }, gestureState)
  });
  this.refs[ SHARE_CARD_REF ].measure((x, y, width, height, px, py) => {
    _overControlShare({ x, y, width, height, px, py }, gestureState)
  });
  //if ( this.state.showCardTopicName ) return;
  this._showPopupControl()
  this._pan.setValue({ x: gestureState.dx, y: 0 });
}

/**
 * Calculate finger position on the control
 * @param measure
 * @param gestureState
 */
function overControlShare(measure, gestureState) {
  const area = {
    top: measure.py,
    bottom: measure.py + (measure.height - DEVIATION),
    right: measure.px,
    left: measure.px + measure.width
  }
  if ((gestureState.moveY >= area.top && gestureState.moveY <= area.bottom) &&
    (gestureState.moveX >= area.right && gestureState.moveX <= area.left)) {
    this._shareControl.setValue({ x: CONTROLS_WIDTH, y: 0 })
    this._addControl.setValue({ x: CONTROL_PIECE, y: 0 })
    _whatToDoOnRelease = 'share';
  } else {
    if ( _whatToDoOnRelease == 'share' ) {
      _whatToDoOnRelease = '';
      this._shareControl.setValue({ x: CONTROL_PIECE, y: 0 })
    }
  }
}

/**
 * Calculate finger position on the control
 * @param measure
 * @param gestureState
 */
function overControlAdd(measure, gestureState) {
  const area = {
    top: measure.py + DEVIATION,
    bottom: measure.py + measure.height,
    right: measure.px,
    left: measure.px + measure.width
  }
  if ( (gestureState.moveY >= area.top && gestureState.moveY <= area.bottom) &&
    (gestureState.moveX >= area.right && gestureState.moveX <= area.left) ) {
    this._addControl.setValue({ x: CONTROLS_WIDTH, y: 0 })
    this._shareControl.setValue({ x: CONTROL_PIECE, y: 0 })
    _whatToDoOnRelease = 'add';
  } else {
    if (_whatToDoOnRelease == 'add') {
      _whatToDoOnRelease = '';
      this._addControl.setValue({ x: CONTROL_PIECE, y: 0 })
    }
  }
}

function onPanResponderRelease(event, { vx, vy }) {
  this._pan.flattenOffset()
  let velocity
  if (vx >= 0) {
    velocity = clamp(vx, 3, 5)
  } else if ( vx < 0 ) {
    velocity = clamp(vx * -1, 3, 5) * -1
  }

  /**
   * if this.state.pan.x._value a negative number
   * hence we did swipe right
   */
  if (negative(this._pan.x._value) && Math.abs(this._pan.x._value) > SWIPE_THRESHOLD) {
    this.handleDislikePress({
      velocity: { x: velocity, y: vy },
      deceleration: 0.98
    })
    return
  }

  /**
   * return the card to the starting position
   */
  //if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
  switch (_whatToDoOnRelease) {
    case 'share':
      this.handleShareButtonPress()
      break;
    case 'add':
      this.handleAddButtonPress(false, true)
      break;
    default:
      if (!negative(this._pan.x._value) &&
        Math.abs(this._pan.x._value) > SWIPE_THRESHOLD_MINI) {
        this.handleLikePress()
      }
  }

  _whatToDoOnRelease = ''

  setTimeout(() => {
    this._hidePopupControls()
    this._returnCardToStartingPosition()
  }, 0)
}

export default function panResponder(InsightForMeElement) {
  return PanResponder.create({
    onMoveShouldSetResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: (event, gestureState) => {
      return gestureState.dx != 0 && gestureState.dy != 0
    },
    onPanResponderGrant: onPanResponderGrant.bind(InsightForMeElement),
    onPanResponderMove: onPanResponderMove.bind(InsightForMeElement),
    onPanResponderRelease: onPanResponderRelease.bind(InsightForMeElement)
  })
}
