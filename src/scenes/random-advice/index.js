import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import Relay from 'react-relay'
import _ from 'lodash'
import { Boris, Button } from '../../components/index'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../../styles/base'
import { commentStyle, allForNowStyle, topicFinished } from './styles'

class RandomAdviceScene extends Component {
  constructor(props, context) {
    super(props, context)
    const { viewer } = props
    let reaction = null
    if (viewer.reactions.edges.length > 0) {
      reaction = _.chain(viewer.reactions.edges)
        .map(edge => edge.node)
        .shuffle()
        .filter(node => node.content != (reaction && reaction.content))
        .sample()
        .value()
    }
    this.state = {
      reaction,
    }
  }

  handleGotItPress() {
    const { navigator } = this.props
    navigator.pop()
  }

  render() {
    const { reaction } = this.state
    let { mood, content } = reaction || {}
    if (!mood && !content) {
      mood = 'negative';
      content = 'error';
    }
    return (
      <View style={commentStyle.container}>
        <View style={commentStyle.borisContainer}>
          <Boris
            mood={mood}
            notAnimate={true}
            size="small"
            note={content}
            randomId={(Math.random(1000) * 100).toString(16)}
            />
        </View>
        <Button
          label=""
          color="green"
          onPress={() => this.handleGotItPress()}
          style={commentStyle.button}
          >
          <Text style={commentStyle.buttonText}>
            Got it
          </Text>
        </Button>
      </View>
    )
  }
}

export default Relay.createContainer(RandomAdviceScene, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        reactions(first: 100, scope: "clicker") {
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
})
