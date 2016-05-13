import React, {
    Component,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Linking,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Clipboard from 'react-native-clipboard'
import stylesBase from '../styles/base'
import styles from './style'
import * as device from '../utils/device'

const dimensions = Dimensions.get('window')

export default class Share extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isPopoverVisible: false,
    }
  }

  handlePopoverPress() {
    this.setState({
      isPopoverVisible: !this.state.isPopoverVisible,
    })
  }

  handleOpenInSafariPress() {
    const { url } = this.props
    Linking.openURL(url).then(() => {
      // The user can go away in this point
      try {
        this.setState({
          isPopoverVisible: false,
        })
      } catch (e) {
        // nothing
      }
    })
  }

  handleCopyLinkPress() {
    Clipboard.set(this.props.url)
    this.setState({
      isPopoverVisible: false,
    })
  }

  render () {
    const { isPopoverVisible } = this.state
    return (
      <View style={styles.popoverWrapper}>
        <TouchableOpacity
            activeOpacity={0.75}
            style={stylesBase.crumbIconPlaceholder}
            onPress={() => this.handlePopoverPress()}>
          <Icon name="share" style={[stylesBase.crumbIcon]}/>
        </TouchableOpacity>
        {isPopoverVisible && (
          <View style={[styles.popover, { width: device.size(dimensions.width - 20) }]}>
            <TouchableOpacity
                activeOpacity={0.50}
                style={styles.itemTextWrapper}
                onPress={() => this.handleCopyLinkPress()}
              >
              <Text style={styles.itemText}>
                Copy Link
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.50}
                style={styles.itemTextWrapper}
                onPress={() => this.handleOpenInSafariPress()}
              >
              <Text style={styles.itemText}>
                Open in Safari
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}
