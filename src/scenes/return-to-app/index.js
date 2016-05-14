import React, {
  Animated,
  Component,
  View,
} from 'react-native'
import Relay from 'react-relay'
import { Boris, Button } from '../../components'
import styles from './style'

class ReturnToAppScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      buttonOpacity: new Animated.Value(0),
    }
  }

  componentDidMount() {
    const { viewer } = this.props
    const { edges } = viewer.greetings
    if (edges.length > 0) {
      Animated.timing(this.state.buttonOpacity, {
        duration: 1000,
        toValue: 1,
      }).start()
    }
  }

  handleNextStepPress() {
    this.props.navigator.replace({
      scene: 'follow-up',
      title: 'Rate used advice',
    })
  }

  render() {
    const { viewer } = this.props
    const { buttonOpacity } = this.state
    const { edges } = viewer.greetings
    if (edges.length === 0) {
      return (
        <Loader />
      )
    }
    const firstNode = edges[0].node
    const buttonStyle = [styles.continue, { opacity: buttonOpacity }]
    return (
      <View style={styles.container}>
        <Boris
          mood={firstNode.mood}
          size="big"
          note={firstNode.content}
          animate={true}
          style={styles.boris}
          />
        <Animated.View style={buttonStyle}>
          <Button
            label="Let's go!"
            onPress={() => this.handleNextStepPress()}
            color="blue"
            />
        </Animated.View>
      </View>
    )
  }
}

const reactionFragment = Relay.QL`
  fragment on BotReaction {
    id
    mood
    content
  }
`;

export default Relay.createContainer(ReturnToAppScene, {
  initialVariables: {
    count: 1,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        greetings: reactions(first: $count, scope: "greetings") {
          edges {
            node {
              ${reactionFragment}
            }
          }
        }
      }
    `,
  },
})

