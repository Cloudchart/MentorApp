import React, {
    Component,
    Text,
    ScrollView,
    TouchableOpacity,
    View
} from "react-native";
import { Boris, Button } from "../../components";
import { commentStyle } from "./style";


class CommentGood extends Component {

  constructor (props) {
    super(props)

    this.state = {
      errorRegister: false,
      user: null,
      subscriptions: []
    }

    this._continue = this.props.continue.bind(this);
  }

  render () {
    return (
        <View style={ commentStyle.container }>
          <View style={ commentStyle.borisContainer }>
            <Boris
                mood="positive"
                size="small"
                note={"668 more users also approve this advice. You're on the right track, young padawan!"}/>
          </View>

          <Button
              label=""
              color="green"
              onPress={this._continue}
              style={ commentStyle.button }>
            <Text style={ [commentStyle.buttonText, {marginBottom: 0}] }>Continue</Text>
          </Button>
        </View>
    )
  }
}

export default CommentGood

