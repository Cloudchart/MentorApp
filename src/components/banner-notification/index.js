import React, {
  PropTypes,
  View,
  Component,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  PanResponder
} from 'react-native'
import styles from './style'

export default class BannerNotification extends Component {

  static propTypes = {
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.number,
    ]),
    timeout: PropTypes.number,
    onPress: PropTypes.func,
    onHide: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      translateY: new Animated.Value(-120),
    }
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => this.onStartShouldSetPanResponderCapture(),
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
    })
    if (!props.onPress) {
      setTimeout(() => {
        this.handleHide()
      }, props.timeout || 5000)
    }
  }

  componentDidMount() {
    Animated.spring(this.state.translateY, {
      toValue: -20,
      duration: 300,
      easing: Easing.elastic(2),
    }).start()
  }

  onStartShouldSetPanResponderCapture() {
    const { onPress } = this.props
    if (onPress) {
      const shouldContinue = onPress()
      if (shouldContinue === false) {
        return false
      }
    }
    this.handleHide()
    return false
  }

  handleHide() {
    Animated.spring(this.state.translateY, {
      toValue: -120,
      duration: 300,
      easing: Easing.elastic(2),
    }).start(() => this.handleAnimationFinish())
  }

  handleAnimationFinish() {
    if (this.props.onHide) {
      this.props.onHide()
    }
  }

  getStyle() {
    return {
      transform: [{
        translateY: this.state.translateY,
      }],
    }
  }

  render() {
    const { style, children } = this.props
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[styles.notification, this.getStyle(), style]}
        >
        <TouchableWithoutFeedback>
          <Text style={styles.notificationText}>
            {children}
          </Text>
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }
}
