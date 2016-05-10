import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Relay from 'react-relay'
import { Loader, ScrollListView } from '../../components'
import { getGradient } from '../../utils/colors'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './style'
import baseStyles from '../../styles/base'
import SubscribeOnTopic from '../../mutations/subscribe-on-topic'
import UnsubscribeFromTopic from '../../mutations/unsubscribe-from-topic'

class Topic extends Component {

  handleSubscribeOnTopic() {
    const { onPressUserAddedTopic, topic, user, onPressBefore, onPress } = this.props
    onPressBefore && onPressBefore();
    if (onPressUserAddedTopic) {
      onPressUserAddedTopic(topic, user)
      return
    }
    if (topic.isSubscribedByViewer) {
      this.handleUnsubscribeFromTopic()
      return false
    }
    const mutation = new SubscribeOnTopic({ topic, user })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => {
        onPress && onPress(topic, user)
      }
    })
  }

  handleUnsubscribeFromTopic() {
    const { topic, user, onPress } = this.props
    const mutation = new UnsubscribeFromTopic({ topic, user })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => {
        onPress && onPress(topic, user)
      }
    })
  }

  render() {
    const { topic, index, children } = this.props
    const backgroundColor = getGradient('green', index)
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        style={[styles.item, { backgroundColor }]}
        onPress={() => this.handleSubscribeOnTopic()}
        >
        <View style={styles.itemInner}>
          <Text style={styles.itemText} numberOfLines={1}>
            {topic.name}
          </Text>
          {topic.isSubscribedByViewer && (
            <View style={styles.selected}>
              <Icon name="check" style={[baseStyles.crumbIconAngle, styles.selectedIcon]}/>
            </View>
          )}
          {children}
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
    `,
  },
})
