import React, {
    Component,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";
import baseStyle from "../../styles/base";
import styles from "./style";

/**
 *
 * @returns {XML}
 * @constructor
 */
export const AddCard = (props) => {
  return (
      <LinearGradient colors={['#00aced', '#1cb8f6']} style={ {flex : 1} }>
        <TouchableOpacity
            activeOpacity={ 0.75 }
            style={styles.controlShare}>
          <Icon name="folder-open-o" style={[baseStyle.crumbIcon, {color : '#fff'}]}/>
          <Text style={ styles.controlShareText }>
            Add to collection
          </Text>
        </TouchableOpacity>
      </LinearGradient>
  )
}

/**
 *
 * @param props
 * @constructor
 */
export const ShareCard = (props) => (
    <LinearGradient colors={['#00aced', '#1cb8f6']} style={ {flex : 1} }>
      <TouchableOpacity
          activeOpacity={ 0.75 }
          style={[styles.controlShare]}
          onPress={props.onShare}>
        <Icon name="share" style={[baseStyle.crumbIcon, {color : '#fff'}]}/>
        <Text style={ styles.controlShareText }>
          Share
        </Text>
      </TouchableOpacity>
    </LinearGradient>
)
