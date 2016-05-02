import React, {
  Component,
  StyleSheet,
  View,
} from 'react-native'

import Relay from 'react-relay'

import Topic from '../scenes/Topic'
import TopicsList from '../scenes/TopicsList'


class Main extends Component {

  render() {
    return (
      <View style={ styles.container }>
        <TopicsList user={ this.props.viewer } topics={ this.props.viewer.topics.edges.map(edge => edge.node) } />
        <View style={{ height: 10 }}></View>
        <TopicsList user={ this.props.viewer } topics={ this.props.viewer.subscribedTopics.edges.map(edge => edge.node) } />
      </View>
    )
  }

}


const styles = StyleSheet.create({

  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingTop: 64,
  },

})


export default Relay.createContainer(Main, {

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${Topic.getFragment('user')}

        topics(first: 100, filter: DEFAULT) {
          edges {
            node {
              ${Topic.getFragment('topic')}
            }
          }
        }

        subscribedTopics: topics(first: 100, filter: SUBSCRIBED) {
          edges {
            node {
              ${Topic.getFragment('topic')}
            }
          }
        }
      }
    `,
  }

})
