import React, {
  Animated,
  Easing,
  Dimensions,
  PanResponder,
} from 'react-native'
import clamp from 'clamp'
import {
  SWIPE_THRESHOLD,
  SWIPE_THRESHOLD_MINI,
  ADD_CARD_REF,
  CONTROLS_WIDTH,
  SHARE_CARD_REF,
  CONTROL_PIECE,
  DEVIATION,
} from '../../components/insight/const'

let _whatToDoOnRelease = ''

/**
 * Is it a negative number?
 * @param {Number} n
 * @returns {Boolean}
 */
function negative(n) {
  return n < 0;
}

function panResponderGrantHandler(insightCardElement) {
  return (event) => {
    // event.stopPropagation()
    const { _pan } = insightCardElement
    _pan.setOffset({
      x: _pan.x._value,
      y: _pan.y._value
    })
    _pan.setValue({x: 0, y: 0})
  }
}

function panResponderMoveHandler(insightCardElement) {
  return (raw, gestureState) => {
    const _overControlAdd = overControlAdd.bind(insightCardElement)
    const _overControlShare = overControlShare.bind(insightCardElement)
    insightCardElement.refs[ADD_CARD_REF].measure((x, y, width, height, px, py) => {
      _overControlAdd({x, y, width, height, px, py}, gestureState)
    })
    insightCardElement.refs[SHARE_CARD_REF].measure((x, y, width, height, px, py) => {
      _overControlShare({x, y, width, height, px, py}, gestureState)
    })
    //if ( this.state.showCardTopicName ) return;
    insightCardElement._showPopupControl()
    insightCardElement._pan.setValue({x: gestureState.dx, y: 0})
  }
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

function panResponderReleaseHandler(insightCardElement, params) {
  return (event, { vx, vy }) => {
    const { onLike, onDislike } = params || {}
    /**
     * some magic
     */
    insightCardElement._pan.flattenOffset()
    let velocity
    if (vx >= 0) {
      velocity = clamp(vx, 3, 5)
    } else if (vx < 0) {
      velocity = clamp(vx * -1, 3, 5) * -1
    }
    /**
     * if this.state.pan.x._value a negative number
     * hence we did swipe right
     */
    if (negative(insightCardElement._pan.x._value) &&
      Math.abs(insightCardElement._pan.x._value) > SWIPE_THRESHOLD) {
      const params = {
        velocity: {x: velocity, y: vy},
        deceleration: 0.98
      }
      if (onDislike) {
        onDislike(params)
      } else {
        insightCardElement.handleDislikePress(params)
      }
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
        if (!negative(insightCardElement._pan.x._value) &&
          Math.abs(insightCardElement._pan.x._value) > SWIPE_THRESHOLD_MINI) {
          if (onLike) {
            onLike()
          } else {
            insightCardElement.handleLikePress()
          }
        }
    }
    _whatToDoOnRelease = ''
    // Do that in next event loop cycle
    setTimeout(() => {
      insightCardElement._hidePopupControls()
      insightCardElement._returnCardToStartingPosition()
    }, 0)
  }
}

/**
 * @param {Function} insightCardElement
 * @param {Object} [params]
 * @param {Function} [params.onLike]
 * @param {Function} [params.onDislike]
 * @returns {Object}
 * @constructor
 */
export default function createInsightCardPanResponder(insightCardElement, params) {
  return PanResponder.create({
    onMoveShouldSetResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: (event, gestureState) => {
      return (gestureState.dx != 0 && gestureState.dy != 0)
    },
    onPanResponderGrant: panResponderGrantHandler(insightCardElement),
    onPanResponderMove: panResponderMoveHandler(insightCardElement),
    onPanResponderRelease: panResponderReleaseHandler(insightCardElement, params),
  })
}
