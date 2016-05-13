import React, {
  Image,
  View,
  TouchableWithoutFeedback,
} from 'react-native'
import * as device from '../utils/device'
import styles from '../styles/base'

export default function NavLogo({ navigator }) {
  const handlePress = () => {
    navigator.push({
      scene: 'random_advice',
      FloatFromLeft: true,
    })
  }
  return (
    <View style={styles.crumbIconPlaceholder}>
      <TouchableWithoutFeedback onPress={() => handlePress()}>
        <Image
          style={{ width : device.size(30), height: device.size(30) }}
          source={require('image!navbar_logo')}
          />
      </TouchableWithoutFeedback>
    </View>
  )
}

