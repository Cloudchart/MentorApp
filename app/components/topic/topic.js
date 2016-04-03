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
import { getGradient } from "../../utils/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./style";
import baseStyles from "../../styles/base";

import {
  SubscribeOnTopicMutation,
  UnsubscribeFromTopicMutation
} from '../../mutations';

import {
  unsubscribeFromTopic,
  subscribeOnTopic
} from '../../actions/topic';


function findSubscribedTopic (topics, topicId) {
  return topics.find((item) => item.node.__dataID__ == topicId);
}

class Topic extends Component {

  constructor (props) {
    super(props)
    const isSubscribe = findSubscribedTopic(this.props.subscribedTopics.edges, this.props.topic.id);

    this.state = {
      subscribe: isSubscribe
    };

    this._subscribeOnTopic = this._subscribeOnTopic.bind(this);
    this._unsubscribeFromTopic = this._unsubscribeFromTopic.bind(this);
  }

  /**
   * try to subscribe
   * @returns {boolean}
   * @private
   */
  _subscribeOnTopic () {
    const { onConfirmation, topic, user } = this.props;

    if ( onConfirmation ) {
      onConfirmation(topic, user);
      return;
    }

    if ( this.state.subscribe ) {
      this._unsubscribeFromTopic()
      return false;
    }

    subscribeOnTopic({ topic, user })
      .then(()=> {
        this.setState({ subscribe: true })
      })
  }

  /**
   * unsubscribe
   * @private
   */
  _unsubscribeFromTopic () {
    const { topic, user } = this.props;
    unsubscribeFromTopic({ topic, user })
      .then(()=> {
        this.setState({ subscribe: false })
      })
  }

  render () {
    const { topic, index } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={ 0.75 }
        style={[styles.item, { backgroundColor: getGradient('green', index ) } ]}
        onPress={this._subscribeOnTopic}>
        <View style={ styles.itemInner }>
          <Text style={ styles.itemText } numberOfLines={ 1 }>
            { topic.name }
          </Text>

          {!this.state.subscribe ? null :
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


export default Relay.createContainer(Topic, {

  fragments: {
    user: () => Relay.QL`
        fragment on User {
            ${SubscribeOnTopicMutation.getFragment('user')}
            ${UnsubscribeFromTopicMutation.getFragment('user')}
            id
        }
    `,

    topic: () => Relay.QL`
        fragment on Topic {
            ${SubscribeOnTopicMutation.getFragment('topic')}
            ${UnsubscribeFromTopicMutation.getFragment('topic')}
            id
            name
        }
    `
  }
});

