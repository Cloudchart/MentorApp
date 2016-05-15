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

const BORIS_NOTE =
  'Hello, master. I sincerely hope you\'ve put these advices to work. ' +
  'Now review them: did they work for you?'

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
})

class FollowUpScene extends Component {

  constructor(props) {
    super(props)
    this.PAGE_SIZE = 30;
    this.saveTimeout = null;
    this._onEndReached = this._onEndReached.bind(this);
    this.state = {
      listInsights: [],
      scrollEnabled: true,
      isLoadingTail: false,
      random: (Math.random(1000) * 100).toString(16),
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
  }

  componentWillReceiveProps (nextProps) {
    //const { insights } = nextProps.viewer;
    //const thisInsights = this.props.viewer.insights;

    /*if ( insights.edges.length != thisInsights.edges.length ) {
     this.state.listInsights = insights.edges;
     }*/
    //if (insights.edges.length === 0) {
    //  this.props.navigator.resetTo({
    //    scene: 'insights',
    //    filter: 'UNRATED',
    //  })
    //}
  }

  componentWillMount() {
    const { viewer } = this.props
    this.setState({
      listInsights: viewer.insights.edges,
      dataSource: dataSource.cloneWithRows(viewer.insights.edges),
    })
  }

  _onEndReached() {
    const { relay, viewer } = this.props;
    let pageNext = viewer.insights.pageInfo;
    let count = relay.variables.count;

    if ( !pageNext || !pageNext.hasNextPage ) {
      return;
    }

    this.setState({ isLoadingTail: true });
    relay.setVariables({ count: count + this.PAGE_SIZE }, (transaction) => {
      if ( transaction.done ) this.setState({ isLoadingTail: false })
    });
  }

  renderHeader () {
    return null;
  }

  handleItWorksPress(insight, topic) {
    console.log({ insight, topic })
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
    const { likeInsightInTopic } = tran;
    const listInsights = [ ...this.state.listInsights ];
    listInsights.forEach((item) => {
      if ( item.node.id == likeInsightInTopic.insight.id ) {
        item.node.like = true;
        item.node.dislike = false;
      }
    });

    this.setState({
      listInsights: [ ...listInsights ],
      random: (Math.random(1000) * 100).toString(16)
    });
  }

  filterDisLike (tran) {
    const { dislikeInsightInTopic } = tran;
    const listInsights = [ ...this.state.listInsights ];
    listInsights.forEach((item) => {
      if ( item.node.id == dislikeInsightInTopic.insight.id ) {
        item.node.dislike = true;
        item.node.like = false;
        return item.node;
      }
    });

    this.setState({
      listInsights: [ ...listInsights ],
      random: (Math.random(1000) * 100).toString(16)
    });
  }

  _renderInsight(rowData, sectionID, rowID) {
    return (
      <InsightRate
        key={rowID}
        insight={rowData.node}
        fontSize={20}
        itWorks={() => this.handleItWorksPress(rowData.node, rowData.topic)}
        didNotWork={() => this.handleDidNotWorkPress(rowData.node, rowData.topic)}
        onPressCard={this._onPressCard}
        />
    )
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    const { viewer } = this.props
    const {
      scrollEnabled,
      isLoadingTail,
      listInsights,
    } = this.state;
    const { edges } = viewer.insights
    if (edges.length === 0) {
      return (
        <Loader />
      )
    }
    const _scroll = ScrollHandler.bind(this, {
      isLoadingTail,
      callback: this._onEndReached,
      onEndReachedThreshold: 16
    });
    return (
      <View style={ styles.container }>
        <ScrollView
          onScroll={_scroll}
          ref="_scrollView"
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={16}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={true}>
          <ButtonsBoris />
          <ListView
            enableEmptySections={true}
            dataSource={dataSource.cloneWithRows(listInsights)}
            renderRow={(rowData, sectionID, rowID) => this._renderInsight(rowData, sectionID, rowID)}
            isLoadingTail={isLoadingTail}
            renderHeader={this.renderHeader}
            style={[styles.scroll, {paddingTop: device.size(220)}]}
            />
        </ScrollView>
      </View>
    )
  }
}

const ButtonsBoris = props => (
  <View style={styles.borisContainer}>
    <Boris mood="positive" size="small" note={BORIS_NOTE}/>
  </View>
)

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
