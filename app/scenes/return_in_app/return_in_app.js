import React, {
    Animated,
    Component,
    StyleSheet,
    View
} from "react-native";
import Relay from 'react-relay';
import { Boris, Button } from "../../components";
import styles from "./style";


class ReturnInApp extends Component {

  static propTypes = {
    onForward: React.PropTypes.func,
    appState: React.PropTypes.string
  };


  constructor (props) {
    super(props)

    this.state = {
      buttonOpacity: new Animated.Value(0)
    }
  }


  componentDidMount () {
    Animated.timing(this.state.buttonOpacity, {
      duration: 1000,
      toValue: 1
    }).start()
  }

  _navigatorReplace (navigator = this.props) {
    let data = { scene: 'welcome', title: 'Virtual Mentor' }
    navigator.push({
      scene: data.scene,
      title: data.title || '',
      advice: data.advice || null,
      sceneConfig: data.conf || null
    })
  }


  render () {
    const { buttonOpacity } = this.state;
    const styleButton = [ styles.continue, { opacity: buttonOpacity } ]
    return (
        <View style={ styles.container }>
          <Boris
              mood="positive"
              size="big"
              note="Hello, Master. How about you learn well today ?"
              animate={ true }
              style={ styles.boris }
          />

          <Animated.View style={styleButton}>
            <Button
                label="Let's go!"
                onPress={this._navigatorReplace}
                color="blue"
            />
          </Animated.View>
        </View>
    )
  }
}

export default Relay.createContainer(ReturnInApp, {
  fragments: {
    viewer: () => Relay.QL`     
      fragment on User {       
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

