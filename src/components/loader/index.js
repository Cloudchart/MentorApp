import React from 'react'
import { View } from 'react-native'
import Progress from 'react-native-progress'
import styles from './style'

export function LoaderMini() {
  return (
    <View style={styles.loaderMini} />
  )
}

export default function Loader() {
  return (
    <View style={styles.loader}>
      <Progress.Circle size={60} indeterminate={true}/>
    </View>
  )
}
