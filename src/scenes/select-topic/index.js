import React, {
  Component,
  Image,
  ScrollView,
  LayoutAnimation,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  View,
  ListView,
  DeviceEventEmitter,
  PushNotificationIOS,
  AsyncStorage
} from "react-native";
import Relay from 'react-relay';
import { checkPermissionsNotification } from "../../system";
import { Boris, Button, Loader, Topic, ScrollListView, SubscribeTopicAdd } from "../../components";
import { STORAGE_KEY } from "../../actions/actions";
import * as device from "../../utils/device";
import styles from "./style";
import { _flex } from "../../styles/base";


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class SelectTopic extends Component {

  state = {
    isLoadingTail: false,
    showConfirmation: false,
    topicConfirmationSave: null
  }

  constructor (props) {
    super(props)
    this.PAGE_SIZE = 30;
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
   * @param params
   * @param evt
   * @private
   */
  _undoConfirmation (params, evt) {
    switch ( params ) {
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

  _onPress (topic) {
    this.props.relay.forceFetch();
  }

  _checkPress (topic) {
    const { filterUserAddedTopic, viewer, navigator } = this.props;
    const { availableSlotsCount } = viewer.subscribedTopics;

    if ( filterUserAddedTopic && !availableSlotsCount ) {
      this.setState({
        topicConfirmationSave: {
          topic,
          user: viewer
        },
        showConfirmation: true
      })
    }
  }

  /**
   * @private
   */
  async _pressContinue () {
    const { navigator } = this.props;

    try {
      let isConfirm = await AsyncStorage.getItem(STORAGE_KEY);

      if ( isConfirm || isConfirm == 'already_request_permissions' ) {
        navigator.resetTo({ scene: 'advice_for_me', title: '' });
        return;
      }

      checkPermissionsNotification()
        .then((data)=> {
          if ( data == 'off' ) {
            navigator.push({ scene: 'notifications', title: 'Notifications' });
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
    const topic = rowData.node;

    return (
      <Topic
        topic={ topic }
        user={ this.props.viewer }
        subscribedTopics={subscribedTopics}
        index={ rowID }
        onPressBefore={this._checkPress.bind(this, topic)}
        onPress={this._onPress.bind(this, topic)}
      />
    )
  }

  render () {
    const { isLoadingTail, topicConfirmationSave, showConfirmation } = this.state;
    const { filterUserAddedTopic, viewer, navigator } = this.props;
    const topicCount = viewer.subscribedTopics.edges.length;
    const { availableSlotsCount } = viewer.subscribedTopics;
    const styleScroll = { marginBottom: !topicCount ? device.size(120) : device.size(80) };

    if ( !availableSlotsCount && filterUserAddedTopic && showConfirmation ) {
      return (
        <SubscribeTopicAdd
          navigator={navigator}
          popToTop='pop'
          undo={this._undoConfirmation}
          subscribedTopics={viewer.subscribedTopics}
          {...topicConfirmationSave}  />
      )
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

export default Relay.createContainer(SelectTopic, {
  initialVariables: {
    count: 30
  },
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            id
            ${Topic.getFragment('user')}
            topics(first: $count, filter: DEFAULT) {
                availableSlotsCount
                edges {
                    node {
                        id
                        isSubscribedByViewer
                        ${Topic.getFragment('topic')}
                    }
                }
                pageInfo {
                    hasNextPage
                }
            }

            subscribedTopics: topics(first: 3, filter: SUBSCRIBED) {
                availableSlotsCount
                edges {
                    node {
                        id
                        isSubscribedByViewer
                        ${Topic.getFragment('topic')}
                    }
                }
            }
        }
    `
  }
});
