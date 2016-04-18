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

  state = {
    buttonOpacity: new Animated.Value(0)
  }

  constructor (props) {
    super(props)
    this._navigatorReplace = this._navigatorReplace.bind(this);
  }


  componentDidMount () {
    Animated.timing(this.state.buttonOpacity, {
      duration: 1000,
      toValue: 1
    }).start()
  }

  _navigatorReplace () {
    this.props.navigator.replace({
      scene: 'welcome',
      title: 'Virtual Mentor'
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
  initialVariables: {
    count: 100,
    filter: 'ALL'
  },
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            topics(first: $count, filter: DEFAULT) {
                edges {
                    node {
                        name
                    }
                }
            }
            collections(first: $count) {
                edges {
                    node {
                        id
                        insights(first : $count, filter : $filter) {
                            count
                            usefulCount
                            uselessCount
                            edges {
                                node {
                                    id
                                    content
                                }
                            }
                        }
                    }
                }
            }
        }
    `
  }
});

