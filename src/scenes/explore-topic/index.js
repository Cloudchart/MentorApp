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

const PAGE_SIZE = 30

class ExploreTopicScene extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      showConfirmation: false,
    }
  }

  componentDidMount() {
    const { viewer } = this.props
    this.setState({
      dataSource: this._getTopicsDataSource(viewer.topics),
    })
  }

  componentWillReceiveProps(nextProps) {
    const { viewer } = this.props
    if (nextProps.viewer.topics !== viewer.topics) {
      const { topics } = nextProps.viewer
      this.setState({
        dataSource: this._getTopicsDataSource(topics),
      })
    }
  }

  _getTopicsDataSource(topics) {
    const { dataSource } = this.state
    const filteredTopics = topics.edges.filter(topic => (
        !topic.node.isSubscribedByViewer)
    )
    this._topicsData = (this._topicsData || []).concat(filteredTopics)
    return dataSource.cloneWithRows(this._topicsData)
  }

  handleSelectTopic(topic) {
    this.props.navigator.push({
      scene: 'insights',
      title: topic.name,
      topicId: topic.id,
      filter: 'PREVIEW',
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
    }, transaction => {
      if (transaction.done) {
        this.setState({
          isLoadingTail: false,
        })
      }
    })
  }

  _renderTopic(rowData, sectionID, rowID) {
    const { viewer } = this.props
    const topic = rowData.node
    return (
      <TopicEmpty
        topic={topic}
        user={viewer}
        index={rowID}
        onTopicSelect={topic => this.handleSelectTopic(topic)}
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
          pageSize={30}
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

export default Relay.createContainer(ExploreTopicScene, {
  initialVariables: {
    count: 30,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${TopicEmpty.getFragment('user')}
        topics(first: $count, filter: ALL) {
          availableSlotsCount
          edges {
            node {
              id
              name
              isSubscribedByViewer
              ${TopicEmpty.getFragment('topic')}
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `
  },
})
