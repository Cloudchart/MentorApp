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
import { USER_SUBSCRIBE } from "../../actions/actions";

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
    const { navigator } = this.props;
    navigator.replace({
      scene: 'subscription',
      title: 'Subscription'
    })
  }


  /**
   *s
   * @returns {XML}
   */
  render () {
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
