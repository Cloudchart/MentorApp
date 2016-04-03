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

import { UnsubscribeFromTopicMutation } from '../../mutations';
import { unsubscribeFromTopic } from '../../actions/topic';

class TopicSubscribed extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visibility: 0,
      isOpen: false
    };

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
      onPress: this._unsubscribeFromTopic
    } ];

    this.openedRight = false;
  }

  _unsubscribeFromTopic () {
    unsubscribeFromTopic({ topic: this.props.topic, user: this.props.user })
  }

  _openedRightCallback () {
    this.openedRight = true;
  }

  _closeSwipeoutCallback () {
    this.openedRight = false;
  }

  render () {
    const { topic, index } = this.props;
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
        ${UnsubscribeFromTopicMutation.getFragment('user')}
        id
      }
    `,

    topic: () => Relay.QL`
      fragment on Topic {       
        ${UnsubscribeFromTopicMutation.getFragment('topic')}
        id
        name       
      }
    `
  }
});
