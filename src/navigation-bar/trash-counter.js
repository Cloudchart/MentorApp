import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import Relay from 'react-relay'
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles/base";

const TrashCounter = ({ navigator, route, node }) => {
  const handleBadAdvice = () => {
    const { insights } = node
    if (insights) {
      const route = {
        scene: 'insights_useless',
        title: route.title,
        collectionId: node.id,
        showBadAdvice: true,
      }
      if (!route.showBadAdvice) {
        navigator.push(route)
      }
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
      onPress={() => handleBadAdvice()}
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
        insights(first: 100) {
          uselessCount
        }
      }
    `
  },
})
