import React, {
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Relay from 'react-relay'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles/base'

const TrashCounter = ({ navigator, route, node, title, filter }) => {
  const handleUselessPress = () => {
    const scene =
      (filter === 'USEFUL') ?
        'user-insights_useful' :
        'user-insights_useless'
    const route = {
      scene,
      title: title,
      collectionId: node.id,
    }
    navigator.push(route)
  }
  let count
  if (node && node.insights) {
    if (filter === 'USELESS') {
      count = node.insights.uselessCount
    } else {
      count = node.insights.usefulCount
    }
  }
  if (!count) {
    return (
      <View />
    )
  }
  return (
    <TouchableOpacity
      style={styles.crumbIconWrapper}
      activeOpacity={0.75}
      onPress={() => handleUselessPress()}
      >
      <Icon name="trash-o" style={styles.crumbIconBasket}/>
      <Text>&nbsp;</Text>
      <Text style={styles.crumbIconBasketText}>{count}</Text>
    </TouchableOpacity>
  )
}

export default Relay.createContainer(TrashCounter, {
  fragments: {
    node: () => Relay.QL`
      fragment on UserCollection {
        id
        insights(first: 100, filter: ALL) {
          uselessCount
        }
      }
    `
  },
})
