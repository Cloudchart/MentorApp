import React, {
  Component,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import baseStyle from '../../styles/base'
import styles from './styles'

export const AddCard = props => {
  return (
    <LinearGradient colors={['#00aced', '#1cb8f6']} style={{flex : 1}}>
      <View style={styles.controlShare}>
        <Icon name="folder-open-o" style={[baseStyle.crumbIcon, {color : '#fff'}]}/>
        <Text style={styles.controlShareText} numberOfLines={1}>
          Add to collection
        </Text>
      </View>
    </LinearGradient>
  )
}

export const ShareCard = props => (
  <LinearGradient colors={['#00aced', '#1cb8f6']} style={{flex : 1}}>
    <View style={[styles.controlShare]}>
      <Icon name="share" style={[baseStyle.crumbIcon, {color: '#fff'}]}/>
      <Text style={styles.controlShareText} numberOfLines={1}>
        Share
      </Text>
    </View>
  </LinearGradient>
)
