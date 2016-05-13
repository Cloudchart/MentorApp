import React, { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles/base'

export default function Search() {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.crumbIconPlaceholder}
      >
      <Icon name="search" style={styles.crumbIconSearch}/>
    </TouchableOpacity>
  )
}
