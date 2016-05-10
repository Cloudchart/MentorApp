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
    const { viewer, node, navigator } = this.props
    console.log('explore-insights-scene: found ' + node.insights.edges.length + ' available insights.')
    const firstInsight = node.insights.edges[0]
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

export default Relay.createContainer(ExploreInsightsScene, {
  initialVariables: {
    count: 100,
    filter: 'PREVIEW',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${InsightCardContainer.getFragment('user')}
      }
    `,
    node: () => Relay.QL`
      fragment on Topic {
        insights(first: $count, filter: $filter)  {
          edges {
            node {
              ${InsightCardContainer.getFragment('insight')}
            }
          }
        }
      }
    `
  },
})
