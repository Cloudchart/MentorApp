import React, {
  Component,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import styles, { Colors } from "./style";

class TransparentButton extends Component {

  static defaultProps = {
    color: 'blue'
  }

  static propTypes = {
    label: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func
  }

  render () {
    const textStyle = [ styles.buttonLabel, { color: Colors[ this.props.color ] || 'white' }, this.props.style ];
    return (
      <View style={ styles.transparent }>
        <TouchableOpacity onPress={ this.props.onPress } activeOpacity={ 0.75 }>
          <Text style={ textStyle }>
            { this.props.label }
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default TransparentButton
