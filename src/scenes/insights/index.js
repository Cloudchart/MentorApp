import React, { Component } from 'react-native'
import Relay from 'react-relay'
import { _ } from 'lodash'
import { Loader } from '../../components'
import {
  TopicFinished,
  AllForNow,
  AllEnded,
} from '../../components/confirmation-screens/insights-parts'
import InsightCardContainer from './insight-card'
import styles from './styles'

class InsightsScene extends Component {

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
    const { viewer, navigator } = this.props
    const { isTopicFinished } = this.state
    console.log('insights-scene: found ' + viewer.insights.edges.length + ' available insights.')
    let isAllEnded = true
    viewer.subscribedTopics.edges.forEach(edge => {
      if (!edge.node.isTopicFinished) {
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
    const isAllForNow = (viewer.insights.edges.length === 0)
    if (isAllForNow) {
      return (
        <AllForNow
          navigator={navigator}
          />
      )
    }
    const firstInsight = viewer.insights.edges[0]
    if (firstInsight) {
      return (
        <InsightCardContainer
          navigator={navigator}
          insight={firstInsight}
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

export default Relay.createContainer(InsightsScene, {
  initialVariables: {
    count: 100,
    filter: 'UNRATED',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${InsightCardContainer.getFragment('user')}
        insights(first: $count, filter: $filter)  {
          edges {
            ${InsightCardContainer.getFragment('insight')}
            topic {
              isFinishedByViewer
            }
          }
        }
        subscribedTopics: topics(first: 1, filter: SUBSCRIBED) {
          edges {
            node {
              isFinishedByViewer
            }
          }
        }
      }
    `,
  },
})
