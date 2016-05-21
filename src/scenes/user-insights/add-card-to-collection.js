import React, {
  Text,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import baseStyle from '../../styles/base'
import styles from './style'

export function AddCard() {
  return (
    <LinearGradient colors={['#00aced', '#1cb8f6']} style={{ flex: 1 }}>
      <View style={styles.controlShare}>
        <Icon name="folder-open-o" style={[baseStyle.crumbIcon, {color : '#fff'}]}/>
        <Text style={styles.controlShareText}>
          Add to collection
        </Text>
      </View>
    </LinearGradient>
  )
}

export function ShareCard() {
  return (
    <LinearGradient colors={['#00aced', '#1cb8f6']} style={{ flex: 1 }}>
      <View style={styles.controlShare}>
        <Icon name="share" style={[baseStyle.crumbIcon, {color : '#fff'}]}/>
        <Text style={ styles.controlShareText }>
          Share
        </Text>
      </View>
    </LinearGradient>
  )
}
