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
import { Boris, Button, Loader, Topic, ScrollListView, SubscribeTopicAdd } from "../../components";
import { STORAGE_KEY } from "../../actions/actions";

import { subscribeOnTopic } from "../../actions/topic";

import * as device from "../../utils/device";
import styles from "./style";
import { _flex } from "../../styles/base";


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class SelectTopic extends Component {

  state = {
    buttonOpacity: new Animated.Value(0),
    isLoadingTail: false,
    showConfirmation: false,
    topicConfirmationSave: null
  }

  constructor (props) {
    super(props)
    this.PAGE_SIZE = 30;

    this._tryToAddTopic = this._tryToAddTopic.bind(this);
    this._onPress = this._onPress.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this._undoConfirmation = this._undoConfirmation.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this._pressContinue = this._pressContinue.bind(this);
  }


  /**
   * this.props.viewer.topics.edges;
   * @returns {*}
   */
  getTopicList () {
    const { viewer, filterUserAddedTopic } = this.props;
    const { topics } = viewer;
    if ( filterUserAddedTopic ) {
      return topics.edges.filter((topic) => !topic.node.isSubscribedByViewer)
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
   * if the number is 3 topics
   * back to the settings
   * @private
   */
  _addTopicAndBack () {
    const { viewer, filterUserAddedTopic, navigator } = this.props;
    const { subscribedTopics } = viewer;
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
      //this._addTopicAndBack()
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
    relay.setVariables({ count: count * this.PAGE_SIZE }, (transaction) => {
      if ( transaction.done ) this.setState({ isLoadingTail: false })
    });
  }

  _onPress () {
    this.props.relay.forceFetch()
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

      checkPermissionsNotification()
        .then((data)=> {
          if ( data == 'off' ) {
            navigator.push({ scene: 'notifications', title: 'Notifications' })
          }
        })
    } catch ( error ) {

    }
  }

  _buttons () {
    const { filterUserAddedTopic, viewer } = this.props;

    if ( filterUserAddedTopic ) return;

    if ( !viewer.subscribedTopics.edges.length ) {
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
    const { subscribedTopics } = this.props.viewer;
    const _onPressUserAddedTopic = this.props.filterUserAddedTopic ? this._tryToAddTopic : null;

    return (
      <Topic
        topic={ rowData.node }
        user={ this.props.viewer }
        subscribedTopics={subscribedTopics}
        index={ rowID }
        onPressUserAddedTopic={_onPressUserAddedTopic}
        onPress={this._onPress}
      />
    )
  }

  render () {
    const { isLoadingTail, showConfirmation, topicConfirmationSave } = this.state;
    const { filterUserAddedTopic, viewer } = this.props;
    const topicCount = viewer.subscribedTopics.edges.length;
    const styleScroll = { marginBottom: !topicCount ? device.size(120) : device.size(80) };

    if ( showConfirmation ) {
      return <SubscribeTopicAdd undo={this._undoConfirmation} {...topicConfirmationSave}  />
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
          style={[_flex, styleScroll]}
        />

        {this._buttons()}
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
                        isSubscribedByViewer
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
