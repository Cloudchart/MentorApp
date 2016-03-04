import React, {
    Component,
    Image,
    LayoutAnimation,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Loader, ScrollListView } from "../../components";
import Swipeout from "react-native-swipeout";
import Icon from "react-native-vector-icons/FontAwesome";
import { getGradient } from "../../utils/colors";
import baseStyles from "../../styles/base";
import styles from "./style";

class UserTopic extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visibility: 0,
      isOpen: false
    };

    this.deleteTopic = this.deleteTopic.bind(this);

    this._swipeBtns = [ {
      text: 'Delete',
      close: true,
      styleButton: {
        backgroundColor: 'red',
        //borderBottomColor: 'hsl(137, 59%, 43%)',
        //borderBottomWidth: 2
      },
      styleText: {
        color: '#fff'
      },
      component: <View style={styles.iconBasketView}>
        <Icon name="trash" style={[baseStyles.crumbIconAngle, styles.iconBasket]}/>
      </View>,
      onPress: this.deleteTopic
    } ];

    this.openedRight = false;
  }

  deleteTopic () {
    this.props.deleteRow(this.props.id)
  }

  _openedRightCallback () {
    this.openedRight = true;
  }

  _closeSwipeoutCallback () {
    this.openedRight = false;
  }

  render () {
    const {
        title,
        index
    } = this.props;
    return (
        <Swipeout
            right={this._swipeBtns}
            autoClose='true'
            openedRightCallback={this._openedRightCallback.bind(this)}
            closeSwipeoutCallback={this._closeSwipeoutCallback.bind(this)}
            backgroundColor='transparent'>

          <View style={[styles.item, { backgroundColor: getGradient('green', index ) } ]}>
            <View style={ styles.itemInner }>
              <Text style={ styles.itemText } numberOfLines={ 1 }>
                { title }
              </Text>
            </View>
          </View>
        </Swipeout>
    )
  }
}


export default UserTopic;