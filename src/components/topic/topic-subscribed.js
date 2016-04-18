import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Relay from 'react-relay';

import { Loader, ScrollListView } from "../../components";
import Swipeout from "react-native-swipeout";
import Icon from "react-native-vector-icons/FontAwesome";
import { getGradient } from "../../utils/colors";
import baseStyles from "../../styles/base";
import styles from "./style";
import { unsubscribeFromTopic } from '../../actions/topic';

class TopicSubscribed extends Component {

  state = {
    visibility: 0
  }

  constructor (props) {
    super(props)

    this._unsubscribeFromTopic = this._unsubscribeFromTopic.bind(this);

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
      onPress: this._unsubscribeFromTopic,
      isDelete: true
    } ];

    this.openedRight = false;
  }

  componentWillReceiveProps (nextProps) {
    if ( nextProps.closeAllItems ) {
      this.state.closeAllItems = nextProps.closeAllItems;
    }
  }

  componentWillUnmount () {
    this.openedRight = null;
    this._swipeBtns = null;
  }

  _unsubscribeFromTopic () {
    const { unsubscribeFromTopicCallback } = this.props;
    this.openedRight = false;
    unsubscribeFromTopic({ topic: this.props.topic, user: this.props.user })
      .then(()=> {
        if ( unsubscribeFromTopicCallback ) {
          unsubscribeFromTopicCallback()
        }
      })
      .catch(()=> {
        if ( unsubscribeFromTopicCallback ) {
          unsubscribeFromTopicCallback()
        }
      })
  }

  _openedRightCallback () {
    this.openedRight = true;
  }

  _closeSwipeoutCallback () {
    this.openedRight = false;
    this.state.closeAllItems = false;
  }

  render () {
    const { topic, index } = this.props;
    return (
      <Swipeout
        right={this._swipeBtns}
        autoClose='true'
        close={this.state.closeAllItems}
        openedRightCallback={this._openedRightCallback.bind(this)}
        closeSwipeoutCallback={this._closeSwipeoutCallback.bind(this)}
        backgroundColor='transparent'>

        <View style={[styles.item, { backgroundColor: getGradient('green', index ) } ]}>
          <View style={ styles.itemInner }>
            <Text style={ styles.itemText } numberOfLines={ 1 }>
              { topic.name }
            </Text>
          </View>
        </View>
      </Swipeout>
    )
  }
}

export default Relay.createContainer(TopicSubscribed, {

  fragments: {
    user: () => Relay.QL`
        fragment on User {
            id
        }
    `,

    topic: () => Relay.QL`
        fragment on Topic {
            id
            name
        }
    `
  }
});
