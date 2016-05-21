import React, { Component } from 'react-native'
import Relay from 'react-relay'
import Loader from '../../components/loader'
import {
  TopicFinished,
  AllForNow,
  AllEnded,
} from '../../components/confirmation-screens/insights-parts'
import InsightCard, {
  userFragment,
  topicFragment,
  insightFragment,
  reactionsFragment,
} from './insight-card'

class InsightsScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isTopicFinished: null,
    }
  }

  handleTopicFinish() {
    // Sometimes we can submit mutation and change scene immediately
    try {
      this.setState({
        isTopicFinished: true,
      })
    } catch (e) {
      // nothing
    }
  }

  render() {
    const { filter, viewer, navigator } = this.props
    const { isTopicFinished } = this.state
    const { subscribedTopics, insights } = viewer
    console.log('insights-scene: found ' + insights.edges.length + ' available insights.', {
      insights,
      subscribedTopics,
    })
    let isAllEnded = true
    subscribedTopics.edges.forEach(({ node }) => {
      if (!node.isFinishedByViewer) {
        isAllEnded = false
      }
    })
    if (isAllEnded) {
      return (
        <AllEnded
          navigator={navigator}
          />
      )
    }
    if (isTopicFinished) {
      return (
        <TopicFinished
          navigator={navigator}
          continueLearning={() => this.setState({ isTopicFinished: false })}
          />
      )
    }
    const isAllForNow = (insights.edges.length === 0)
    if (isAllForNow) {
      return (
        <AllForNow
          navigator={navigator}
          />
      )
    }
    const firstInsight = insights.edges[0]
    if (firstInsight) {
      return (
        <InsightCard
          filter={filter}
          navigator={navigator}
          user={viewer}
          topic={firstInsight.topic}
          insight={firstInsight.node}
          handleTopicFinish={() => this.handleTopicFinish()}
          />
      )
    }
    return (
      <Loader />
    )
  }
}

export default Relay.createContainer(InsightsScene, {
  initialVariables: {
    count: 100,
    filter: 'UNRATED',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${userFragment}
        insights(first: $count, filter: $filter)  {
          edges {
            node {
              ${insightFragment}
              ${reactionsFragment}
            }
            topic {
              ${topicFragment}
              isFinishedByViewer
            }
          }
        }
        subscribedTopics: topics(first: 1, filter: SUBSCRIBED) {
          edges {
            node {
              id
              isFinishedByViewer
            }
          }
        }
      }
    `,
  },
})
