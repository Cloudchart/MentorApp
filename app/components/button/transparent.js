import React, {
    Component,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import styles, { Colors } from "./style";

class TransparentButton extends Component {

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

TransparentButton.defaultProps = {
  color: 'blue'
};

TransparentButton.propTypes = {
  label: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func
};

export default TransparentButton
