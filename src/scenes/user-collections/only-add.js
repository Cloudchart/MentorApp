import React, {
  Component,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Relay from 'react-relay'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './style'
import baseStyles from '../../styles/base'

const OnlyAdd = ({ collection, pressRow }) => {
  const { insights } = collection
  return (
    <TouchableOpacity
      style={styles.collectionItem}
      activeOpacity={0.75}
      onPress={pressRow}
      >
      <View style={styles.collectionItemInner}>
        <Icon name="folder-open-o" style={[baseStyles.crumbIcon, {color : '#00af58'}]}/>
        <Text style={styles.collectionText} numberOfLines={1}>
          {collection.name}
        </Text>
        <Text style={styles.collectionCounterText}>
          {!insights.count ? 0 : insights.count}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default Relay.createContainer(OnlyAdd, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
})
