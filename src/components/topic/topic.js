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
  unsubscribeFromTopic,
  subscribeOnTopic
} from '../../actions/topic';

class Topic extends Component {

  state = {}

  constructor (props) {
    super(props)
    this._subscribeOnTopic = this._subscribeOnTopic.bind(this);
    this._unsubscribeFromTopic = this._unsubscribeFromTopic.bind(this);
  }

  /**
   * try to subscribe
   * @returns {boolean}
   * @private
   */
  _subscribeOnTopic () {
    const { onPressUserAddedTopic, topic, user, onPressBefore } = this.props;

    onPressBefore && onPressBefore();

    if ( onPressUserAddedTopic ) {
      onPressUserAddedTopic(topic, user);
      return;
    }

    if ( topic.isSubscribedByViewer ) {
      this._unsubscribeFromTopic();
      return false;
    }

    subscribeOnTopic({ topic, user })
      .then(()=> {
        this.props.onPress && this.props.onPress(topic, user);
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
        this.props.onPress && this.props.onPress(topic, user);
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

          {!topic.isSubscribedByViewer ? null :
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
            id
        }
    `,

    topic: () => Relay.QL`
        fragment on Topic {
            id
            name
            isSubscribedByViewer
        }
    `
  }
});

