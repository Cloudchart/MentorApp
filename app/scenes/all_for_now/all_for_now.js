import React, {
    Component,
    Text,
    ScrollView,
    TouchableOpacity,
    View
} from "react-native";
import { connect } from "react-redux";
import { Boris, Button } from "../../components";
import styles from "./style";
import { USER_SUBSCRIBE } from "../../module_dal/actions/actions";

const BorisNote = "That's all for now! Want more advice more often? Human up and subscribe!";

class AllForNow extends Component {

  constructor (props) {
    super(props)

    this.state = {};
    this.subscribeNow = this.subscribeNow.bind(this)
  }

  componentDidMount () {

  }

  /**
   *
   */
  subscribeNow () {
    const { dispatch } = this.props;
    dispatch({ type: USER_SUBSCRIBE })
  }


  /**
   *s
   * @returns {XML}
   */
  render () {
    const { businessSubscription } = this.props.user;
    return (
        <View style={ styles.container }>
          <View style={ styles.borisContainer }>
            <Boris mood="positive" size="small" note={ BorisNote }/>
          </View>

          <Button
              onPress={this.subscribeNow}
              label=""
              color="orange"
              style={ styles.button }>
            <Text style={ styles.buttonText }>Subscribe now</Text>
          </Button>

        </View>
    )
  }
}


export default connect(state => ({
  user: state.user
}))(AllForNow)
