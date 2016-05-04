import React, {
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Relay from 'react-relay'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles/base'

const TrashCounter = ({ navigator, route, node }) => {
  const handleUselessPress = () => {
    const { insights } = node
    if (insights) {
      const route = {
        scene: 'insights',
        title: route.title,
        collectionId: node.id,
        filter: 'USELESS',
      }
      navigator.push(route)
    }
  }
  let uselessCount = 0
  if (node && node.insights) {
    uselessCount = node.insights.uselessCount
  }
  if (!uselessCount || route.showBadAdvice) {
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
      <Text style={styles.crumbIconBasketText}>{uselessCount}</Text>
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
