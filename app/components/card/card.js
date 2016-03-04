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
import { Presets } from "../../utils/animation";
import styles from "./style";


class Card extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rowHeight: 0,
      visibility: 0,
      isOpen: false
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!
        const { openWebView } = this.props;
        if ( openWebView ) {
          openWebView(this.props)
        }
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
    const { id, title, topic_name, name, text, styleText } = this.props;
    const { visibility } = this.state;

    return (
        <TouchableOpacity
            activeOpacity={ 0.75 }
            style={styles.item}
            onPress={this._onPressCard}
            delayLongPress={2000}
            delayPressIn={500}
            onLongPress={()=>{  }}
            onPressIn={()=>{ this.props.onPressIn && this.props.onPressIn(this.props) }}>
          <View style={ styles.itemInner }>
            <Text style={[styles.itemText, styleText]}>
              {text}
            </Text>
          </View>

          <View style={[styles.itemMore, this.getStyle()]}
              {...this._panResponder.panHandlers}>
            {!visibility ? null :
                <View style={styles.itemMoreInner}>
                  <Text style={ styles.itemMoreText }>
                    Brain Chesky on Twitter
                  </Text>
                  <Text style={ styles.itemMoreText }>
                    twitter.com
                  </Text>
                  <Text style={ styles.itemMoreTextTime }>
                    <Icon name="clock-o" style={styles.crumbIcon}/>
                    <Text>&nbsp;</Text>
                    <Text style={ styles.itemTime }>10 sec</Text>
                  </Text>
                </View> }
          </View>
        </TouchableOpacity>

    )
  }
}


export default Card;