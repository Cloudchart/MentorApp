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
import Relay from 'react-relay';

import Swipeout from "react-native-swipeout";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./style";
import baseStyles from "../../styles/base";
import * as device from "../../utils/device";

import {
  AddCollectionToUserMutation,
  RemoveCollectionFromUserMutation
} from "../../mutations";

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
      onPress: this.deleteNote,
    } ];
  }


  deleteNote () {
    setTimeout(()=> {
      this.props.deleteRow(this.props.collection)
    }, 0)
  }


  _openedRightCallback () {
    this.openedRight = true;
  }

  _closeSwipeoutCallback () {
    if ( this.openedRight ) {
      this.openedRight = false;
    }
  }

  _adviceItem (props, i) {
    const node = props.node;
    return (
      <View style={styles.collectionItemMoreInner} key={i}>
        <Text style={ styles.collectionItemMoreText } numberOfLines={ 1 }>
          {node.content}
        </Text>
      </View>
    )
  }

  render () {
    const { collection, pressRow } = this.props;
    const { insights } = collection;
    let rowHeight = insights.count > 3 ? (3 * 30 + 30) : insights.edges.length * 30 + 13;
    rowHeight = device.size(rowHeight);

    return (
      <TouchableOpacity
        style={ styles.collectionItem }
        activeOpacity={ 0.75 }
        onPress={pressRow}>

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
              { collection.name }
            </Text>
            <Text style={ styles.collectionCounterText }>
              { !insights.count ? '∞' : insights.count }
            </Text>
          </View>
        </Swipeout>

        {!insights.edges || !insights.edges.length ? null :
          <View style={[styles.collectionItemMore, {height : rowHeight}]}>
            <View style={{flex : 1}}>
              {insights.edges.map(this._adviceItem)}
            </View>
            <View style={{flex : 1}}>
              {insights.count <= 3 ? null :
                <Text style={ styles.textMore }>and {insights.count - insights.edges.length} more</Text>
              }
            </View>
          </View>}
      </TouchableOpacity>

    )
  }
}

export default Relay.createContainer(UserCollectionItem, {
  initialVariables: {
    count: 100
  },
  fragments: {
    user: () => Relay.QL`
        fragment on User {
            id
        }
    `
  }
});
