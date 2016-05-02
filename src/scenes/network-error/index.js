import React, {
  Animated,
  Component,
  StyleSheet,
  View,
  Linking,
  AppState,
  NetInfo,
} from 'react-native'
import { Boris, Button } from '../../components'
import { checkNET } from '../../system'
import { EventManager } from '../../event-manager'
import styles from './styles'

export default class NetworkError extends Component {
  constructor (props) {
    super(props)
    this._appStateChange = this._appStateChange.bind(this)
    this._netChange = this._netChange.bind(this)

    AppState.addEventListener('change', this._handleAppStateChange)
    NetInfo.addEventListener('change', this._handleNetInfoChange)

    this._buttonOpacity = new Animated.Value(0)
  }

  componentDidMount () {
    Animated.timing(this._buttonOpacity, {
      duration: 1000,
      toValue: 1
    }).start()
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('change', this._handleNetInfoChange)
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleNetInfoChange(reach) {
    // @todo replace to Redux dispatch
    if (reach !== 'none') {
      EventManager.emit('enable:network')
    }
  }

  _handleAppStateChange(state) {
    if (state === 'active') {
      checkNET().then((data) => {
        this._handleAppStateChange(data)
      })
    }
  }

  handleClick() {
    Linking.openURL('app-settings:root')
  }

  render () {
    const { buttonOpacity } = this.state
    const styleButton = [styles.continue, {
      opacity: buttonOpacity
    }]
    return (
      <View style={styles.container}>
        <Boris
          mood='negative'
          size='big'
          note='Something went wrong with Internet connection. Please fix the problem and try again.'
          style={styles.boris}
        />
        <Animated.View style={styleButton}>
          <Button
            label='Enable network?'
            onPress={() => this.handleClick()}
            color='blue'
          />
        </Animated.View>
      </View>
    )
  }
}

