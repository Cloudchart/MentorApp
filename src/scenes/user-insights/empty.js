import React, {
  View
} from 'react-native'
import Boris from '../../components/boris'
import styles from './style'

const BORIS_NOTE = 'There\'s nothing here, human. Try adding some fine advice to this collection?'

export const Empty = () => (
  <View style={styles.container}>
    <View style={styles.borisContainerCenter}>
      <Boris
        mood="positive"
        size="small"
        note={BORIS_NOTE}/>
    </View>
  </View>
)
