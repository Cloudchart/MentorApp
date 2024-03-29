import React, { View } from 'react-native'
import Boris from '../../components/boris'
import styles from './style'

const BORIS_NOTE_FOR_USEFUL =
  'There\'s nothing here, human. Try adding some useful advices to this collection?'
const BORIS_NOTE_FOR_USELESS =
  'There\'s nothing here, human.'

export default function Empty({ filter }) {
  return (
    <View style={styles.container}>
      <View style={styles.borisContainerCenter}>
        <Boris
          mood="positive"
          size="small"
          note={filter === 'USEFUL' ? BORIS_NOTE_FOR_USEFUL : BORIS_NOTE_FOR_USELESS}
        />
      </View>
    </View>
  )
}
