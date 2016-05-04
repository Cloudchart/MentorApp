import React, {
  View,
  Component,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  PanResponder
} from 'react-native';
import { HIDE_NOTIFICATION } from '../../actions/application';
import { EventManager } from '../../event-manager';
import styles from './style';

class UserNotifications extends Component {

  state = {
    translateY: new Animated.Value(0)
  }

  constructor (props) {
    super(props)
    this._onHide = this._onHide.bind(this);

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: this._onStartShouldSetResponder.bind(this),
      onMoveShouldSetPanResponder: this._onResponderMove.bind(this),
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false
    });

    if ( !props.onPress ) {
      setTimeout(()=> {
        this._onHide()
      }, 3000)
    }
  }

  _onStartShouldSetResponder () {
    const { onPress } = this.props;
    if ( onPress ) {
      onPress();
    } else {
      this._onHide();
    }

    return false;
  }

  _onResponderMove () {
    return false;
  }

  _onHide () {
    Animated.spring(
      this.state.translateY,
      {
        toValue: -100,
        duration: 300,
        easing: Easing.elastic(2)
      }
    ).start(this._finishAnimation);
  }

  _finishAnimation () {
    EventManager.emit(HIDE_NOTIFICATION)
  }

  getStyle () {
    return {
      transform: [ {
        translateY: this.state.translateY
      } ]
    };
  }

  render () {
    const { style } = this.props;
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[styles.notifications, this.getStyle(), style]}>
        <TouchableWithoutFeedback>
          <Text style={styles.notificationsText}>{this.props.notification}</Text>
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }
}

export default UserNotifications;
