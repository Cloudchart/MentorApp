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
import { userFragment, topicFragment, insightFragment } from '../insights/insight-card'
import LikeInsightInFollowUpMutation from '../../mutations/like-insight-in-follow-up'
import DislikeInsightInFollowUpMutation from '../../mutations/dislike-insight-in-follow-up'
import styles from './../user-insights/style'
import * as device from '../../utils/device'

const PAGE_SIZE = 30
const BORIS_NOTE =
  'Hello, master. I sincerely hope you\'ve put these advices to work. ' +
  'Now review them: did they work for you?'

class FollowUpScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      scrollEnabled: true,
      isLoadingTail: false,
      rates: {},
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  componentDidMount() {
    const { viewer, navigator } = this.props
    const { dataSource } = this.state
    const { edges } = viewer.insights
    if (edges.length === 0) {
      navigator.push({
        scene: 'questionnaire',
        title: '',
      })
    }
    this.setState({
      dataSource: dataSource.cloneWithRows(edges),
    })
  }

  componentWillReceiveProps(nextProps) {
    const { viewer } = this.props
    if (nextProps.viewer.insights !== viewer.insights) {
      const { dataSource } = this.state
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
    const { pageInfo } = viewer.insights
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

  renderHeader() {
    return null
  }

  handleItWorksPress(user, topic, insight) {
    const mutation = new LikeInsightInFollowUpMutation({
      user,
      topic,
      insight,
    })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: transaction => {
        this.applyLikeTransaction(transaction)
      }
    })
  }

  handleDidNotWorkPress(user, topic, insight) {
    const mutation = new DislikeInsightInFollowUpMutation({
      user,
      topic,
      insight,
    })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: transaction => {
        this.applyDislikeTransaction(transaction)
      }
    })
  }

  applyLikeTransaction({ likeInsightInTopic }) {
    const { rates } = this.state
    const { id } = likeInsightInTopic.insight
    if (!id) {
      return
    }
    const newRates = {
      ...rates,
      [id]: {
        isLiked: true,
      }
    }
    this.setState({
      rates: newRates,
    })
  }

  applyDislikeTransaction({ dislikeInsightInTopic }) {
    const { rates } = this.state
    const { id } = dislikeInsightInTopic.insight
    if (!id) {
      return
    }
    const newRates = {
      ...rates,
      [id]: {
        isDisliked: true,
      }
    }
    this.setState({
      rates: newRates,
    })
  }

  _renderInsight(rowData, sectionID, rowID) {
    const { viewer } = this.props
    const { rates } = this.state
    const insightRate = rates[rowData.node.id] || {}
    return (
      <InsightRate
        key={rowID}
        insight={rowData.node}
        fontSize={20}
        itWorksState={insightRate.isLiked}
        didNotWorkState={insightRate.isDisliked}
        onItWorksPress={() => this.handleItWorksPress(viewer, rowData.topic, rowData.node)}
        onDidNotWorkPress={() => this.handleDidNotWorkPress(viewer, rowData.topic, rowData.node)}
        onPressCard={() => false}
        />
    )
  }

  render() {
    const { viewer } = this.props
    const { dataSource, scrollEnabled, isLoadingTail } = this.state
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
            dataSource={dataSource}
            renderRow={(rowData, sectionID, rowID) => this._renderInsight(rowData, sectionID, rowID)}
            isLoadingTail={isLoadingTail}
            renderHeader={() => this.renderHeader()}
            style={[styles.scroll, { paddingTop: device.size(220) }]}
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
        ${userFragment}
        insights(first: $count, filter: $filter)  {
          edges {
            topic {
              ${topicFragment}
            }
            node {
              id
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
