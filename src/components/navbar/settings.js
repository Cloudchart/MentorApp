import React, {
  Component,
  Image,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import { ACTION_SHOW_RANDOM_ADVICE } from "../../actions/actions";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../../styles/base";


class Settings extends Component {

  constructor (props) {
    super(props)
    this.showSettings = this.showSettings.bind(this);
  }

  showSettings () {
    const { dispatch, reactions, navigator } = this.props;
    navigator.push({
      scene: 'settings',
      title: 'Settings',
      FloatFromBottom: true
    })

    setTimeout(() => {
      dispatch({ type: ACTION_SHOW_RANDOM_ADVICE, show: false })
    }, 500)
  }


  render () {
    return (
      <TouchableOpacity
        activeOpacity={ 0.75 }
        style={styles.crumbIconPlaceholder}
        onPress={this.showSettings}>
        <Icon name="cog" style={styles.crumbIconSettings}/>
      </TouchableOpacity>
    )
  }
}

export default connect()(Settings)

