import React, {
  Animated,
  Easing,
  Dimensions,
  PanResponder
} from 'react-native'
import clamp from 'clamp'
import {
  SWIPE_THRESHOLD,
  SWIPE_THRESHOLD_MINI,
  ADD_CARD_REF,
  CONTROLS_WIDTH,
  SHARE_CARD_REF,
  CONTROL_PIECE,
  DEVIATION
} from '../../components/insight/const'

/**
 * if a negative number
 * @param n
 * @returns {boolean}
 */
function negative (n) {
  return n < 0;
}

const dimensions = Dimensions.get('window');

let _whatToDoOnRelease = '';

/**
 *
 * @param e
 * @param gestureState
 */
function onPanResponderGrant (e, gestureState) {
  e.stopPropagation();
  this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
  this.state.pan.setValue({ x: 0, y: 0 });
}

/**
 *
 * @param raw
 * @param gestureState
 */
function onPanResponderMove (raw, gestureState) {
  const _overControlAdd = overControlAdd.bind(this)
  const _overControlShare = overControlShare.bind(this)

  this.refs[ ADD_CARD_REF ].measure((x, y, width, height, px, py) => {
    _overControlAdd({ x, y, width, height, px, py }, gestureState)
  });
  this.refs[ SHARE_CARD_REF ].measure((x, y, width, height, px, py) => {
    _overControlShare({ x, y, width, height, px, py }, gestureState)
  });


  this._showControlPiece()
  /**
   * if it's useful insight then swipe right
   * otherwise swipe left
   */
  if (this.props.type === 'USEFUL') {
    this.state.pan.setValue({ x: gestureState.dx, y: 0 });
  //} else if (this.props.type === 'USELESS' && !negative(gestureState.dx) ) {
  } else {
    this.state.pan.setValue({ x: gestureState.dx, y: 0 });
  }
}


/**
 * calculate the position of the finger over control
 * @param measure
 * @param gestureState
 */
function overControlShare (measure, gestureState) {
  const area = {
    top: measure.py,
    bottom: measure.py + (measure.height - DEVIATION),
    right: measure.px,
    left: measure.px + measure.width
  }
  if ( (gestureState.moveY >= area.top && gestureState.moveY <= area.bottom) &&
    (gestureState.moveX >= area.right && gestureState.moveX <= area.left) ) {
    this.state.shareControl.setValue({ x: CONTROLS_WIDTH, y: 0 })
    this.state.addControl.setValue({ x: CONTROL_PIECE, y: 0 })
    _whatToDoOnRelease = 'share';
  } else {
    if ( _whatToDoOnRelease == 'share' ) {
      _whatToDoOnRelease = '';
      this.state.shareControl.setValue({ x: CONTROL_PIECE, y: 0 })
    }
  }
  //console.log(measure.px, measure.py, 'gestureState', gestureState.moveX, gestureState.moveY);
}

/**
 * calculate the position of the finger over control
 * @param measure
 * @param gestureState
 */
function overControlAdd (measure, gestureState) {
  const area = {
    top: measure.py + DEVIATION,
    bottom: measure.py + measure.height,
    right: measure.px,
    left: measure.px + measure.width
  }
  if ( (gestureState.moveY >= area.top && gestureState.moveY <= area.bottom) &&
    (gestureState.moveX >= area.right && gestureState.moveX <= area.left) ) {
    this.state.addControl.setValue({ x: CONTROLS_WIDTH, y: 0 })
    this.state.shareControl.setValue({ x: CONTROL_PIECE, y: 0 })
    _whatToDoOnRelease = 'add';
  } else {
    if ( _whatToDoOnRelease == 'add' ) {
      _whatToDoOnRelease = '';
      this.state.addControl.setValue({ x: CONTROL_PIECE, y: 0 })
    }
  }
}

/**
 *
 * @param e
 * @param vx
 * @param vy
 */
function onPanResponderRelease (e, { vx, vy }) {
  this.state.pan.flattenOffset();
  var velocity;

  if ( vx >= 0 ) {
    velocity = clamp(vx, 3, 5);
  } else if ( vx < 0 ) {
    velocity = clamp(vx * -1, 3, 5) * -1;
  }

  /**
   * if this.state.pan.x._value a negative number
   * hence we did swipe right
   */
  if ( negative(this.state.pan.x._value) && Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD ) {
    this.handleMarkUseless({
      velocity: { x: velocity, y: vy },
      deceleration: 0.98
    })
    return;
  }

  switch ( _whatToDoOnRelease ) {
    case 'share':
      this._onShare();
      break;
    case 'add':
      this._onMarkGood();
      break;
    default:
      _whatToDoOnRelease = '';
      if (this.props.type === 'USELESS') {
        if ( !negative(this.state.pan.x._value) && Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD_MINI ) {
          this._onMarkGood(true)
        }
      }
  }

  setTimeout(()=> {

    this._hideControlShare();
    if ( !_whatToDoOnRelease ) {
      this._returnCardToStartingPosition()
    } else {
      _whatToDoOnRelease = '';
    }
  }, 0)
}


/**
 *
 * @returns {*|{panHandlers}}
 * @private
 */
export function _panResponder () {
  return PanResponder.create({
    onPanResponderTerminationRequest: () => false,
    onMoveShouldSetResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      return gestureState.dx != 0 && gestureState.dy != 0;
    },
    onPanResponderGrant: onPanResponderGrant.bind(this),
    onPanResponderMove: onPanResponderMove.bind(this),
    onPanResponderRelease: onPanResponderRelease.bind(this)
  })
}
