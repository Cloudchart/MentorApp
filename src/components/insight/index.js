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
import Filters from '../../utils/filters'
import { Presets } from '../../utils/animation'
import Url from 'url'
import styles from './style'
import clamp from 'clamp'
import * as device from '../../utils/device'
import AutoText from '../../components/auto-text'

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

  state = {
    rowHeight: 0,
    visibility: 0,
    update: 0
  }

  constructor (props) {
    super(props)

    this._openWebView = this._openWebView.bind(this);
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
    });
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
    });
    this._isLayoutAnimationRun = false;
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
      this.props.onCardPress(this.props)
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

  _openWebView () {
    const { insight } = this.props;
    if ( insight && insight.origin && insight.origin.url ) {
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

  calculateContentFontSize (content) {
    const baseContentSize = device.isIphone5() ? 75 : 100;
    const baseFontSize = 34;
    const minFontSize = 14;
    let conf = {};

    if(this.props.fontSize){
      conf.fontSize = device.fontSize(this.props.fontSize);
      conf.lineHeight = device.fontSize(this.props.fontSize * 1.2);
    }

    if (!this.props.fontSize && content.length > baseContentSize ) {
      let ratio = content.length / baseContentSize;
      let percentFontSize = Math.ceil(baseFontSize / ratio);
      percentFontSize = percentFontSize < minFontSize ? minFontSize : percentFontSize;

      if ( content.length > 100 && content.length < 140 ) {
        percentFontSize += 3;
      }

      if ( content.length >= 140 && content.length < 165 ) {
        percentFontSize += 3.8;
      }

      if ( content.length >= 165 && content.length < 200 ) {
        percentFontSize += 3;
      }

      if ( content.length > 200 && content.length < 300 ) {
        percentFontSize += 6;
      }

      if ( content.length >= 300 && content.length < 350 ) {
        percentFontSize += 2;
      }

      if ( content.length >= 350 && content.length < 400 ) {
        percentFontSize += 8;
      }

      if ( content.length > 400 ) {
        percentFontSize += 7;
      }

      conf.fontSize = device.fontSize(percentFontSize);
      conf.lineHeight = device.fontSize(percentFontSize * 1.2)
    }

    return conf;
  }

  render () {
    const { content, origin } = this.props.insight;
    const { visibility } = this.state;

    let url = origin && origin.url ? origin.url : '';
    let parseUrl = '';
    let duration = '';
    if ( isUrl(url) ) {
      parseUrl = Url.parse(url).host;
      parseUrl = parseUrl.indexOf('www') == 0 ?
        parseUrl.substr(4, url.length - 1) :
        parseUrl;
    }

    if ( origin.duration ) {
      const dtn = origin.duration;
      const dm = Math.floor(dtn / 60);
      const dh = Math.floor(dtn / 3600);
      const diffMinute = dm ? dm : null;
      const diffHour = dh ? dh : null;
      const lessMinute = dtn < 60 ? 1 : null;


      if ( lessMinute ) {
        duration = `less than a ${lessMinute} minute`;
      } else if ( diffHour ) {
        duration = `${diffHour} ${Filters.filterPlural(diffHour, [ 'hour', 'hours', 'hours' ])}`;
      } else if ( diffMinute ) {
        duration = `${diffMinute} ${Filters.filterPlural(diffMinute, [ 'minute', 'minutes', 'minutes' ])}`;
      }
    }
    const maxContentHeight = Dimensions.get('window').height - 350
    const baseContentHeight = Dimensions.get('window').height - 500
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={[styles.item, this.props.style]}
        onPress={this._onCardPress}
        >
        <View style={[styles.itemInner]}>
          <AutoText
            style={styles.itemText}
            scalingStyle={{ color: '#aaaaaa' }}
            maxHeight={maxContentHeight}
            initialFontSize={34}
            >
            {content.length ? content.trim() : content}
          </AutoText>
        </View>

        {!origin ? null :
          <View style={[styles.itemMore, this.getStyle()]}>
            {!visibility ? null :
              <View style={styles.itemMoreInner}>
                <View
                  style={{alignSelf: 'flex-start'}} {...this._panResponder.panHandlers}>
                  <Text style={ styles.itemMoreText }>
                    {origin.author}
                  </Text>
                  <Text style={ styles.itemMoreText }>
                    {parseUrl}
                  </Text>
                </View>

                {!origin.duration ? null :
                  <View {...this._panResponderStop.panHandlers}>
                    <Text style={ styles.itemMoreTextTime }>
                      <Icon name="clock-o" style={styles.crumbIcon}/>
                      <Text>&nbsp;</Text>
                      <Text numberOfLines={1} style={ styles.itemTime }>{duration.trim()}</Text>
                    </Text>
                  </View>}
              </View>}
          </View>}
      </TouchableOpacity>

    )
  }
}

function isUrl (url) {
  return Filters.reWeburl.test(url)
}

export default Insight;
