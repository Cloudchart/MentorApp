import React, {
  Component,
  Image,
  Animated,
  ScrollView,
  LayoutAnimation,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ListView,
  DeviceEventEmitter,
  PushNotificationIOS,
  AsyncStorage
} from "react-native";
import Relay from 'react-relay';
import { connect } from "react-redux";
import { checkPermissionsNotification } from "../../system";
import { Boris, Button, Loader, Topic, ExploreTopicAdd, ScrollListView } from "../../components";

import { STORAGE_KEY } from "../../actions/actions";
import { subscribeOnTopic } from "../../actions/topic";

import * as device from "../../utils/device";
import styles from "./style";
import { _flex } from "../../styles/base";


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})


function filterTopic (topics, subscribedTopics) {
  return topics.filter((topic)=> {
    const is = subscribedTopics.find((item) => item.node.__dataID__ == topic.node.__dataID__)
    return !is;
  })
}

class SelectTopic extends Component {

  constructor (props) {
    super(props)

    this.state = {
      loader: true,
      buttonOpacity: new Animated.Value(0),
      isLoadingTail: false,
      showConfirmation: false,
      topicConfirmationSave: null
    };

    this._selected = false;
    this._tryToAddTopic = this._tryToAddTopic.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this._undoConfirmation = this._undoConfirmation.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this._pressContinue = this._pressContinue.bind(this);
  }

  componentDidMount () {
    setTimeout(()=> {
      this.setState({ loader: false })
    }, 500)
  }


  componentWillUnmount () {
    this.topicsList = this.getTopicList()
  }


  /**
   * this.props.viewer.topics.edges;
   * @returns {*}
   */
  getTopicList () {
    const { viewer, filterUserAddedTopic } = this.props;
    const { topics, subscribedTopics } = viewer;

    if ( filterUserAddedTopic ) {
      return filterTopic(topics.edges, subscribedTopics.edges);
    } else {
      return this.props.viewer.topics.edges;
    }
  }


  /**
   *
   * @param topic
   * @private
   */
  _tryToAddTopic (topic, user) {
    this.setState({
      showConfirmation: true,
      topicConfirmationSave: { topic, user }
    });
  }

  /**
   *
   * @private
   */
  _addTopic () {
    const { viewer, filterUserAddedTopic, navigator } = this.props;
    const { subscribedTopics } = viewer;
    const { topicConfirmationSave } = this.state;

    subscribeOnTopic({
      topic: topicConfirmationSave.topic,
      user: topicConfirmationSave.user
    })
    /**
     * if the number is 3 topics
     * back to the settings
     */
    if ( filterUserAddedTopic && (subscribedTopics.edges.length + 1) == 3 ) {
      setTimeout(()=> {
        navigator.pop()
      }, 500)
    }
  }

  /**
   *
   * @param params
   * @param evt
   * @private
   */
  _undoConfirmation (params, evt) {
    switch ( params ) {
      case 'add':
        this._addTopic()
      case 'not_now':
        this.setState({ showConfirmation: false })
      default:
    }
  }

  /**
   *
   * @private
   */
  _onEndReached () {
    const { relay, viewer } = this.props;
    let count = relay.variables.count;
    let pageNext = viewer.pageInfo;

    if ( !pageNext || !pageNext.hasNextPage ) {
      return;
    }

    this.setState({ isLoadingTail: true })
    relay.setVariables({ count: count * 2 }, (transaction) => {
      if ( transaction.done ) this.setState({ isLoadingTail: false })
    });
  }


  /**
   * @private
   */
  async _pressContinue () {
    const { navigator } = this.props;

    try {
      let isConfirm = await AsyncStorage.getItem(STORAGE_KEY);

      if ( isConfirm || isConfirm == 'already_request_permissions' ) {
        navigator.push({ scene: 'advice_for_me', title: '' })
        return;
      }

      checkPermissionsNotification().then((data)=> {
        if ( data == 'off' ) {
          navigator.push({ scene: 'notifications', title: 'Notifications' })
        }
      })
    } catch ( error ) {
      console.log(error);
    }
  }

  _buttons () {
    const { subscribedTopics } = this.props.viewer;

    if ( !subscribedTopics.edges.length ) {
      return (
        <View style={ styles.containerBoris }>
          <Boris
            mood="positive"
            size="small"
            animate={ true }
            style={ styles.boris }
          />
          <Text style={styles.textBoris}>
            Yoy can always change them later, Master!
          </Text>
        </View>
      )
    } else {
      return (
        <View style={styles.button}>
          <Button
            label="Continue"
            onPress={this._pressContinue}
            color="green"
            style={{marginHorizontal: device.size(18)}}
          />
        </View>
      )
    }
  }

  _renderTopic (rowData, sectionID, rowID) {
    const { subscribedTopics, topics } = this.props.viewer;
    const isLast = topics.edges.length == (parseInt(rowID) + 1);
    const confirmation = this.props.filterUserAddedTopic ? this._tryToAddTopic : null;

    return (
      <View>
        <Topic
          topic={ rowData.node }
          user={ this.props.viewer }
          subscribedTopics={subscribedTopics}
          index={ rowID }
          onConfirmation={confirmation}/>
        {isLast ? this._buttons() : null }
      </View>
    )
  }

  render () {
    const { viewer } = this.props;
    const { loader, isLoadingTail, showConfirmation } = this.state;

    if ( showConfirmation ) {
      return <ExploreTopicAdd undo={this._undoConfirmation}/>
    }

    return (
      <View style={styles.container}>
        <ScrollListView
          dataSource={dataSource.cloneWithRows(this.getTopicList())}
          renderRow={(rowData, sectionID, rowID) => this._renderTopic(rowData, sectionID, rowID)}
          pageSize={30}
          isLoadingTail={isLoadingTail}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={20}
          showsVerticalScrollIndicator={true}
          style={ _flex}
        />
      </View>
    )
  }
}


export default Relay.createContainer(connect()(SelectTopic), {
  initialVariables: {
    count: 30
  },
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            ${Topic.getFragment('user')}
            topics(first: $count, filter: DEFAULT) {
                edges {
                    node {
                        ${Topic.getFragment('topic')}                                                      
                    }
                }
                pageInfo {
                    hasNextPage
                }
            }

            subscribedTopics: topics(first: 3, filter: SUBSCRIBED) {
                edges {
                    node {
                        ${Topic.getFragment('topic')}
                    }
                }
            }
        }
    `
  }
});
