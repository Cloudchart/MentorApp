import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Linking,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Loader from '../../components/loader'
import Filters from '../../utils/filters'
import { Presets } from '../../utils/animation'
import Url from 'url'
import styles from './style'
import clamp from 'clamp'
import * as device from '../../utils/device'
import AutoText from '../../components/auto-text'

const BASIC_CONTENT_LENGTH = 120
const BASIC_FONT_SIZE = 34
const INSIGHTS_FONT_SIZE = 24

function getAdjustedFontSize(content, baseContentLength, fontSize) {
  const minFontSize = 14;
  if (content.length > baseContentLength) {
    let ratio = content.length / baseContentLength;
    let percentFontSize = Math.ceil(fontSize / ratio);
    percentFontSize =
      percentFontSize < minFontSize ?
        minFontSize :
        percentFontSize
    const { length } = content
    if (length > 100 && length < 140) {
      percentFontSize += 4
    }
    if (length >= 140 && length < 165) {
      percentFontSize += 3.8
    }
    if (length >= 165 && length < 200) {
      percentFontSize += 3
    }
    if (length > 200 && length < 300) {
      percentFontSize += 6
    }
    if (length >= 300 && length < 350) {
      percentFontSize += 2
    }
    if (length >= 350 && length < 400) {
      percentFontSize += 8
    }
    if (length > 400) {
      percentFontSize += 7
    }
    return device.fontSize(percentFontSize);
  }
  return fontSize
}

function getScalingText(content) {
  if (typeof content === 'string') {
    let result = content.trim().substr(0, 100)
    if (content.length > 100) {
      result += '...'
    }
    return result
  }
  return ''
}

export function animationCardLeft(params, animateProps, callback) {
  let setting = {
    velocity: { x: clamp(100 * -1, 3, 5) * -3, y: 0 },
    deceleration: 0.98,
    ...params
  }
  Animated
    .decay(animateProps, setting)
    .start(callback ? callback : ()=> {})
}

export function animationCardRight(animateProps, callback) {
  let setting = {
    velocity: { x: clamp(7, 3, 5), y: 0 },
    deceleration: 0.98,
  }
  Animated
    .decay(animateProps, setting)
    .start(callback ? callback : () => {})
}

export function animateReturnCardToStartPosition(animateProps) {
  Animated.spring(animateProps, {
    toValue: { x: 0, y: 0 },
    friction: 4
  }).start()
}

export function animateEntrance(animateProps) {
  Animated.spring(animateProps, {
      toValue: 1,
      duration: 500,
      friction: 8
    }
  ).start();
}

class Insight extends Component {

