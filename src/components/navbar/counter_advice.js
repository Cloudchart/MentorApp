import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { ACTION_SHOW_RANDOM_ADVICE } from "../../actions/actions";
import styles from "../../styles/base";

class CounterAdvice extends Component {

  state = {}

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.collections.count_insight != this.props.collections.count_insight;
  }


  _goUserCollection () {
    const { navigator, dispatch } = this.props;
    navigator.push({
      scene: 'user-collections',
      title: 'Saved advices',
      add: 'no'
    })

    setTimeout(() => {
      dispatch({ type: ACTION_SHOW_RANDOM_ADVICE, show: false })
    }, 500)
  }

  render () {
    const count = this.props.collections.count_insight;
    return (!count ? null :
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
