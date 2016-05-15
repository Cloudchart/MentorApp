import React, {
  Component,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  ListView,
  AlertIOS,
  Animated,
  Easing,
  Dimensions,
  ActionSheetIOS,
  PanResponder
} from 'react-native'
import Relay from 'react-relay'
import { Boris, Button, ScrollListView } from '../../components'
import InsightRate from '../../components/insight/insight-rate'
import { ScrollHandler } from '../../utils/animation'
import Loader  from '../../components/loader'
import { insightFragment } from '../insights/insight-card'
import LikeInsightInTopicMutation from '../../mutations/like-insight-in-topic'
import DislikeInsightInTopicMutation from '../../mutations/dislike-insight-in-topic'
import styles from './../user-insights/style'
import * as device from '../../utils/device'

const PAGE_SIZE = 30
const BORIS_NOTE =
  'Hello, master. I sincerely hope you\'ve put these advices to work. ' +
  'Now review them: did they work for you?'

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})

class FollowUpScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      listInsights: [],
      scrollEnabled: true,
      isLoadingTail: false,
    }
  }

  componentDidMount() {
    const { viewer, navigator } = this.props
    const { edges } = viewer.insights
    if (edges.length === 0) {
      navigator.push({
        scene: 'questionnaire',
        title: '',
      })
    }
    this.setState({
      listInsights: edges,
      dataSource: dataSource.cloneWithRows(edges),
    })
  }

  componentWillReceiveProps(nextProps) {
    const { viewer } = this.props
    if (nextProps.viewer.insights !== viewer.insights) {
      const { insights } = nextProps.viewer
      if (insights.edges.length === 0) {
        navigator.push({
          scene: 'questionnaire',
          title: '',
        })
      }
      this.setState({
        dataSource: dataSource.cloneWithRows(insights.edges),
      })
    }
  }

  handleEndReached() {
    const { relay, viewer } = this.props
    let pageNext = viewer.insights.pageInfo
    let count = relay.variables.count
    if ( !pageNext || !pageNext.hasNextPage ) {
      return
    }
    this.setState({ isLoadingTail: true })
    relay.setVariables({ count: count + PAGE_SIZE }, transaction => {
      if (transaction.done) {
        this.setState({
          isLoadingTail: false,
        })
      }
    })
  }

  renderHeader() {
    return null
  }

  handleItWorksPress(insight, topic) {
    console.log('handleItWorksPress', { insight, topic })
    const mutation = new LikeInsightInTopicMutation({
      insight,
      topic,
      shouldAddToUserCollectionWithTopicName: true,
    }, {
      onSuccess: transaction => {
        this.filterLike(transaction)
      }
    })
    Relay.Store.commitUpdate(mutation)
  }

  handleDidNotWorkPress(insight, topic) {
    console.log('handleDidNotWorkPress', { insight, topic })
    const mutation = new DislikeInsightInTopicMutation({
      insight,
      topic,
    }, {
      onSuccess: transaction => {
        this.filterDisLike(transaction)
      }
    })
    Relay.Store.commitUpdate(mutation)
  }

  filterLike(tran) {
    const { likeInsightInTopic } = tran
    const listInsights = [ ...this.state.listInsights ]
    listInsights.forEach((item) => {
      if (item.node.id == likeInsightInTopic.insight.id) {
        item.node.like = true;
        item.node.dislike = false;
      }
    })
    this.setState({
      listInsights: [ ...listInsights ],
    });
  }

  filterDisLike(tran) {
    const { dislikeInsightInTopic } = tran
    const listInsights = [ ...this.state.listInsights ]
    listInsights.forEach((item) => {
      if (item.node.id == dislikeInsightInTopic.insight.id) {
        item.node.dislike = true
        item.node.like = false
        return item.node
      }
    })
    this.setState({
      listInsights: [ ...listInsights ],
    })
  }

  _renderInsight(rowData, sectionID, rowID) {
    return (
      <InsightRate
        key={rowID}
        insight={rowData.node}
        fontSize={20}
        itWorks={() => this.handleItWorksPress(rowData.node, rowData.topic)}
        didNotWork={() => this.handleDidNotWorkPress(rowData.node, rowData.topic)}
        onPressCard={() => false}
        />
    )
  }

  /**
   *s
   * @returns {XML}
   */
  render() {
    const { viewer } = this.props
    const { scrollEnabled, isLoadingTail, listInsights } = this.state
    const { edges } = viewer.insights
    if (edges.length === 0) {
      return (
        <Loader />
      )
    }
    const _scroll = ScrollHandler.bind(this, {
      isLoadingTail,
      callback: () => this.handleEndReached(),
      onEndReachedThreshold: 16,
    });
    return (
      <View style={styles.container}>
        <ScrollView
          onScroll={_scroll}
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={16}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={true}
          >
          <View style={styles.borisContainer}>
            <Boris mood="positive" size="small" note={BORIS_NOTE}/>
          </View>
          <ListView
            enableEmptySections={true}
            dataSource={dataSource.cloneWithRows(listInsights)}
            renderRow={(rowData, sectionID, rowID) => this._renderInsight(rowData, sectionID, rowID)}
            isLoadingTail={isLoadingTail}
            renderHeader={() => this.renderHeader()}
            style={[styles.scroll, {paddingTop: device.size(220)}]}
            />
        </ScrollView>
      </View>
    )
  }
}

export default Relay.createContainer(FollowUpScene, {
  initialVariables: {
    count: 100,
    filter: 'FOLLOWUPS',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        insights(first: $count, filter: $filter)  {
          edges {
            topic {
              id
              name
            }
            node {
              ${insightFragment}
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
