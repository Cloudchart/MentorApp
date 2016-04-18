import React, {
  Component,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  ListView,
  AlertIOS,
  PanResponder
} from "react-native";
import Relay from 'react-relay';
import {
  Boris,
  Button,
  TopicSubscribed,
  ScrollListView
} from "../../components";
import styles from "./style";
import { EventManager } from '../../event-manager';
import * as device from "../../utils/device";
import { TOPICS_FORCE_FETCH } from '../../actions/actions';


const BorisNoteForSubscription = "Don’t restrain yourself with 3 topics, meatb… Master. Subscribe and unlock the full power of your Virtual Mentor!";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class UserTopics extends Component {

  state = {
    isLoadingTail: false,
    addControlShow: false,
    closeAllItems: false
  }

  constructor (props) {
    super(props)

    this.forceFetch = this.forceFetch.bind(this);
    EventManager.on(TOPICS_FORCE_FETCH, this.forceFetch)

    this._onEndReached = this._onEndReached.bind(this);
    this._unsubscribeFromTopicCallback = this._unsubscribeFromTopicCallback.bind(this);
    this._addTopic = this._addTopic.bind(this)


    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        this.setState({ closeAllItems: true })
        return false;
      }
    });
  }

  componentWillUnmount () {
    EventManager.removeListener(TOPICS_FORCE_FETCH, this.forceFetch);
  }

  /**
   *
   * @private
   */
  _onEndReached () {

  }

  /**
   *
   */
  subscribeNow () {
    const { navigator } = this.props;

    setTimeout(()=> {
      navigator.push({
        scene: 'subscription',
        title: 'Subscription',
        filterUserAddedTopic: true
      })
    }, 0)
  }

  _unsubscribeFromTopicCallback () {
    this.props.relay.forceFetch();
  }

  forceFetch () {
    this.props.relay.forceFetch()
  }


  _addTopic () {
    const { navigator } = this.props;

    setTimeout(()=> {
      navigator.push({
        scene: 'select_topics',
        title: 'Select up to 3 topics to start:',
        filterUserAddedTopic: true
      })
    }, 0)
  }


  _renderTopic (rowData, sectionID, rowID) {
    const { subscribedTopics } = this.props.viewer;
    const last = (parseInt(rowID) + 1) == subscribedTopics.edges.length;
    const isShow = last; //subscribedTopics.edges.length < 3 && last

    return (
      <View>
        <TopicSubscribed
          topic={ rowData.node }
          closeAllItems={this.state.closeAllItems}
          user={ this.props.viewer }
          subscribedTopics={subscribedTopics}
          unsubscribeFromTopicCallback={this._unsubscribeFromTopicCallback}
          index={ rowID }/>
      </View>
    )
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    const { viewer } = this.props;
    const { subscribedTopics } = viewer;
    const { isLoadingTail } = this.state;

    return (
      <View style={ styles.container } {...this._panResponder.panHandlers}>
        <ScrollView
          showsVerticalScrollIndicator={true}>
          {!subscribedTopics.edges.length ? null :
            <ListView
              dataSource={dataSource.cloneWithRows(subscribedTopics.edges)}
              renderRow={(rowData, sectionID, rowID) => this._renderTopic(rowData, sectionID, rowID)}
              pageSize={14}
              isLoadingTail={isLoadingTail}
              onEndReached={this._onEndReached}
              onEndReachedThreshold={20}
              showsVerticalScrollIndicator={false}/>}

          {subscribedTopics.edges.length >= 3 ? null :
            <Add addTopic={this._addTopic}/>}

          <ButtonsBoris subscribeNow={this.subscribeNow.bind(this)}/>
        </ScrollView>
      </View>
    )
  }
}

const ButtonsBoris = (props) => (
  <View style={ {marginTop : device.size(40) } }>
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

const Add = (props) => (
  <View style={ {marginTop : device.size(20) } }>
    <Button
      onPress={props.addTopic}
      label=""
      color="green"
      style={styles.button}>
      <Text style={ [styles.buttonText, {color : '#fff'} ]}>Add Topic</Text>
    </Button>
  </View>
)

export default Relay.createContainer(UserTopics, {
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            ${TopicSubscribed.getFragment('user')}                                               
            subscribedTopics: topics(first: 100, filter: SUBSCRIBED) {
                edges {
                    node {
                        ${TopicSubscribed.getFragment('topic')}
                    }
                }
            }
        }
    `
  }
});
