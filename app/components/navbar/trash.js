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
import { EventManager } from "../../event_manager";
import { WATCH_COLLECTION } from "../../module_dal/actions/actions";


class Trash extends Component {

  constructor (props) {
    super(props)

    this.state = {
      collection: null
    }

    this._watch = this.watch.bind(this)
    this._showBadAdvice = this._showBadAdvice.bind(this);
    EventManager.addListener(WATCH_COLLECTION, this._watch)
  }

  componentDidMount () {

  }

  componentWiiUnmount () {
    EventManager.removeListener(this._watch)
  }


  watch (data) {
    this.setState({
      collection : data.collection
    })
  }

  _showBadAdvice () {
    const { navigator, route } = this.props;
    navigator.push({
      scene: 'topic_detail',
      title: route.title,
      showBadAdvice: true
    })
  }

  _filterAdvices (collection) {
    return collection.advices.filter((advice) => advice.bad)
  }


  render () {
    let count = 0
    if ( this.state.collection && this.state.collection.advicesBad ) {
      count = this.state.collection.advicesBad.length
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


export default connect()(Trash)