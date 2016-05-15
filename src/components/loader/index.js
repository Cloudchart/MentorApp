import React from 'react'
import { View } from 'react-native'
import Progress from 'react-native-progress'
import styles from './styles'

export function LoaderMini() {
  return (
    <View style={styles.loaderMini} />
  )
}

export default function Loader({ style }) {
  return (
    <View style={[styles.loader, style]}>
      <Progress.Circle size={60} indeterminate={true}/>
    </View>
  )
}
