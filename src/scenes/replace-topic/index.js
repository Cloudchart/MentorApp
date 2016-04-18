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

class ReplaceTopic extends Component {

  static defaultProps = {
    newTopic : null
  }

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
  _replaceTopic (topic) {
    const { navigator } = this.props;


    /*setTimeout(()=> {
      navigator.push({
        scene: 'advice_for_me',
        title: topic.name,
        topicId: topic.id,
        filter : 'PREVIEW'
      })
    }, 0)*/
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

    return (
      <TopicEmpty
        topic={ rowData.node }
        user={ this.props.viewer }
        index={ rowID }
        selectTopic={this._replaceTopic.bind(this, rowData.node)}/>
    )
  }

  render () {
    const { viewer } = this.props;
    const { isLoadingTail } = this.state;

    return (
      <View style={styles.container}>
        <ScrollListView
          dataSource={dataSource.cloneWithRows(viewer.topics.edges)}
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
    count: 30
  },
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            ${TopicEmpty.getFragment('user')}      
            topics(first: $count) {
                edges {
                    node {
                        id
                        name
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
