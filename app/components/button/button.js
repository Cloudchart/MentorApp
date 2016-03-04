import React, { Component, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import styles, { Colors } from "./style";

class Button extends Component {

  render () {
    const { label, color, style, onPress } = this.props;
    return (
        <TouchableOpacity
            onPress={ onPress }
            activeOpacity={ 0.75 }
            style={ [styles.button, { backgroundColor: Colors[color] || 'transparent' }, style] }>

          {!label || !label.length ? null :
              <Text style={ styles.buttonText }>
                { label }
              </Text>}

          <View>
            {this.props.children}
          </View>
        </TouchableOpacity>
    )
  }

}

Button.propTypes = {
  label: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func
};


export default Button
