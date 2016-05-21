import React, { Component } from 'react-native'
import Relay from 'react-relay'
import Loader from '../../components/loader'
import AddTopic from './add-topic'
import ReplaceTopic from './replace-topic'
import Subscription from './subscription'
import InsightCard, {
  userFragment,
  topicFragment,
  insightFragment,
} from '../insights/insight-card'
import SubscribeOnTopicMutation from '../../mutations/subscribe-on-topic'

class ExploreInsightsScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isPending: false,
      isAddTopicSelected: false,
      isPaidPlan: false,
    }
  }

  handleAddTopicPress() {
    const { viewer, node } = this.props
    const { availableSlotsCount } = viewer.topics
    if (availableSlotsCount > 0) {
      this.setState({
        isPending: true,
      })
      const mutation = new SubscribeOnTopicMutation({
        user: viewer,
        topic: node,
      })
      Relay.Store.commitUpdate(mutation, {
        onSuccess: () => {
          this.setState({
            isPending: false,
          })
          this.props.navigator.push({
            scene: 'settings',
            title: 'Settings',
          })
        },
        onFailure: () => {
          this.setState({
            isPending: false,
          })
        }
      })
      return
    }
    this.setState({
      isAddTopicSelected: true,
    })
  }

  handleCancelPress() {
    this.props.navigator.push({
      scene: 'explore-topic',
      title: 'Explore',
    })
  }

  handleSubscribePress() {
    this.props.navigator.push({
      scene: 'subscription',
      title: 'Subscription',
    })
  }

  handleReplaceTopicPress() {
    this.props.navigator.push({
      scene: 'replace-topic',
      title: 'Replace one of yours topics:',
      topic: this.props.node,
    })
  }

  _renderAddWizard() {
    const { isAddTopicSelected, isPaidPlan } = this.state
    if (isAddTopicSelected === false) {
      return (
        <AddTopic
          onConfirmPress={() => this.handleAddTopicPress()}
          onCancelPress={() => this.handleCancelPress()}
          />
      )
    }
    if (isPaidPlan === false) {
      return (
        <Subscription
          onConfirmPress={() => this.handleSubscribePress()}
          onCancelPress={() => this.handleReplaceTopicPress()}
        />
      )
    }
    return (
      <ReplaceTopic
        onConfirmPress={() => this.handleReplaceTopicPress()}
        />
    )
  }

  render() {
    const { filter, viewer, node, navigator } = this.props
    const { isPending } = this.state
    console.log('explore-insights-scene: found ' + node.insights.edges.length + ' available insights.')
    if (isPending) {
      return (
        <Loader />
      )
    }
    const isAllViewed = (node.insights.edges.length === 0)
    if (isAllViewed) {
      return this._renderAddWizard()
    }
    const firstInsight = node.insights.edges[0]
    return (
      <InsightCard
        filter={filter}
        navigator={navigator}
        topic={node}
        insight={firstInsight.node}
        user={viewer}
        />
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
        topics {
          availableSlotsCount
        }
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
