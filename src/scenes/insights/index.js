import React, { Component } from 'react-native'
import Relay from 'react-relay'
import { _ } from 'lodash'
import { Loader } from '../../components'
import {
  CommentGood,
  CommentBad,
  TopicFinished,
  AllForNow,
  AllEnded,
} from '../../components/confirmation-screens/insights-parts'
import InsightForMeContainer from './insight-for-me'
import styles from './style'

class InsightsScene extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      reaction: null,
      isTopicFinished: null,
    }
  }

  handleNextInsight() {
    const { reaction } = this.state
    //this._checkTopicForFinish()
    if (reaction && reaction.rate_checkTopicForFinish === 'like') {
      this._reactionCallback && this._reactionCallback()
    }
    this.setState({
      reaction: null,
    })
  }

  handleUndoRate() {
    this.setState({
      reaction: null,
    })
    this._reactionCallback && this._reactionCallback(true)
  }

  handleReaction(reaction, callback) {
    this.setState({
      reaction
    })
    this._reactionCallback = callback
  }

  render() {
    const { viewer, navigator, filter } = this.props
    const { reaction, isTopicFinished } = this.state
    if (reaction) {
      if (reaction.type === 'like') {
        return (
          <CommentGood
            {...reaction}
            navigator={navigator}
            handleNext={() => this.handleNextInsight()}
            />
        )
      }
      // Otherwise it means dislike
      return (
        <CommentBad
          {...reaction}
          navigator={navigator}
          handleNext={() => this.handleNextInsight()}
          handleUndo={() => this.handleUndoRate()}
          />
      )
    }
    if (isTopicFinished) {
      let isNotAllFinished = false
      viewer.subscribedTopics.edges.forEach(edge => {
        if (!edge.node.isTopicFinished) {
          isNotAllFinished = true
        }
      })
      if (isNotAllFinished) {
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
      // Otherwise it seems the end
      return (
        <AllForNow
          navigator={navigator}
          />
      )
    }
    const firstInsight = viewer.insights.edges[0]
    if (firstInsight) {
      return (
        <InsightForMeContainer
          navigator={navigator}
          insight={firstInsight}
          user={viewer}
          handleReaction={(reaction, callback) => this.handleReaction(reaction, callback)}
          handleTopicFinish={() => this.setState({ isTopicFinished: true })}
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
    insightsCount: 100,
    insightsFilter: 'UNRATED',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${InsightForMeContainer.getFragment('user')}

        insights(first: $insightsCount, filter: $insightsFilter)  {
          edges {
            ${InsightForMeContainer.getFragment('insight')}
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
