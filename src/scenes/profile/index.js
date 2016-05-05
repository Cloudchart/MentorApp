import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  AlertIOS,
} from 'react-native'
import Relay from 'react-relay'
import { Boris, Button, TransparentButton } from '../../components'
import Icon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import { FBSDKGraphRequest, FBSDKAccessToken } from 'react-native-fbsdkcore'
import { FBSDKLoginManager } from 'react-native-fbsdklogin'
import { loginAndGetDataFromFB } from '../../actions/user'
import styles from './style'
import baseStyles from '../../styles/base'

const BORIS_NOTE_SUBSCRIBED =
  'This is your profile. You can manage your newsletter subscription below, Master.'
const BORIS_NOTE_LETS_CONNECT =
  'Let\s connect with your Facebook profile, Master.'

const getBorisNoteForProfile = ({ email }) => (
  `My sensors detected your email: ${email}, Master. ` +
  'Would you like me to send you some pleasantly rare emails?'
)

class ProfileScene extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      email: props.viewer.email,
      isSubscribed: props.viewer.isSubscribed || false,
    }
    if (!this.state.email) {
      this._tryToLogin()
    }
  }

  _tryToLogin() {
    loginAndGetDataFromFB()
      .then(({ email }) => {
        this.setState({ email })
      })
      .catch(error => {
        if (error.isCancelled) {
          this.props.navigator.pop()
        } else {
          AlertIOS.alert(
            'Connect',
            'Failed to connect with your Facebook account.'
          )
        }
      })
  }

  handleSubscribePress() {
    // request mutation
    this.setState({
      isSubscribed: true,
    })
  }

  handleUnsubscribePress() {
    // request mutation
    this.setState({
      isSubscribed: false,
    })
  }

  render() {
    const { viewer } = this.props
    const { email, isSubscribed } = this.state
    if (isSubscribed) {
      return (
        <AlreadySubscribed
          borisText={BORIS_NOTE_SUBSCRIBED}
          onPress={() => this.handleUnsubscribePress()}
          />
      )
    }
    if (!email) {
      return (
        <View style={styles.container}>
          <View style={styles.borisContainer}>
            <Boris
              mood="positive"
              size="small"
              note={BORIS_NOTE_LETS_CONNECT}
              />
          </View>
        </View>
      )
    }
    const note = getBorisNoteForProfile({ email })
    return (
      <View style={styles.container}>
        <View style={styles.borisContainer}>
          <Boris
            mood="positive"
            size="small"
            note={note}
            />
        </View>
        <Button
          label=""
          color="green"
          onPress={() => this.handleSubscribePress()}
          style={styles.button}
          >
          <Text style={styles.buttonText}>
            Subscribe to Newsletter
          </Text>
        </Button>
      </View>
    )
  }
}

const AlreadySubscribed = ({ borisText, onPress }) => (
  <View style={styles.container}>
    <View style={styles.borisContainer}>
      <Boris
        mood="positive"
        size="small"
        note={borisText}
        />
    </View>
    <Button
      label=""
      color="green"
      onPress={onPress}
      style={styles.button}>
      <View style={styles.buttonInner}>
        <Text style={styles.buttonText}>
          Subscribed to newsletter
        </Text>
        <Icon name="check" style={[baseStyles.crumbIconAngle, styles.selectedIcon]}/>
      </View>
    </Button>
  </View>
)

export default Relay.createContainer(ProfileScene, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        name
        email
        isActive
      }
    `
  }
});

