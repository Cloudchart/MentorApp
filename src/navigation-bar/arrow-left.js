import React, { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles/base'

export default function ArrowLeft({ back, navigator }) {
  const handlePress = () => {
    if (back) {
      back()
    } else {
      navigator.pop()
    }
  }
  return (
    <TouchableOpacity
      activeOpacity={ 0.75 }
      style={styles.crumbIconPlaceholder}
      onPress={() => handlePress()}
      >
      <Icon name="angle-left" style={styles.crumbIconAngle}/>
    </TouchableOpacity>
  )
}
