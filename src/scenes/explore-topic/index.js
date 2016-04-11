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
import { connect } from "react-redux";

import { Boris, Button, Loader, ScrollListView, TopicEmpty } from "../../components";
import styles from "./style";
import { _flex } from "../../styles/base";
import { SET_ROOT_TOPIC } from "../../actions/actions";


const BorisNoteForSubscription = "Don’t restrain yourself with 3 topics, meatb… Master. Subscribe and unlock the full power of your Virtual Mentor!";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class ExploreTopics extends Component {

  constructor (props) {
    super(props)

    this.state = {
      loader: true,
      isLoadingTail: false,
      showConfirmation: false
    };

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
    const { navigator, dispatch } = this.props;

    dispatch({
      type: SET_ROOT_TOPIC,
      topic: topic
    })

    setTimeout(()=> {
      navigator.push({
        scene: 'advice_for_me',
        title: '',
        topicId: topic.__dataID__
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
    const isLast = viewer.topics.edges.length == (parseInt(rowID) + 1);

    if ( isLast ) {
      return (
        <View>
          <TopicEmpty
            topic={ rowData.node }
            user={ this.props.viewer }
            index={ rowID }
            selectTopic={this._selectTopic.bind(this, rowData.node)}/>
          <ButtonsBoris subscribeNow={this.subscribeNow.bind(this)}/>
        </View>
      )
    }

    return (
      <TopicEmpty
        topic={ rowData.node }
        user={ this.props.viewer }
        index={ rowID }
        selectTopic={this._selectTopic.bind(this, rowData.node)}/>
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

const ButtonsBoris = (props) => (
  <View style={ {marginTop : 40 } }>
    <View style={ styles.borisContainer }>
      <Boris mood="positive" size="small" note={ BorisNoteForSubscription }/>
    </View>
    <Button
      onPress={props.subscribeNow}
      label=""
      color="orange"
      style={ styles.button }>
      <Text style={ styles.buttonText }>Subscribe now</Text>
    </Button>
  </View>
)



export default Relay.createContainer(connect()(ExploreTopics), {
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
