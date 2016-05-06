import React, {
  Animated,
  Component,
  StyleSheet,
  View,
} from 'react-native'
import { Boris, Button } from '../../components'
import Relay, { RootContainer } from 'react-relay'
import styles from './style'

const BORIS_NOTE =
  'Hello, meatb... master! I am Boris, and I will guide you from zero to one, ' +
  'as Master Thiel said.'

class WelcomeScene extends Component {
  constructor(props, context) {
    super(props, context)
    this._buttonOpacity = new Animated.Value(0)
  }

  componentDidMount() {
    Animated.timing(this._buttonOpacity, {
      duration: 1000,
      toValue: 1,
    }).start()
  }

  handleConnectPress() {
    this.props.navigator.push({
      scene: 'connect',
      title: 'Connect to start',
    })
  }

  _sendNotification() {
    const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter')
    RCTDeviceEventEmitter.emit('remoteNotificationReceived', {
      aps: {
        alert: 'Sample notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE',
      }
    })
  }

  render() {
    const styleButton = [styles.continue, { opacity: this._buttonOpacity }]
    return (
      <View style={styles.container}>
        <Boris
          mood="positive"
          size="big"
          note={BORIS_NOTE}
          style={styles.boris}
        />
        <Animated.View style={styleButton}>
          <Button
            label="Continue"
            onPress={() => this.handleConnectPress()}
            color="blue"
          />
        </Animated.View>
      </View>
    )
  }
}

export default Relay.createContainer(WelcomeScene, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        reactions(first: 1, scope: "greetings") {
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
  },
})

