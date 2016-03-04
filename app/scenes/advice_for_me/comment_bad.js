import React, { Component, Text, ScrollView, TouchableOpacity, View } from "react-native";
import { Boris, Button, TransparentButton } from "../../components";
import { commentStyle } from "./style";

class CommentBad extends Component {

  constructor (props) {
    super(props)
    this.state = {
      errorRegister: false,
      user: null,
      subscriptions: []
    }

    this._undo = this.props.undo.bind(this, 'undo');
    this._delete = this.props.undo.bind(this, 'delete');
  }

  render (){
    return (
        <View style={ commentStyle.container }>
          <View style={ commentStyle.borisContainer }>
            <Boris
                mood="negative"
                size="small"
                note={"Really? Really?! You swipe left on Startup L. Jackson? My boy, you won't get too far!"}/>
          </View>

          <Button
              label=""
              color="green"
              onPress={this._undo}
              style={ commentStyle.button }>
            <Text style={ commentStyle.buttonText }>Undo</Text>
          </Button>

          <TransparentButton
              style={{paddingVertical: 10}}
              label="I know what a'm doing"
              onPress={this._delete}
              color="red"
          />

        </View>
    )
  }
}


export default CommentBad

