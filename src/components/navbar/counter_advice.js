import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import styles from "../../styles/base";

class CounterAdvice extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  _goUserCollection () {
    const { navigator } = this.props;
    navigator.push({ scene: 'user-collections', title: 'Saved advices' })
  }

  render () {
    const count = this.props.collections.count_insight;
    return (
      <TouchableOpacity
        style={[styles.crumbIconWrapperGreen, {bottom : 1}]}
        activeOpacity={ 0.75 }
        onPress={()=>{this._goUserCollection()}}>
        <Text style={styles.crumbIconBasketText}>{count}</Text>
      </TouchableOpacity>
    )
  }
}

export default connect(state => ({
  collections: state.collections
}))(CounterAdvice)
