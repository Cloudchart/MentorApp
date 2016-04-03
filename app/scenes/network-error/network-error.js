import React, {
  Animated,
  Component,
  StyleSheet,
  View,
  Linking,
  AppState,
  NetInfo
} from "react-native";
import { Boris, Button } from "../../components";
import { checkNET } from '../../system';
import { EventManager } from '../../event_manager';
import styles from "./style";


class NetError extends Component {

  static propTypes = {
    onForward: React.PropTypes.func
  };

  constructor (props) {
    super(props)
    this.state = {
      buttonOpacity: new Animated.Value(0)
    }

    this._appStateChange = this._appStateChange.bind(this)
    this._netChange = this._netChange.bind(this)
    AppState.addEventListener('change', this._appStateChange)
    NetInfo.addEventListener('change', this._netChange);
  }

  componentDidMount () {
    Animated.timing(this.state.buttonOpacity, {
      duration: 1000,
      toValue: 1
    }).start()
  }

  componentWillUnmount () {
    NetInfo.removeEventListener('change', this._netChange);
    AppState.removeEventListener('change', this._appStateChange)
  }

  _netChange (reach) {
    if ( reach != 'none' ) {
      EventManager.emit('enable:network')
    }
  }

  _appStateChange (currentAppState) {
    if ( currentAppState == 'active' ) {
      checkNET().then((data) => {
        this._netChange(data)
      })
    }
  }

  handleClick () {
    Linking.openURL('app-settings:root');
  }

  render () {
    const { buttonOpacity } = this.state;
    const styleButton = [ styles.continue, { opacity: buttonOpacity } ]
    return (
      <View style={ styles.container }>
        <Boris
          mood="negative"
          size="big"
          note="Something went wrong with Internet connection. Please fix the problem and try again."
          style={ styles.boris }
        />

        <Animated.View style={styleButton}>
          <Button
            label="Enable network ?"
            onPress={this.handleClick}
            color="blue"
          />
        </Animated.View>
      </View>
    )
  }
}


export default NetError;
