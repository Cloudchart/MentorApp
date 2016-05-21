import React, { Component } from 'react-native'
import Relay from 'react-relay'
import Loader from '../../components/loader'
import InsightCard, {
  userFragment,
  topicFragment,
  insightFragment,
} from '../insights/insight-card'

class ExploreInsightsScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isTopicFinished: null,
    }
  }

  handleTopicFinish() {
    try {
      this.setState({ isTopicFinished: true })
    } catch (e) {
      // Sometimes we can submit mutation and change scene
    }
  }

  render() {
    const { filter, viewer, node, navigator } = this.props
    console.log('explore-insights-scene: found ' + node.insights.edges.length + ' available insights.')
    const firstInsight = node.insights.edges[0]
    console.log({ node, firstInsight })
    if (firstInsight) {
      return (
        <InsightCard
          filter={filter}
          navigator={navigator}
          topic={node}
          insight={firstInsight.node}
          user={viewer}
          handleTopicFinish={() => this.handleTopicFinish()}
        />
      )
    }
    return (
      <Loader />
    )
  }
}

export default Relay.createContainer(ExploreInsightsScene, {
  initialVariables: {
    count: 100,
    filter: 'PREVIEW',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${userFragment}
      }
    `,
    node: () => Relay.QL`
      fragment on Topic {
        ${topicFragment}
        insights(first: 100, filter: $filter)  {
          edges {
            node {
              ${insightFragment}
            }
          }
        }
      }
    `,
  },
})
