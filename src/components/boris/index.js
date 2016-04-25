import React, {
  Animated,
  Component,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import { AnimateSequences } from "../../components";
import { ANGRY_TOANGRY, NEUTRAL_TALK, EXCITED_TALK } from './sequences-big';
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
    big: require('image!big-negative'),
    small: require('image!small-negative')
  },
  positive: {
    big: require('image!big-positive'),
    small: require('image!small-positive')
  }
};

const Handles = {
  negative: {
    big: require('image!handle-negative-top'),
    small: require('image!handle-negative-side')
  },
  positive: {
    big: require('image!handle-positive-top'),
    small: require('image!handle-positive-side')
  }
}


class Boris extends Component {

  static propTypes = {
    mood: React.PropTypes.oneOf([ 'positive', 'negative' ]).isRequired,
    size: React.PropTypes.oneOf([ 'big', 'small' ]).isRequired
  }

  state = {
    noteOpacity: new Animated.Value(this.props.animate === true ? 0 : 1),
    interval: null,
    repeatCount: 1
  }

  constructor (props) {
    super(props)

    this.getMoodSequences = this.getMoodSequences.bind(this);
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
      case 'EXCITED_TALK':
        return EXCITED_TALK;
        break;
      default:
        return NEUTRAL_TALK;
    }
  }


  render () {
    const { mood, size, note, style, repeatCount, moodSequences, randomId } = this.props;
    const styleNote = [ styles.noteContainer, noteContainerStyle[ mood ], { opacity: this.state.noteOpacity } ]

    return (
      <View style={ [styles.container, containerStyle[size], style] }>
        <View style={ [styles.faceContainer, faceContainerStyle[size]] }>
          <BorisImage
            {...this.props}
            randomId={randomId || 1}
            moodSequences={moodSequences}
            getMoodSequences={this.getMoodSequences}
            repeatCount={repeatCount || this.state.repeatCount}
          />
        </View>
        {!note ? null :
          <Animated.View style={ styleNote }>
            <Text style={ [styles.noteText, noteTextStyle[mood]] }>
              {note}
            </Text>
            <Image
              source={ Handles[mood][size] }
              style={ [styles.handleImage, handleImageStyle[size]] }/>
          </Animated.View>
        }
      </View>
    )
  }
}

const BorisImage = (props) => {
  const { notAnimate, moodSequences, mood, size, repeatCount, getMoodSequences, randomId } = props;
  return (notAnimate ?
      <Image source={ Faces[mood][size] } key={randomId}/> :
      <AnimateSequences
        style={AnimateImagesStyle[size]}
        resizeMode='stretch'
        animationRepeatCount={repeatCount}
        animationDuration={32}
        moodSequences={moodSequences}
        animationImages={getMoodSequences(moodSequences)}/>
  )
}

export default Boris
