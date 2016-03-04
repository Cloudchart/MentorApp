import React, {
    Component,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";
import baseStyle from "../../styles/base";
import styles from "./style";

/**
 *
 * @returns {XML}
 * @constructor
 */
class AddCard extends Component {
  constructor(props){
    super(props)

  }
  render(){
    return (
        <LinearGradient colors={['#00aced', '#1cb8f6']} style={ {flex : 1} }>
          <TouchableOpacity
              activeOpacity={ 0.75 }
              style={styles.controlShare}
              onPress={this.props.onAddToCollection}>
            <Icon name="folder-open-o" style={[baseStyle.crumbIcon, {color : '#fff'}]}/>
            <Text style={ styles.controlShareText }>
              Add to collection
            </Text>
          </TouchableOpacity>
        </LinearGradient>
    )
  }
}

class ShareCard extends Component {
  constructor(props){
    super(props)

    this.onShare = this.props.onShare.bind(this);
  }
  render(){
    return (
        <LinearGradient colors={['#00aced', '#1cb8f6']} style={ {flex : 1} }>
          <TouchableOpacity
              activeOpacity={ 0.75 }
              style={[styles.controlShare]}
              onPress={this.onShare}>
            <Icon name="share" style={[baseStyle.crumbIcon, {color : '#fff'}]}/>
            <Text style={ styles.controlShareText }>
              Share
            </Text>
          </TouchableOpacity>
        </LinearGradient>
    )
  }
}

export {AddCard, ShareCard}