import React, {
  Component,
  Image,
  View,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import { ACTION_SHOW_RANDOM_ADVICE } from "../../actions/actions";
import * as device from "../../utils/device";
import styles from "../../styles/base";

class NavLogo extends Component {

  state = {}

  constructor (props) {
    super(props)
    this.showRandomAdvice = this.showRandomAdvice.bind(this);
  }

  showRandomAdvice () {
    const { dispatch, reactions } = this.props;
    if ( !reactions.show ) {
      dispatch({ type: ACTION_SHOW_RANDOM_ADVICE, show: true })
    }
  }


  render () {
    return (
      <View style={styles.crumbIconPlaceholder}>
        <TouchableWithoutFeedback onPress={this.showRandomAdvice}>
          <Image
            style={{width : device.size(30), height : device.size(30)}}
            source={require('image!navbar_logo')}/>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

export default connect(state => ({
  reactions: state.reactions
}))(NavLogo)

