import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import Relay from 'react-relay'
import _ from 'lodash'
import { Boris, Button, TransparentButton } from '../index'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../../styles/base'
import { commentStyle, allForNowStyle, topicFinished } from './styles'

class RandomAdviceScene extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      reactions: {
        mood: 'positive',
        content: '',
      }
    }
  }

  handleGotItPress() {
    const { navigator } = this.props
    navigator.push({
      scene: 'insights',
      filter: 'UNRATED'
    })
  }

  getRandomReaction(edges) {
    const { reactions } = this.state
    return _.chain(edges)
      .map(n => n.node)
      .shuffle()
      .filter(n => n.content != reactions.content)
      .sample()
      .value()
  }

  render() {
    const { viewer } = this.props;
    const { reactions } = this.state;
    let mood = reactions.mood;
    let note = reactions.content;

    if (!viewer.reactions.edges.length) {
      mood = 'negative';
      note = 'error';
    } else {
      this.state.reactions = this.getRandomReaction(viewer.reactions.edges);
      mood = this.state.reactions.mood;
      note = this.state.reactions.content;
    }

    return (
      <View style={ commentStyle.container }>
        <View style={ commentStyle.borisContainer }>
          <Boris
            mood={mood}
            notAnimate={true}
            size="small"
            note={note}
            randomId={(Math.random(1000) * 100).toString(16)}/>
        </View>

        <Button
          label=""
          color="green"
          onPress={() => this.handleGotItPress()}
          style={ commentStyle.button }>
          <Text style={ commentStyle.buttonText }>Got it</Text>
        </Button>
      </View>
    )
  }
}

export default Relay.createContainer(RandomAdviceScene, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        reactions(first : 100, scope: "clicker") {
          edges {
            node {
              mood
              content
              weight
            }
          }
        }
      }
    `
  }
});
