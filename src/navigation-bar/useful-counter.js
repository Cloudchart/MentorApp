import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Relay from 'react-relay'
import styles from '../styles/base';

const UsefulCounter = ({ navigator, viewer }) => {
  const handlePress = () => {
    navigator.push({
      scene: 'user-collections',
      title: 'Saved advices',
      add: 'no',
    })
  }
  const count = viewer.collections.edges.reduce((memo, edge) => {
      return memo + edge.node.insights.usefulCount
    }, 0)
  if (count === 0) {
    return (
      <View />
    )
  }
  return (
    <TouchableOpacity
      style={[styles.crumbIconWrapperGreen, {bottom : 1}]}
      activeOpacity={0.75}
      onPress={() => handlePress()}
      >
      <Text style={styles.crumbIconBasketText}>{count}</Text>
    </TouchableOpacity>
  )
}

export default Relay.createContainer(UsefulCounter, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        collections(first: 100) {
          edges {
            node {
              insights {
                usefulCount
              }
            }
          }
        }
      }
    `
  }
})
