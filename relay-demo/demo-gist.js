import React from 'react'
import Relay from 'react-relay'
import moment from 'moment'

import NodeRoute from 'routes/NodeRoute'
import LikeInsightInTopicMutation from 'mutations/LikeInsightInTopic'

class InsightOriginComponent extends React.Component {
  render() {
    return (
      <div>
        <em>
          <a href={ this.props.node.origin.url }>
            {
              [
                this.props.node.origin.author,
                this.props.node.origin.title
              ]
                .filter(part => !!part)
                .join(', ')
            }
          </a>
          , { moment.duration(this.props.node.origin.duration, 'seconds').humanize() }  read
        </em>
      </div>
    )
  }
}

let InsightOrigin = Relay.createContainer(InsightOriginComponent, {

  fragments: {
    node: () => Relay.QL`
      fragment on Insight {
        origin {
          author
          url
          title
          duration
        }
      }
    `
  }

})


class Insight extends React.Component {


  constructor(props) {
    super(props)

    this.state = {
      showOrigin: false
    }
  }

  onLikeRequest = (event) => {
    event.preventDefault()
    let mutation = new LikeInsightInTopicMutation({
      topic: this.props.insight.topic,
      insight: this.props.insight.node,
      user: this.props.user,
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => {
        this.props.showReaction(this.props.insight.node.likeReaction && this.props.insight.node.likeReaction.content)
      },
      onFailure: () => console.log('failure')
    })
  }

  onDisikeRequest = (event) => {
    event.preventDefault()
  }


  onInsightOriginRequest = () => {
    this.setState({
      showOrigin: !this.state.showOrigin
    })
  }


  render = () => {
    return (
      <div style={{ margin: 20, width: 400 }}>
        <strong>{ this.props.insight.topic.name }</strong>
        <div onClick={ this.onInsightOriginRequest } style={{ cursor: 'pointer' }}>
          { this.props.insight.node.content }
          { this._renderOrigin() }
        </div>
        <a href="#" onClick={ this.onLikeRequest }>Like</a>
        &nbsp;
        <a href="#" onClick={ this.onDislikeRequest }>Disike</a>
      </div>
    )
  }

  _renderOrigin = () => {
    if (!this.state.showOrigin) return
    return <Relay.RootContainer Component={ InsightOrigin } route={ new NodeRoute({ id: this.props.insight.node.id }) } />
  }

}

let InsightContainer = Relay.createContainer(Insight, {

  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id
        ${ LikeInsightInTopicMutation.getFragment('user') }
      }
    `,
    insight: () => Relay.QL`
      fragment on UserInsightsEdge {
        topic {
          ${ LikeInsightInTopicMutation.getFragment('topic') }
          id
          name
        }
        node {
          ${ LikeInsightInTopicMutation.getFragment('insight') }
          id
          content
          likeReaction {
            content
          }
          dislikeReaction {
            content
          }
        }
      }
    `
  }

})


class CounterComponent extends React.Component {
  render = () =>
    <div>
      Useful insights: {
      this.props.viewer.collections.edges.reduce((memo, collectionEdge) => {
        return memo + collectionEdge.node.insights.usefulCount
      }, 0)
    }
    </div>
}

let Counter = Relay.createContainer(CounterComponent, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        collections(first: 100) {
          edges {
            node {
              insights {
                usefulCount
              }
            }
          }
        }
      }
    `
  }
})


class Favorites extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      reaction: null
    }
  }

  render = () =>
    <div>
      { this._renderUsefulInsightsCount() }
      { this._renderInsight() }
      { this._renderReaction() }
    </div>

  _renderUsefulInsightsCount = () =>
    <Counter viewer={ this.props.viewer } />

  _renderInsight = () => {
    if (this.state.reaction) return
    let insightEdge = this.props.viewer.insights.edges[0]
    if (!insightEdge) return
    return <InsightContainer
      insight={ insightEdge }
      user={ this.props.viewer }
      showReaction = { (reaction) => this.setState({ reaction }) }
      />
  }

  _renderReaction = () => {
    if (!this.state.reaction) return
    return (
      <div>
        <em>
          { this.state.reaction }
        </em>
        <br />
        <button onClick={ () => this.setState({ reaction: null }) }>Continue</button>
      </div>
    )
  }

}


export default Relay.createContainer(Favorites, {

  fragments: {

    viewer: () => Relay.QL`
      fragment on User {
        ${InsightContainer.getFragment('user')}
        ${Counter.getFragment('viewer')}
        insights(filter: UNRATED, first: 100) {
          edges {
            ${InsightContainer.getFragment('insight')}
          }
        }
      }
    `

  }

})
