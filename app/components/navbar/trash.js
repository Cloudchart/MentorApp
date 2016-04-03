import React, {
    Component,
    Image,
    LayoutAnimation,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../../styles/base";


class Trash extends Component {

  constructor (props) {
    super(props)
    this._showBadAdvice = this._showBadAdvice.bind(this);
  }

  _showBadAdvice () {
    const { navigator, route, collections } = this.props;
    const {currentCollectionAdvicesBad} = collections;
    const bad = currentCollectionAdvicesBad;

    if ( bad && bad.advicesBad && bad.advicesBad.length ) {
      navigator.push({
        scene: 'topic_detail',
        title: route.title,
        showBadAdvice: true
      })
    }
  }

  render () {
    let count = 0
    const {currentCollectionAdvicesBad} = this.props.collections;

    if ( currentCollectionAdvicesBad && currentCollectionAdvicesBad.advicesBad ) {
      count = currentCollectionAdvicesBad.advicesBad.length
    }

    return (
        <TouchableOpacity
            style={styles.crumbIconWrapper}
            activeOpacity={ 0.75 }
            onPress={this._showBadAdvice}>
          <Icon name="trash" style={styles.crumbIconBasket}/>
          <Text>&nbsp;</Text>
          <Text style={styles.crumbIconBasketText}>{count}</Text>
        </TouchableOpacity>
    )
  }
}


export default connect(state => ({
  collections: state.collections
}))(Trash)