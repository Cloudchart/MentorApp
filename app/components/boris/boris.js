import React, {
    Animated,
    Component,
    Image,
    StyleSheet,
    Text,
    View
} from "react-native";
import { AnimateSequences } from "../../components";
import { ANGRY_TOANGRY, NEUTRAL_TALK } from './sequences-big';
import { NEUTRAL_TALK_MINI, ANGRY_TOANGRY_MINI } from './sequences-mini';
import * as device from "../../utils/device";
import styles from "./style";

const containerStyle = {
  big: styles.containerBig,
  small: styles.containerSmall
}

const faceContainerStyle = {
  big: styles.faceContainerBig,
  small: styles.faceContainerSmall
}

const AnimateImagesStyle = {
  big: { width: device.size(200), height: device.size(200) },
  small: { height: device.size(70), width: device.size(70) }
}

const noteContainerStyle = {
  negative: styles.noteContainerNegative,
  positive: styles.noteContainerPositive
}

const noteTextStyle = {
  negative: styles.noteTextNegative,
  positive: styles.noteTextPositive
}

const handleImageStyle = {
  big: styles.handleImageBig,
  small: styles.handleImageSmall
}


const Faces = {
  negative: {
    big: require('../../images/boris/big-negative.png'),
    small: require('../../images/boris/small-negative.png'),
  },
  positive: {
    big: require('../../images/boris/big-positive.png'),
    small: require('../../images/boris/small-positive.png'),
  },
}

const Handles = {
  negative: {
    big: require('../../images/boris/handle-negative-top.png'),
    small: require('../../images/boris/handle-negative-side.png'),
  },
  positive: {
    big: require('../../images/boris/handle-positive-top.png'),
    small: require('../../images/boris/handle-positive-side.png'),
  }
}


class Boris extends Component {
  static propTypes = {
    mood: React.PropTypes.oneOf([ 'positive', 'negative' ]).isRequired,
    size: React.PropTypes.oneOf([ 'big', 'small' ]).isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
      noteOpacity: new Animated.Value(this.props.animate === true ? 0 : 1),
      interval: null,
      repeatCount: 1
    }
  }


  componentDidMount () {
    Animated.timing(this.state.noteOpacity, {
      duration: 1000,
      toValue: 1
    }).start()

  }

  componentWillUnmount () {
    
  }


  /**
   *
   * @param moodSequences
   */
  getMoodSequences (moodSequences) {
    switch ( moodSequences ) {
      case 'NEUTRAL_TALK_MINI':
        return NEUTRAL_TALK_MINI;
        break;
      case 'ANGRY_TOANGRY_MINI':
        return ANGRY_TOANGRY_MINI;
        break;
      case 'ANGRY_TOANGRY':
        return ANGRY_TOANGRY;
        break;
      case 'NEUTRAL_TALK':
        return NEUTRAL_TALK;
        break;
      default:
        return NEUTRAL_TALK;
    }
  }


  render () {
    const { mood, size, note, style, repeatCount, moodSequences } = this.props;
    const styleNote = [ styles.noteContainer, noteContainerStyle[ mood ], { opacity: this.state.noteOpacity } ]

    return (
        <View style={ [styles.container, containerStyle[size], style] }>
          <View style={ [styles.faceContainer, faceContainerStyle[size]] }>
            <AnimateSequences
                style={AnimateImagesStyle[size]}
                resizeMode='stretch'
                animationRepeatCount={repeatCount || this.state.repeatCount}
                animationDuration={32}
                moodSequences={moodSequences}
                animationImages={this.getMoodSequences(moodSequences)}/>
          </View>
          {!note ? null :
              <Animated.View style={ styleNote }>
                <Text style={ [styles.noteText, noteTextStyle[mood]] }>{note}</Text>
                <Image
                    source={ Handles[mood][size] }
                    style={ [styles.handleImage, handleImageStyle[size]] }/>
              </Animated.View>
          }
        </View>
    )
  }
}


export default Boris
