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
    const filteredTopics = topics.filter(topic =>
        !topic.node.isSubscribedByViewer
    )
    return dataSource.cloneWithRows(filteredTopics)
  }

  handleSelectTopic(topic) {
    this.props.navigator.push({
      scene: 'explore-insights',
      title: topic.name,
      topicID: topic.id,
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
    `,
  },
})
