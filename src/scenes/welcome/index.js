import React, {
  Animated,
  Component,
  StyleSheet,
  View
} from "react-native";
import { Boris, Button } from "../../components";
import Relay, { RootContainer } from 'react-relay';
import styles from "./style";


class Welcome extends Component {

  static propTypes = {
    onForward: React.PropTypes.func
  };

  state = {
    buttonOpacity: new Animated.Value(0)
  }

  constructor (props) {
    super(props)
    this._navigatorReplace = this._navigatorReplace.bind(this)
  }


  componentDidMount () {
    Animated.timing(this.state.buttonOpacity, {
      duration: 1000,
      toValue: 1
    }).start()
  }

  _navigatorReplace (evt) {
    const { navigator } = this.props;
    let data = { scene: 'connect', title: 'Connect to start' };

    navigator.push({
      scene: data.scene,
      title: data.title || '',
      advice: data.advice || null,
      sceneConfig: data.conf || null
    })
  }

  _sendNotification () {
    require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
      aps: {
        alert: 'Sample notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      }
    });
  }

  render () {
    const { buttonOpacity } = this.state;
    const styleButton = [ styles.continue, { opacity: buttonOpacity } ]
    return (
      <View style={ styles.container }>
        <Boris
          mood="positive"
          size="big"
          note="Hello, meatb... master! I am Boris, and I will guide you from zero to one, as Master Thiel said."
          style={ styles.boris }
        />

        <Animated.View style={styleButton}>
          <Button
            label="Continue"
            onPress={this._navigatorReplace}
            color="blue"
          />
        </Animated.View>
      </View>
    )
  }
}


export default Relay.createContainer(Welcome, {
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            id
            name
            topics(first: 100, filter: DEFAULT) {
                edges {
                    node {
                        name
                    }
                }
            }
        }
    `
  }
});

