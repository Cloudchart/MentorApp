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
  PanResponder,
} from 'react-native'
import Relay from 'react-relay'
import { EventManager } from '../../event-manager'
import { connect } from 'react-redux'
import { Boris, Button, ScrollListView, Insight } from '../../components'
import UserInsightCard from './insight-card'
import Empty from './empty'
import {
  SET_CURRENT_COLLECTION,
  UPDATE_COLLECTIONS,
  UPDATE_ADVICES_COLLECTIONS,
} from '../../actions/application'
import { insightFragment } from '../insights/insight-card'
import styles from './style'

const BORIS_NOTE_FOR_USEFUL = 'Hello superman! How is going?'
const BORIS_NOTE_FOR_USELESS = 'Today what do you think about that?'

class UserInsightsScene extends Component {
  //state = {
  //  listInsights: [],
  //  is_empty: false,
  //  isScrollEnabled: true,
  //  isLoadingTail: false,
  //  addControlShow: false,
  //  pan: new Animated.ValueXY(),
  //  enter: new Animated.Value(0.9),
  //  dataSource: new ListView.DataSource({
  //    rowHasChanged: (row1, row2) => row1 !== row2
  //  })
  //}
  constructor(props, context) {
    super(props, context)
    this.state = {
      isScrollEnabled: true,
    }
  }
    //this.saveTimeout = null
    //this._onSwipeStart = this._onSwipeStart.bind(this)
    //this._opacityOff = this._opacityOff.bind(this)
    //this._forceFetch = this._forceFetch.bind(this)

    //EventManager.addListener(UPDATE_ADVICES_COLLECTIONS, this._forceFetch)
  //}

  //componentWillReceiveProps(nextProps) {
  //  const { insightsUseful } = nextProps.node
  //  const thisUseful = this.props.node.insightsUseful
  //  if (insightsUseful.edges.length != thisUseful.edges.length) {
  //    this._updateBasket(nextProps)
  //    this.state.listInsights = insightsUseful.edges
  //  }
  //}
  //
  //componentWillMount() {
  //  const { insightsUseful } = this.props.node
  //  this.state.listInsights = insightsUseful.edges
  //  this.state.dataSource = this.state.dataSource.cloneWithRows(this.state.listInsights)
  //  this._updateBasket(this.props)
  //}
  //
  //componentWillUnmount() {
  //  EventManager.removeListener(UPDATE_ADVICES_COLLECTIONS, this._forceFetch)
  //  this.saveTimeout = null
  //}

  /**
   * update the basket in navBar
   */
  //_updateBasket (nextProps) {
  //  clearTimeout(this.saveTimeout)
  //  this.saveTimeout = setTimeout(() => {
  //    const { dispatch } = this.props
  //    dispatch({ type: SET_CURRENT_COLLECTION, collection: nextProps.node })
  //  }, 66)
  //}

  handleSwipeStart() {
    this.setState({
      isScrollEnabled: false,
    })
  }

  handleSwipeEnd() {
    this.setState({
      isScrollEnabled: true,
    })
  }

  _forceFetch () {
    const { relay } = this.props
    relay.forceFetch()
    // @todo update prev screen { user collections }
    EventManager.emit(UPDATE_COLLECTIONS)
  }

  _renderList() {
    const { node, navigator, filter } = this.props
    const { edges } = node.insights
    return edges.map((insight, index) => (
      <UserInsightCard
        key={index}
        collection={node}
        opacityOff={this._opacityOff}
        insight={insight.node}
        navigator={navigator}
        type={filter}
        onSwipeStart={() => this.handleSwipeStart()}
        onSwipeEnd={() => this.handleSwipeEnd()}
        forceFetch={() => this._forceFetch}
        />
    ))
  }

  render() {
    const { node, filter } = this.props
    const { isScrollEnabled } = this.state
    const { description, insights } = node
    if (insights.length === 0) {
      return (
        <Empty />
      )
    }
    let note = description
    if (!note) {
      note = (filter === 'USEFUL') ? BORIS_NOTE_FOR_USEFUL : BORIS_NOTE_FOR_USELESS
    }
    return (
      <View style={styles.container}>
        <ScrollView
          automaticallyAdjustContentInsets={true}
          scrollEnabled={isScrollEnabled}
          showsVerticalScrollIndicator={true}
          >
          <ButtonsBoris note={note} />
          <View style={styles.scroll}>
            {this._renderList()}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const ButtonsBoris = ({ note }) => (
  <View style={styles.borisContainer}>
    <Boris
      mood="positive"
      size="small"
      note={note.trim()}
      />
  </View>
)

//const ReduxComponent = connect()(UserInsightsUseful)
export default Relay.createContainer(UserInsightsScene, {
  initialVariables: {
    count: 100,
    filter: 'USEFUL',
  },
  fragments: {
    node: () => Relay.QL`
      fragment on UserCollection {
        id
        description
        insights(first: $count, filter: $filter) {
          usefulCount
          uselessCount
          edges {
            node {
              ${insightFragment}
            }
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  },
})
