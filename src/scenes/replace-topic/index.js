import React, {
  Component,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ListView
} from 'react-native'
import Relay from 'react-relay'
import { Boris, Button, Loader, ScrollListView } from '../../components'
import TopicEmpty from '../../components/topic/topic-empty.js'
import styles from './style'
import { _flex } from '../../styles/base'
import UnsubscribeFromTopicMutation from '../../mutations/unsubscribe-from-topic'
import SubscribeOnTopicMutation from '../../mutations/subscribe-on-topic'

const PAGE_SIZE = 30

class ReplaceTopic extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  componentDidMount() {
    const { viewer } = this.props
    this.setState({
      dataSource: this._getDataSource(viewer.topics.edges),
    })
  }

  componentWillReceiveProps(nextProps) {
    const { viewer } = this.props
    if (nextProps.viewer.topics !== viewer.topics) {
      const { topics } = nextProps.viewer
      this.setState({
        dataSource: this._getDataSource(topics.edges),
      })
    }
  }

  _getDataSource(topics) {
    const { dataSource } = this.state
    return dataSource.cloneWithRows(topics)
  }

  _unsubscribeFromTopic(topic) {
    const { viewer } = this.props
    const mutation = new UnsubscribeFromTopicMutation({
      user: viewer,
      topic,
    })
    return new Promise((resolve, reject) => {
      Relay.Store.commitUpdate(mutation, {
        onSuccess: transaction => resolve(),
        onFailure: response => reject(response),
      })
    })
  }

  _subscribeOnTopic(topic) {
    const { viewer } = this.props
    const mutation = new SubscribeOnTopicMutation({
      user: viewer,
      topic,
    })
    return new Promise((resolve, reject) => {
      Relay.Store.commitUpdate(mutation, {
        onSuccess: transaction => resolve(),
        onFailure: response => reject(response),
      })
    })
  }

  handleReplaceTopicPress(topicToReplace) {
    const { navigator, topic, popToTop } = this.props
    this._unsubscribeFromTopic(
      topicToReplace
    ).then(() => {
      return this._subscribeOnTopic(topic)
    }).then(() => {
      if (popToTop == 'pop') {
        navigator.pop()
      } else {
        navigator.popToTop()
      }
    })
  }

  handleEndReached() {
    const { relay, viewer } = this.props
    const { pageInfo } = viewer.topics
    if (!pageInfo || !pageInfo.hasNextPage) {
      return
    }
    const { count } = relay.variables
    this.setState({
      isLoadingTail: true,
    })
    relay.setVariables({
      count: count + PAGE_SIZE,
    }, readyState => {
      if (readyState.done) {
        this.setState({
          isLoadingTail: false,
          dataSource: this._getDataSource(this.props.viewer.topics.edges),
        })
      }
    })
  }

  _renderTopic(rowData, sectionID, rowID) {
    return (
      <TopicEmpty
        topic={rowData.node}
        user={this.props.viewer}
        index={rowID}
        onTopicSelect={topic => this.handleReplaceTopicPress(topic)}
        />
    )
  }

  render() {
    const { isLoadingTail, dataSource } = this.state
    return (
      <View style={styles.container}>
        <ScrollListView
          dataSource={dataSource}
          renderRow={(rowData, sectionID, rowID) => this._renderTopic(rowData, sectionID, rowID)}
          pageSize={PAGE_SIZE}
          isLoadingTail={isLoadingTail}
          onEndReached={() => this.handleEndReached()}
          onEndReachedThreshold={20}
          showsVerticalScrollIndicator={false}
          style={_flex}
          />
      </View>
    )
  }
}

export default Relay.createContainer(ReplaceTopic, {
  initialVariables: {
    count: PAGE_SIZE,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        ${TopicEmpty.getFragment('user')}
        topics(first: $count, filter: SUBSCRIBED) {
          availableSlotsCount
          edges {
            node {
              id
              isSubscribedByViewer
              ${TopicEmpty.getFragment('topic')}
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
  }
})
