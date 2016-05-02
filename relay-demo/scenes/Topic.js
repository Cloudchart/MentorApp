import React, {
  Component,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Relay from 'react-relay'

import SubscribeOnTopicMutation from '../mutations/SubscribeOnTopic'
import UnsubscribeFromTopicMutation from '../mutations/UnsubscribeFromTopic'


const CheckBoxSource = require('../images/checkbox.png')

class Topic extends Component {

  constructor(props) {
    super(props)

    this._handlePress = this._handlePress.bind(this)
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={ 0.75 } onPress={ this._handlePress } style={ styles.container }>
        <Text>{ this.props.topic.name }</Text>
        { this._renderSubscriptionStatus() }
      </TouchableOpacity>
    )
  }

  _renderSubscriptionStatus() {
    return this.props.topic.isSubscribedByViewer
      ? <View style={ styles.status }><Text>-</Text></View>
      : <View style={ styles.status }><Text>+</Text></View>
  }

  _handlePress() {
    this.props.topic.isSubscribedByViewer
      ? this._unsubscribeFromTopic()
      : this._subscribeOnTopic()
  }

  _subscribeOnTopic() {
    Relay.Store.commitUpdate(
      new SubscribeOnTopicMutation({ topic: this.props.topic, user: this.props.user }), {
        onFailure: (transaction) => {
          let error = transaction.getError()
          alert(error.source.errors[0].message)
        }
      }
    )
  }

  _unsubscribeFromTopic() {
    Relay.Store.commitUpdate(
      new UnsubscribeFromTopicMutation({ topic: this.props.topic, user: this.props.user }), {
        onFailure: (transaction) => {
          let error = transaction.getError()
          alert(error.source.errors[0].message)
        }
      }
    )
  }

}

const styles = StyleSheet.create({

  container: {
    alignItems: 'center',
    backgroundColor: '#eee',
    height: 32,
    justifyContent: 'center',
    marginBottom: 2,
  },

  status: {
    justifyContent: 'center',
    position: 'absolute',
    height: 32,
    right: 10,
    top: 0,
  }

})


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
        isSubscribedByViewer
      }
    `
  }

})
