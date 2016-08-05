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
import LikeInsightInPreviewMutation from '../../mutations/like-insight-in-preview'
import DislikeInsightInPreviewMutation from '../../mutations/dislike-insight-in-preview'

class ExploreInsightsScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isPending: false,
      isAddTopicSelected: false,
      isPaidPlan: false,
      insightIndex: 0,
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

  handleInsightLike() {
    const { viewer, node } = this.props
    const { insightIndex } = this.state
    const insightEdge = node.insights.edges[insightIndex]
    if (!insightEdge) return;
    this.setState({
      insightIndex: insightIndex + 1,
    })
    const mutation = new LikeInsightInPreviewMutation({
      user: viewer,
      topic: node,
      insight: insightEdge.node,
    })
    Relay.Store.commitUpdate(mutation);
  }

  handleInsightDislike() {
    const { viewer, node } = this.props
    const { insightIndex } = this.state
    const insightEdge = node.insights.edges[insightIndex]
    this.setState({
      insightIndex: insightIndex + 1,
    })
    const mutation = new DislikeInsightInPreviewMutation({
      user: viewer,
      topic: node,
      insight: insightEdge.node,
    })
    Relay.Store.commitUpdate(mutation);
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
    const { isPending, insightIndex } = this.state
    console.log('explore-insights-scene: found ' + node.insights.edges.length + ' available insights.')
    if (isPending) {
      return (
        <Loader />
      )
    }
    const isAllViewed = (insightIndex >= node.insights.edges.length)
    if (isAllViewed) {
      return this._renderAddWizard()
    }
    const firstInsight = node.insights.edges[insightIndex]
    return (
      <InsightCard
        filter={filter}
        navigator={navigator}
        topic={node}
        insight={firstInsight.node}
        onLike={() => this.handleInsightLike()}
        onDislike={() => this.handleInsightDislike()}
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
