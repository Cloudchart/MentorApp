import React, {
    Component,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./style";
import baseStyles from "../../styles/base";

class OnlyAdd extends Component {

  constructor (props) {
    super(props)

    const { id, pressRow } = this.props;
    this.pressRow = pressRow.bind(null, id);
  }

  render () {
    const { name, advices } = this.props;

    return (
        <TouchableOpacity
            style={ styles.collectionItem }
            activeOpacity={ 0.75 }
            onPress={this.pressRow}>

          <View style={ styles.collectionItemInner }>
            <Icon name="folder-open-o" style={[baseStyles.crumbIcon, {color : '#00af58'}]}/>
            <Text style={ styles.collectionText } numberOfLines={ 1 }>
              { name }
            </Text>
            <Text style={ styles.collectionCounterText }>
              { !advices.length ? '∞' : advices.length }
            </Text>
          </View>
        </TouchableOpacity>
    )
  }
}

export default OnlyAdd;