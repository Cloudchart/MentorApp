import React, {
  Component,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ListView
} from 'react-native'
import Relay from 'react-relay'
import { Boris, Button, Loader, ScrollListView } from '../../components'
import TopicEmpty from '../../components/topic/topic-empty.js'
import styles from './style'
import { _flex } from '../../styles/base'
import {
  unsubscribeFromTopic,
  subscribeOnTopic
} from '../../actions/topic'

const PAGE_SIZE = 30
const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class ReplaceTopic extends Component {

  static defaultProps = {
    newTopic: null
  }

  state = {
    loader: true,
    isLoadingTail: false,
    showConfirmation: false
  }

  constructor (props) {
    super(props)

    this._onEndReached = this._onEndReached.bind(this)
  }

  componentDidMount () {

  }


  /**
   * choice of topic and set it as the main
   * @param topic
   * @private
   */
  _replaceTopic (topicReplace) {
    const { viewer, navigator, topic, popToTop } = this.props;

    if ( topicReplace.isSubscribedByViewer ) {
      unsubscribeFromTopic({ topic: topicReplace, user: viewer })
        .then(()=> {
          if ( !topic.isSubscribedByViewer ) {
            subscribeOnTopic({ topic, user: viewer })
              .then(()=> {
                setTimeout(()=> {
                  if(popToTop == 'pop'){
                    navigator.pop();
                  } else {
                    navigator.popToTop();
                  }
                }, 400)
              })
          }
        })
    }
  }


  _onEndReached () {
    const { relay, viewer } = this.props;
    let pageNext = viewer.subscribedTopics.pageInfo;
    let count = relay.variables.count;

    if ( !pageNext || !pageNext.hasNextPage ) {
      return;
    }

    this.setState({ isLoadingTail: true })
    relay.setVariables({ count: count + this.PAGE_SIZE }, (transaction) => {
      if ( transaction.done ) this.setState({ isLoadingTail: false })
    });
  }

  _renderTopic (rowData, sectionID, rowID) {
    const { viewer } = this.props
    return (
      <TopicEmpty
        topic={ rowData.node }
        user={ this.props.viewer }
        index={ rowID }
        onTopicSelect={topic => this._replaceTopic(rowData.node)}/>
    )
  }

  render () {
    const { viewer } = this.props;
    const { isLoadingTail } = this.state;

    return (
      <View style={styles.container}>
        <ScrollListView
          dataSource={dataSource.cloneWithRows(viewer.subscribedTopics.edges)}
          renderRow={(rowData, sectionID, rowID) => this._renderTopic(rowData, sectionID, rowID)}
          pageSize={30}
          isLoadingTail={isLoadingTail}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={20}
          showsVerticalScrollIndicator={false}
          style={ _flex}
        />
      </View>
    )
  }
}



export default Relay.createContainer(ReplaceTopic, {
  initialVariables: {
    count: PAGE_SIZE,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        ${TopicEmpty.getFragment('user')}
        subscribedTopics: topics(first: $count, filter: SUBSCRIBED) {
          availableSlotsCount
          edges {
            node {
              id
              isSubscribedByViewer
              ${TopicEmpty.getFragment('topic')}
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `
  }
});
