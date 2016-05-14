import React, { Component } from 'react-native'
import Relay from 'react-relay'
import Loader  from '../components/loader'

class StarterScene extends Component {

  componentDidMount() {
    const { viewer, navigator } = this.props
    const { followups, questions } = viewer
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
        title: '',
      })
      return
    }
    navigator.push({
      scene: 'insights',
      title: '',
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
  initialVariables: {
    count: 100,
    filter: 'FOLLOWUPS',
  },
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
