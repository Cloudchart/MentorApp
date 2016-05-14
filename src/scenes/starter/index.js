import React, { Component } from 'react-native'
import Relay from 'react-relay'
import Loader  from '../../components/loader'

const ONE_DAY = 24 * 60 * 60 * 1000

class StarterScene extends Component {

  componentDidMount() {
    const { isFirstLaunch, previousBackgroundTime, viewer, navigator } = this.props
    const { followups, questions } = viewer
    if (isFirstLaunch) {
      navigator.push({
        scene: 'welcome',
        title: 'Virtual Mentor',
      })
      return
    }
    if (previousBackgroundTime && Date.now() - previousBackgroundTime > ONE_DAY) {
      navigator.push({
        scene: 'return-to-app',
      })
      return
    }
    if (followups.edges.length > 0) {
      navigator.push({
        scene: 'follow-up',
        title: 'Rate used advice',
      })
      return
    }
    if (questions.edges.length > 0) {
      navigator.push({
        scene: 'questionnaire',
      })
      return
    }
    // Default route
    navigator.resetTo({
      scene: 'insights',
      filter: 'UNRATED',
    })
  }

  render() {
    return (
      <Loader />
    )
  }
}

export default Relay.createContainer(StarterScene, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        followups: insights(first: 1, filter: FOLLOWUPS)  {
          edges {
            node {
              id
            }
          }
        }
        questions(first: 1, filter: UNANSWERED) {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
  },
})
