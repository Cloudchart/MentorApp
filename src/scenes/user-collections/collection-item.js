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

  constructor (props, context) {
    super(props, context)

    this._swipeButtons = [{
      text: 'Delete',
      close: true,
      styleButton: {
        backgroundColor: '#fa3d39'
      },
      styleText: {
        color: '#fff'
      },
      component: (
        <View style={styles.iconBasketView}>
          <Icon name="trash" style={[baseStyles.crumbIconAngle, styles.iconBasket]}/>
        </View>
      ),
      onPress: () => this.handleDeletePress(),
    }];

    this.state = {
      isLoadingTail: false,
      visibility: 0,
      isOpen: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.closeAllItems) {
      this.setState({
        closeAllItems: nextProps.closeAllItems
      });
    }
  }

  handleDeletePress() {
    setTimeout(
      () => this.props.deleteRow(this.props.collection),
      0
    );
  }

  openedRightCallback() {
    this.openedRight = true;
  }

  closeSwipeoutCallback() {
    if (this.openedRight) {
      this.openedRight = false;
    }
    this.setState({
      closeAllItems: false,
    })
  }

  renderAdvicePreview(props, index) {
    return (
      <View style={styles.collectionItemMoreInner} key={index}>
        <Text style={styles.collectionItemMoreText} numberOfLines={1}>
          {props.node.content}
        </Text>
      </View>
    )
  }

  render () {
    const { collection, pressRow } = this.props;
    const { insights } = collection;
    const basicRowHeight =
      insights.count > 3 ?
        (3 * 30 + 30) :
        insights.edges.length * 30 + 13;
    const finalRowHeight = device.size(basicRowHeight);

    return (
      <TouchableOpacity
        style={styles.collectionItem}
        activeOpacity={ 0.75 }
        onPress={pressRow}>

        <Swipeout
          right={this._swipeButtons}
          autoClose={true}
          close={this.state.closeAllItems}
          autoCloseAfterPressButton={false}
          openedRightCallback={() => this.openedRightCallback()}
          closeSwipeoutCallback={() => this.closeSwipeoutCallback()}
          backgroundColor='transparent'>
          <TouchableHighlight onPress={pressRow}>
            <View style={styles.collectionItemInner}>
              <Icon name='folder-open-o' style={[baseStyles.crumbIcon, { color: '#00af58' }]}/>
              <Text style={styles.collectionText} numberOfLines={ 1 }>
                {collection.name}
              </Text>
              <Text style={styles.collectionCounterText}>
                {!insights.count ? 0 : insights.count}
              </Text>
            </View>
          </TouchableHighlight>
        </Swipeout>

        {insights.edges && (insights.edges.length > 0) && (
          <View style={[styles.collectionItemMore, { height: finalRowHeight }]}>
            <View style={{ flex: 1 }}>
              {insights.edges.map(this.renderAdvicePreview)}
            </View>
            <View style={{ flex: 1}}>
              {(insights.count > 3) ? (
                <Text style={styles.textMore}>
                  {'and ' + (insights.count - insights.edges.length) + ' more'}
                </Text>
              ) : null}
            </View>
          </View>
        )}
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
