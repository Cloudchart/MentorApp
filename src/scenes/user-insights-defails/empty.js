import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { Boris } from "../../components";
import styles from "./style";

const BorisNote = "There's nothing here, human. Try adding some fine advice to this collection?";

class Empty extends Component {

  state = {}

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <View style={ styles.container }>
        <View style={ styles.borisContainerCenter }>
          <Boris
            mood="positive"
            size="small"
            note={BorisNote}/>
        </View>
      </View>
    )
  }
}

export default Empty;
