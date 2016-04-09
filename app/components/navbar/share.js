import React, {
    Component,
    Image,
    LayoutAnimation,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Linking,
    AlertIOS
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Clipboard from "react-native-clipboard";
import stylesBase from "../../styles/base";
import styles from "./style";
import * as device from "../../utils/device";
const dimensions = Dimensions.get('window');

class Share extends Component {
  constructor (props) {
    super(props)
    this.state = {
      popoverShow: false
    }

    this._showPopover = this._showPopover.bind(this);
    this._copyLink = this._copyLink.bind(this);
    this._openUrlInSafari = this._openUrlInSafari.bind(this)
  }

  _showPopover () {
    this.setState({ popoverShow: this.state.popoverShow ? false : true })
  }

  _openUrlInSafari () {
    Linking.openURL(this.props.url).then(()=> {
      this._showPopover();
    })
  }

  _copyLink () {
    Clipboard.set(this.props.url)
    this._showPopover();
  }

  render () {
    const { popoverShow } = this.state;
    return (
        <View style={styles.popoverWrapper}>
          <TouchableOpacity
              activeOpacity={ 0.75 }
              style={stylesBase.crumbIconPlaceholder}
              onPress={this._showPopover}>
            <Icon name="share" style={[stylesBase.crumbIcon]}/>
          </TouchableOpacity>

          {!popoverShow ? null :
              <View style={[styles.popover, {width : device.size(dimensions.width - 20)}]}>
                <TouchableOpacity
                    activeOpacity={0.50}
                    style={ styles.itemTextWrapper }
                    onPress={this._copyLink}>
                  <Text style={styles.itemText}>Copy Link</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.50}
                    style={ styles.itemTextWrapper }
                    onPress={this._openUrlInSafari}>
                  <Text style={styles.itemText}>Open in Safari</Text>
                </TouchableOpacity>
              </View>
          }
        </View>
    )
  }
}

export default Share;
