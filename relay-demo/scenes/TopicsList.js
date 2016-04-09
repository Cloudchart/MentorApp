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

import Topic from './Topic'


class TopicsList extends Component {

  constructor(props) {
    super(props)

    this._renderTopic = this._renderTopic.bind(this)
  }

  render() {
    return (
      <View>
        { this.props.topics.map(this._renderTopic) }
      </View>
    )
  }

  _renderTopic(topic, ii) {
    return <Topic key={ ii } topic={ topic } user={ this.props.user } />
  }

}

export default TopicsList
