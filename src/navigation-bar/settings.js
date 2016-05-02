import React, {
  Component,
  Image,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import { ACTION_SHOW_RANDOM_ADVICE } from "../actions/actions";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/base";

export default ({ navigator }) => {
  const handlePress = () => {
    navigator.push({
      scene: 'settings',
      title: 'Settings',
      FloatFromBottom: true
    })
  }
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.crumbIconPlaceholder}
      onPress={() => handlePress()}
      >
      <Icon name="cog" style={styles.crumbIconSettings}/>
    </TouchableOpacity>
  )
}

