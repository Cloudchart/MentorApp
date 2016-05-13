import React, {
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Relay from 'react-relay'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles/base'

function TrashCounter({ navigator, route, node, title, filter }) {
  const handleUselessPress = () => {
    const route = {
      scene: 'user-insights_useless',
      title: title,
      collectionId: node.id,
    }
    navigator.push(route)
  }
  let count
  if (node && node.insights) {
    count = node.insights.uselessCount
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
      <Text style={styles.crumbIconBasketText}>
        {count}
      </Text>
    </TouchableOpacity>
  )
}

export default Relay.createContainer(TrashCounter, {
  initialVariables: {
    filter: 'USELESS',
  },
  fragments: {
    node: () => Relay.QL`
      fragment on UserCollection {
        id
        insights(first: 100, filter: $filter) {
          uselessCount
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
})
