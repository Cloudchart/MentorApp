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


class TrashCounter extends Component {

  constructor (props) {
    super(props)
    this._showBadAdvice = this._showBadAdvice.bind(this);
  }

  _showBadAdvice () {
    const { navigator, route, node } = this.props
    const { insights } = node
    if (insights) {
      let routeParams = {
        scene: 'insights_useless',
        title: route.title,
        collectionId: node.id,
        showBadAdvice: true,
      }
      if (!route.showBadAdvice) {
        navigator.push({ ...routeParams })
      }
    }
  }

  render () {
    const { route, node } = this.props
    let uselessCount = 0
    if (node && node.insights) {
      uselessCount = node.insights.uselessCount
    }
    return (!uselessCount || route.showBadAdvice ? null :
      <TouchableOpacity
        style={styles.crumbIconWrapper}
        activeOpacity={0.75}
        onPress={this._showBadAdvice}
        >
        <Icon name="trash-o" style={styles.crumbIconBasket}/>
        <Text>&nbsp;</Text>
        <Text style={styles.crumbIconBasketText}>{uselessCount}</Text>
      </TouchableOpacity>
    )
  }
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
  }
})
