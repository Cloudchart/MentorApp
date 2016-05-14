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
import { Boris, Button, ScrollListView, InsightRate } from '../../components'
import { ScrollHandler } from '../../utils/animation'
import Loader  from '../../components/loader'
import { likeInsightInTopic, dislikeInsightInTopic } from '../../actions/insight'
import { insightFragment } from '../insights/insight-card'
import styles from './../user-insights/style'
import * as device from '../../utils/device'

const BORIS_NOTE =
  'Hello, master. I sincerely hope you\'ve put these advices to work. ' +
  'Now review them: did they work for you?'

class FollowUpScene extends Component {

  constructor(props) {
    super(props)
    this.PAGE_SIZE = 30;
    this.saveTimeout = null;

    this._onEndReached = this._onEndReached.bind(this);
    this.filterLike = this.filterLike.bind(this);
    this.filterDisLike = this.filterDisLike.bind(this);

    this.state = {
      listInsights: [],
      is_empty: false,
      scrollEnabled: true,
      isLoadingTail: false,
      random: (Math.random(1000) * 100).toString(16),
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
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
    const { viewer } = this.props;
    this.state.listInsights = viewer.insights.edges;
    this.state.dataSource = this.state.dataSource.cloneWithRows(this.state.listInsights);
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

  _itWorks(insight) {
    likeInsightInTopic(insight, true).then(this.filterLike);
  }

  _didNotWork(insight) {
    dislikeInsightInTopic(insight).then(this.filterDisLike);
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

  _renderInsight (rowData, sectionID, rowID) {
    console.log(rowData.node, 'rowData.node');
    return (
      <InsightRate
        key={rowID}
        insight={rowData.node}
        fontSize={20}
        itWorks={this._itWorks.bind(this, rowData)}
        didNotWork={this._didNotWork.bind(this, rowData)}
        onPressCard={this._onPressCard}/>
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
      is_empty,
      isLoadingTail,
      listInsights,
      dataSource
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
