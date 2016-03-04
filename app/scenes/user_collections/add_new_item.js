import React, { Component, Image, Text, TextInput, View, ListView } from "react-native";
import styles from "./style";
import Icon from "react-native-vector-icons/FontAwesome";
import baseStyles from "../../styles/base";

class AddNewItem extends Component {

  constructor (props) {
    super(props)

  }


  render () {
    const { collectionName, onChangeText, onEndEditing, onFocus, onBlur } = this.props;

    return (
        <View style={ [styles.collectionItem, styles.newCollection] }>
          <View style={ styles.collectionItemInner }>
            <Icon name="folder-open-o" style={[baseStyles.crumbIcon, baseStyles.folderIcon]}/>
            <TextInput
                value={ collectionName }
                style={ styles.collectionText }
                placeholder="Enter new collection name"
                placeholderTextColor="hsl(137, 100%, 83%)"
                autoFocus={ true }
                onChangeText={ onChangeText }
                onEndEditing={ onEndEditing }
                onFocus={ onFocus }
                onBlur={ onBlur }
            />
          </View>
        </View>
    )
  }
}


export default AddNewItem;