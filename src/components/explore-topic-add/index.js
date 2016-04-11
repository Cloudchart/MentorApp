import React, {
    Component,
    Text,
    ScrollView,
    TouchableOpacity,
    View
} from "react-native";
import { Boris, Button, TransparentButton } from "../../components";
import { commentStyle } from "./style";

class ExploreTopicAdd extends Component {

  constructor (props) {
    super(props)

    this._undoAdd = this.props.undo.bind(this, 'add');
    this._notNow = this.props.undo.bind(this, 'not_now');
  }

  render () {
    return (
        <View style={ commentStyle.container }>
          <View style={ commentStyle.borisContainer }>
            <Boris
                mood="positive"
                size="small"
                note={"I see your interest, Master. Would you like me to add it to your topics?"}/>
          </View>

          <Button
              label=""
              color="green"
              onPress={this._undoAdd}
              style={ commentStyle.button }>
            <Text style={ commentStyle.buttonText }>Sure, add it</Text>
          </Button>

          <TransparentButton
              style={{paddingVertical: 10}}
              label="Not now, thanks"
              onPress={this._notNow}
              color="red"
          />

        </View>
    )
  }
}


export default ExploreTopicAdd

