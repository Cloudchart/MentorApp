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
    const { navigator, route, collection } = this.props;

    if ( collection.insights.uselessCount ) {
      let routeParams = {
        scene: 'insights_useless',
        title: route.title,
        collectionId: collection.id,
        showBadAdvice: true
      }
      if ( !route.showBadAdvice ) {
        navigator.push({ ...routeParams });
      }
    }
  }

  render () {
    const { insights } = this.props.collection;
    const { route } = this.props;
    let uselessCount = 0;
    if ( insights ) {
      uselessCount = insights.uselessCount;
    }


    return (!uselessCount || route.showBadAdvice ? null :
        <TouchableOpacity
          style={styles.crumbIconWrapper}
          activeOpacity={ 0.75 }
          onPress={this._showBadAdvice}>
          <Icon name="trash" style={styles.crumbIconBasket}/>
          <Text>&nbsp;</Text>
          <Text style={styles.crumbIconBasketText}>{uselessCount}</Text>
        </TouchableOpacity>
    )
  }
}


export default connect(state => ({
  collection: state.collections.currentCollection
}))(Trash)
