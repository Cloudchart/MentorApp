import React, {
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles/base'

export default ({ navigator }) => {
  const handlePress = () => {
    navigator.push({
      scene: 'settings',
      title: 'Settings',
      FloatFromBottom: true,
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

