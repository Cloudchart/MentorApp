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
import { Boris, Button, ScrollListView, Insight } from '../../components'
import UserInsightCard from './insight-card'
import Empty from './empty'
import { insightFragment } from '../insights/insight-card'
import styles from './style'

const BORIS_NOTE_FOR_USEFUL = 'Hello superman! How is going?'
const BORIS_NOTE_FOR_USELESS = 'Today what do you think about that?'

class UserInsightsScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isScrollEnabled: true,
    }
  }

  componentWillMount() {
    // 5. User Insights: displays only first 3 from preview
    this.mountedAt = new Date()
  }

  shouldComponentUpdate(props) {
    if (Date.now() - this.mountedAt < 300) {
      return false
    }
    return true
  }

  handleSwipeStart() {
    if (!this.state.isScrollEnabled) return;
    this.setState({
      isScrollEnabled: false,
    })
  }

  handleSwipeEnd() {
    if (this.state.isScrollEnabled) return;
    this.setState({
      isScrollEnabled: true,
    })
  }

  _forceFetch() {
    const { relay } = this.props
    relay.forceFetch()
    // @todo update prev screen { user collections }
    // EventManager.emit(UPDATE_COLLECTIONS)
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
    if (insights.edges.length === 0) {
      return (
        <Empty filter={filter} />
      )
    }
    const finalDescription = description || ''
    return (
      <View style={styles.container}>
        <ScrollView
          automaticallyAdjustContentInsets={true}
          scrollEnabled={isScrollEnabled}
          showsVerticalScrollIndicator={true}
          >
          {finalDescription !== '' && (
            <View style={styles.borisContainerInList}>
              <Boris
                mood="positive"
                size="small"
                note={finalDescription.trim()}
                />
            </View>
          )}
          <View style={[styles.scroll, { position: 'relative' }]}>
            {this._renderList()}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Relay.createContainer(UserInsightsScene, {
  initialVariables: {
    filter: 'USEFUL',
  },
  fragments: {
    node: () => Relay.QL`
      fragment on UserCollection {
        id
        description
        insights(first: 100, filter: $filter) {
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
