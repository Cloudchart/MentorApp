import React, {
    Component,
    LayoutAnimation,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    View,
    ListView,
    PanResponder,
    ScrollView
} from "react-native";
import Swipeout from "react-native-swipeout";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./style";
import baseStyles from "../../styles/base";
import * as device from "../../utils/device";

class UserCollectionItem extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isLoadingTail: false,
      visibility: 0,
      isOpen: false
    }

    this.deleteNote = this.deleteNote.bind(this);

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
      onPress: this.deleteNote
    } ];


    const { id, pressRow} = this.props;
    this.pressRow = pressRow.bind(this, id)
  }


  deleteNote () {
    setTimeout(()=> {
      this.props.deleteRow(this.props.id)
    }, 0)
  }


  _openedRightCallback () {
    this.openedRight = true;
  }

  _closeSwipeoutCallback () {
    this.openedRight = false;
    setTimeout(()=> {
      this.pressRow(this.props.id)
    }, 0)
  }

  _adviceItem (props, i) {
    return (
        <View style={styles.collectionItemMoreInner} key={i}>
          <Text style={ styles.collectionItemMoreText } numberOfLines={ 1 }>
            {props.text}
          </Text>
        </View>
    )
  }

  render () {
    const { name, advices } = this.props;
    const advicesList = advices.slice(0, 3)
    let rowHeight = advices.length > 3 ? (3 * 30 + 30) : advices.length * 30 + 13;

    rowHeight = device.size(rowHeight);

    return (
        <TouchableOpacity
            style={ styles.collectionItem }
            activeOpacity={ 0.75 }
            onPress={this.pressRow}>

          <Swipeout
              right={this._swipeBtns}
              autoClose='true'
              autoCloseAfterPressButton='false'
              openedRightCallback={this._openedRightCallback.bind(this)}
              closeSwipeoutCallback={this._closeSwipeoutCallback.bind(this)}
              backgroundColor='transparent'>

            <View style={ styles.collectionItemInner }>
              <Icon name="folder-open-o" style={[baseStyles.crumbIcon, {color : '#00af58'}]}/>
              <Text style={ styles.collectionText } numberOfLines={ 1 }>
                { name }
              </Text>
              <Text style={ styles.collectionCounterText }>
                { !advices.length ? '∞' : advices.length }
              </Text>
            </View>
          </Swipeout>

          <View style={[styles.collectionItemMore, {height : rowHeight}]}>
            <View style={{flex : 1}}>
              {advicesList.map(this._adviceItem)}
            </View>
            <View style={{flex : 1}}>
              {advices.length <= 3 ? null :
                  <Text style={ styles.textMore }>and {advices.length - 3} more</Text>
              }
            </View>
          </View>
        </TouchableOpacity>

    )
  }
}

export default UserCollectionItem;