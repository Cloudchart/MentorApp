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
} from "react-native";
import Relay from 'react-relay';
import { Boris, Button, Loader, ScrollListView, TopicEmpty } from "../../components";
import styles from "./style";
import { _flex } from "../../styles/base";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class ExploreTopics extends Component {

  state = {
    loader: true,
    isLoadingTail: false,
    showConfirmation: false
  }

  constructor (props) {
    super(props)
    this.PAGE_SIZE = 30;

    this._onEndReached = this._onEndReached.bind(this)
  }

  componentDidMount () {

  }


  /**
   * choice of topic and set it as the main
   * @param topic
   * @private
   */
  _selectTopic (topic) {
    const { navigator } = this.props;

    setTimeout(()=> {
      navigator.push({
        scene: 'advice_for_me',
        title: topic.name,
        topicId: topic.id,
        filter: 'PREVIEW'
      })
    }, 0)
  }


  _onEndReached () {
    const { relay, viewer } = this.props;
    let pageNext = viewer.topics.pageInfo;
    let count = relay.variables.count;

    if ( !pageNext || !pageNext.hasNextPage ) {
      return;
    }

    this.setState({ isLoadingTail: true })
    relay.setVariables({ count: count + this.PAGE_SIZE }, (transaction) => {
      if ( transaction.done ) this.setState({ isLoadingTail: false })
    });
  }

  subscribeNow () {
    const { navigator } = this.props;
    navigator.push({
      scene: 'subscription',
      title: 'Subscription'
    })
  }

  _renderTopic (rowData, sectionID, rowID) {
    const { viewer } = this.props;
    const topic = rowData.node;

    return (
      <TopicEmpty
        topic={ topic }
        user={ this.props.viewer }
        index={ rowID }
        selectTopic={this._selectTopic.bind(this, topic)}/>
    )
  }

  render () {
    const { viewer } = this.props;
    const { isLoadingTail } = this.state;

    const topics = viewer.topics.edges.filter((topic)=>
      !topic.node.isSubscribedByViewer
    )

    return (
      <View style={styles.container}>
        <ScrollListView
          dataSource={dataSource.cloneWithRows(topics)}
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



export default Relay.createContainer(ExploreTopics, {
  initialVariables: {
    count: 30
  },
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            ${TopicEmpty.getFragment('user')}      
            topics(first: $count) {
                availableSlotsCount
                edges {
                    node {
                        id
                        name
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