  constructor(props, context) {
    super(props, context)
    this._openWebView = this._openWebView.bind(this)
    this._onCardPress = this._onCardPress.bind(this)
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!
        this._openWebView()
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    })
    this._panResponderStop = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    })
    this._isLayoutAnimationRun = false
    this.state = {
      isScaling: false,
      scaledFontSize: null,
      rowHeight: 0,
      visibility: 0,
      update: 0,
    }
  }

  componentDidMount() {
    if (this.props.fixedFontSize) return;
    this.setState({
      isScaling: true,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.insight !== this.props.insight) {
      if (this.props.fixedFontSize) return;
      this.setState({
        isScaling: true,
        scaledFontSize: null,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { onScalingStateChange } = this.props
    const { isScaling } = this.state
    if (isScaling !== prevState.isScaling) {
      onScalingStateChange && onScalingStateChange(isScaling)
    }
  }

  /**
   *
   * @param evt
   * @private
   */
  _onCardPress(evt) {
    if ( !this.props.doNotToggle ) {
      this._toggle()
    }
    if (this.props.onCardPress) {
      const isDetailsVisible = this.state.rowHeight !== 0
      this.props.onCardPress({isDetailsVisible})
    }
  }

  _toggle (opt_param) {
    this._isLayoutAnimationRun = true;
    const { origin } = this.props.insight;

    LayoutAnimation.configureNext(Presets.Linear, ()=> {
      this.setState({
        visibility: this.state.visibility ? 1 : 0,
        update: Math.random(1000) * 1000
      })
    })

    this.setState({
      rowHeight: this.state.rowHeight > 0 ? 0 : !origin.duration ? 70 : 100,
      visibility: 1,
      update: Math.random(1000) * 1000
    })
  }

  _openWebView() {
    const { insight } = this.props
    if (insight && insight.origin && insight.origin.url) {
      Linking.openURL(insight.origin.url)
    }
  }

  /**
   *
   * @returns {{height: number}}
   */
  getStyle () {
    return {
      height: !this._isLayoutAnimationRun ? 0 : this.state.rowHeight
    };
  }

  handleScaleComplete({ fontSize }) {
    try {
      this.setState({
        scaledFontSize: fontSize,
        isScaling: false,
      })
    } catch (e) {
      // nothing
    }
  }

  render() {
    const { content, origin } = this.props.insight
    const { visibility, isScaling, scaledFontSize } = this.state
    const finalContent = (typeof content === 'string') ? content : ''
    const sourceURL = origin && origin.url ? origin.url : ''
    let finalURL = ''
    if (Filters.reWeburl.test(sourceURL)) {
      const parsedURL = Url.parse(sourceURL).host
      finalURL =
        parsedURL.indexOf('www') == 0 ?
        parsedURL.substr(4, sourceURL.length - 1) :
          parsedURL
    }
    let finalDuration = ''
    if (origin.duration) {
      const dtn = origin.duration
      const dm = Math.floor(dtn / 60)
      const dh = Math.floor(dtn / 3600)
      const diffMinute = dm ? dm : null
      const diffHour = dh ? dh : null
      const lessMinute = dtn < 60 ? 1 : null
      if ( lessMinute ) {
        finalDuration = `less than a ${lessMinute} minute`
      } else if ( diffHour ) {
        finalDuration = `${diffHour} ${Filters.filterPlural(diffHour, [ 'hour', 'hours', 'hours' ])}`
      } else if ( diffMinute ) {
        finalDuration = `${diffMinute} ${Filters.filterPlural(diffMinute, [ 'minute', 'minutes', 'minutes' ])}`
      }
    }
    const maxContentHeight = Dimensions.get('window').height - 350
    // const baseContentHeight = Dimensions.get('window').height - 500
    const basicFontSize = getAdjustedFontSize(finalContent, BASIC_CONTENT_LENGTH, BASIC_FONT_SIZE)
    // User Insights: keep one font size
    const fontSize = this.props.fixedFontSize ? INSIGHTS_FONT_SIZE : scaledFontSize || basicFontSize
    const insightTextStyle = [
      styles.itemText,
      { fontSize },
      isScaling && styles.itemTextScaling,
    ]
    const containerStyles = [
      styles.item,
      this.props.style,
      isScaling && styles.itemScaling,
    ]
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={containerStyles}
        onPress={this._onCardPress}
        >
        {isScaling && (
          <View style={[styles.itemInnerScaling]}>
            <AutoText
              style={styles.itemText}
              maxHeight={maxContentHeight}
              initialFontSize={scaledFontSize || BASIC_FONT_SIZE}
              onComplete={({ fontSize }) => this.handleScaleComplete({ fontSize })}
              >
              {finalContent}
            </AutoText>
          </View>
        )}
        {isScaling && (
          <Loader />
        )}
        {isScaling === false && (
          <View style={[styles.itemInner]}>
            <Text style={insightTextStyle}>
              {finalContent}
            </Text>
          </View>
        )}
        {isScaling === false && origin && (
          <View style={[styles.itemMore, this.getStyle()]}>
            {visibility === 1 && (
              <View style={styles.itemMoreInner}>
                <View
                  style={{alignSelf: 'flex-start'}}
                  {...this._panResponder.panHandlers}
                  >
                  <Text style={styles.itemMoreText}>
                    {origin.author}
                  </Text>
                  <Text style={styles.itemMoreText}>
                    {finalURL}
                  </Text>
                </View>
                {finalDuration !== '' && (
                  <View {...this._panResponderStop.panHandlers}>
                    <Text style={styles.itemMoreTextTime}>
                      <Icon name="clock-o" style={styles.crumbIcon}/>
                      <Text>&nbsp;</Text>
                      <Text numberOfLines={1} style={styles.itemTime}>
                        {finalDuration.trim()}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

    )
  }
}

export default Insight
