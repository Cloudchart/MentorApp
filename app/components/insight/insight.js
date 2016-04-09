import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View,
  PanResponder
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Filters from "../../utils/filters";
import { Presets } from "../../utils/animation";
import Url from 'url';
import styles from "./style";


class Insight extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rowHeight: 0,
      visibility: 0,
      isOpen: false
    };

    this._openWebView = this._openWebView.bind(this);

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

    this._onPressCard = this._onPressCard.bind(this)
  }

  /**
   *
   * @param evt
   * @private
   */
  _onPressCard (evt) {

    if ( !this.props.doNotToggle ) {
      this._toggle()
    }
    if ( this.props.onPressCard ) {
      this.props.onPressCard(this.props)
    }
  }

  _toggle () {
    LayoutAnimation.configureNext(Presets.Linear, ()=> {
      this.state.isOpen = (!this.state.isOpen ? true : false)
      this.setState({
        visibility: this.state.isOpen ? 1 : 0
      })
    })

    this.setState({
      rowHeight: this.state.rowHeight > 0 ? 0 : 120,
      visibility: 1
    })
  }


  _openWebView () {
    const { navigator, insight } = this.props;
    if ( insight && insight.origin && insight.origin.url ) {
      navigator.push({
        scene: 'web_view',
        title: '',
        url: insight.origin.url,
        sceneConfig: { hideBar: true }
      })
    }
  }

  /**
   *
   * @returns {{height: number}}
   */
  getStyle () {
    return {
      height: this.state.rowHeight
    };
  }

  render () {
    const { styleText } = this.props;
    const { content, origin } = this.props.insight;
    const { visibility } = this.state;

    return (
      <TouchableOpacity
        activeOpacity={ 0.75 }
        style={styles.item}
        onPress={this._onPressCard}
        delayLongPress={2000}
        delayPressIn={500}
        onLongPress={()=>{  }}
        onPressIn={()=>{ this.props.onPressIn && this.props.onPressIn(this.props.insight) }}>
        <View style={ styles.itemInner }>
          <Text style={[styles.itemText, styleText]}>
            {content.length > 60 ? `${content.substr(0, 60)}...` : content}
          </Text>
        </View>

        {!origin ? null :
          <Origin
            visibility={visibility}
            origin={origin}
            styleOrigin={this.getStyle()}
            _panResponder={this._panResponder}/>}
      </TouchableOpacity>

    )
  }
}

const Origin = (props) => {
  let url = props.origin && props.origin.url ? props.origin.url : '';
  let parseUrl = '';
  if ( isUrl(url) ) {
    parseUrl = Url.parse(url).host;
    parseUrl = parseUrl.indexOf('www') == 0 ?
      parseUrl.substr(4, url.length - 1) :
      parseUrl;
  }

  return (
    <View style={[styles.itemMore, props.styleOrigin]}
      {...props._panResponder.panHandlers}>
      {!props.visibility ? null :
        <View style={styles.itemMoreInner}>
          <Text style={ styles.itemMoreText }>
            {props.origin.author}
          </Text>
          <Text style={ styles.itemMoreText }>
            {parseUrl}
          </Text>
          <Text style={ styles.itemMoreTextTime }>
            <Icon name="clock-o" style={styles.crumbIcon}/>
            <Text>&nbsp;</Text>
            <Text style={ styles.itemTime }>{props.origin.duration} sec</Text>
          </Text>
        </View> }
    </View>
  )
}

function isUrl (url) {
  return Filters.reWeburl.test(url)
}

export default Insight;
