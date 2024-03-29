import React, {
  Component,
  AsyncStorage,
  View,
  Text,
} from 'react-native'
import Relay from 'react-relay'
import { Boris, Button, TransparentButton, FBLoginButton } from '../../components'
import { APPLICATION__IS_FIRST_LAUNCH } from '../../storage'
import styles from './style'

const BORIS_PROMPT_MESSAGE =
  'Let\'s connect your profile so I can track your progress and mentor you properly!'
const BORIS_ERRORS_MESSAGE =
  'Something went wrong. Please correct the problem and try again.';

class ConnectScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      hasFacebookErrors: false,
    }
  }

  handleFacebookLogin() {
    setTimeout(() => {
      this.setState({
        hasFacebookErrors: false,
      })
      this.handleNextPress()
    }, 0)
  }

  handleFacebookError() {
    setTimeout(() => {
      this.setState({
        hasFacebookErrors: true,
      })
    }, 500)
  }

  handleFacebookCancel() {
    setTimeout(() => {
      this.setState({
        hasFacebookErrors: true,
      })
    }, 500)
  }

  handleFacebookPermissionsMissing(data) {
    // nothing
  }

  handleNextPress() {
    const { navigator, viewer } = this.props
    const { questions, topics } = viewer
    AsyncStorage.setItem(APPLICATION__IS_FIRST_LAUNCH, 'false', () => {
      if (questions.edges.length === 0) {
        const { availableSlotsCount, edges } = topics
        const upToCount = availableSlotsCount + edges.length
        console.log({
          availableSlotsCount,
          topicsCount: edges.length,
        })
        navigator.push({
          scene: 'select_topics',
          title: `Select up to ${upToCount} topics to start:`,
          isFirstLaunch: true,
        })
      } else {
        navigator.push({
          scene: 'questionnaire',
          title: '',
          isFirstLaunch: true,
        })
      }
    })
  }

  render() {
    const { viewer } = this.props
    const { hasFacebookErrors } = this.state
    const note =
      hasFacebookErrors ?
        BORIS_ERRORS_MESSAGE :
        BORIS_PROMPT_MESSAGE
    const mood = hasFacebookErrors ? 'negative' : 'positive'
    const moodSequences = hasFacebookErrors ? 'ANGRY_TOANGRY' : 'NEUTRAL_TALK'
    return (
      <View style={styles.container}>
        <Boris
          mood={mood}
          moodSequences={moodSequences}
          size="big"
          note={note}
          style={styles.boris}
        />
        <View style={styles.containerButtons}>
          <FBLoginButton
            viewer={viewer}
            onLogin={() => this.handleFacebookLogin()}
            onError={() => this.handleFacebookError()}
            onCancel={() => this.handleFacebookCancel()}
            onPermissionsMissing={this.handleFacebookPermissionsMissing()}
          />
          <TransparentButton
            label="Skip"
            onPress={() => this.handleNextPress()}
            color="blue"
            style={styles.skipButtonStyle}
          />
        </View>
      </View>
    )
  }
}

export default Relay.createContainer(ConnectScene, {
  initialVariables: {
    filter: 'UNANSWERED',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        email
        topics(first: 100, filter: SUBSCRIBED) {
          availableSlotsCount
          edges {
            node {
              id
            }
          }
        }
        questions(first: 1, filter: $filter) {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
  },
})
