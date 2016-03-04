import React, { Component, Image, LayoutAnimation, Text, TouchableOpacity, View } from "react-native";
import { Loader, ScrollListView } from "../../components";
import { getGradient } from "../../utils/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./style";
import baseStyles from "../../styles/base";

class Topic extends Component {
  constructor (props) {
    super(props)
    this.state = {};

    this._onPress = this.props.selectTopic ?
        this.props.selectTopic.bind(null, this.props.id) :
        ()=> {}
  }

  render () {
    const { title, selected, index } = this.props;


    return (
        <TouchableOpacity
            activeOpacity={ 0.75 }
            style={[styles.item, { backgroundColor: getGradient('green', index ) } ]}
            onPress={this._onPress}>
          <View style={ styles.itemInner }>
            <Text style={ styles.itemText } numberOfLines={ 1 }>
              { title }
            </Text>

            {!selected ? null :
                <View style={styles.selected}>
                  <Icon name="check" style={[baseStyles.crumbIconAngle, styles.selectedIcon]}/>
                </View>
            }

            {this.props.children}
          </View>
        </TouchableOpacity>
    )
  }
}


export default Topic;