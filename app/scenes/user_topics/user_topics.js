import React, {
    Component,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    View,
    ListView,
    AlertIOS
} from "react-native";
import Relay from 'react-relay';
import { connect } from "react-redux";

import { Boris, Button, Loader, TopicSubscribed, ScrollListView } from "../../components";
import styles from "./style";
import { USER_SUBSCRIBE, TOPIC_DELETE } from "../../actions/actions";

const BorisNoteForSubscription = "Don’t restrain yourself with 3 topics, meatb… Master. Subscribe and unlock the full power of your Virtual Mentor!";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class UserTopics extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isLoadingTail: false,
      addControlShow: false
    };

    this._onEndReached = this._onEndReached.bind(this)
  }

  componentDidMount () {}

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
    const { dispatch, navigator } = this.props;
    dispatch({ type: USER_SUBSCRIBE })

    setTimeout(()=> {
      navigator.push({
        scene: 'subscription',
        title: 'Subscription',
        filterUserAddedTopic: true
      })
    }, 0)
  }


  _addTopic () {
    const { dispatch, navigator } = this.props;
    dispatch({ type: USER_SUBSCRIBE })

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
    return (
      <TopicSubscribed
        topic={ rowData.node }
        user={ this.props.viewer }
        subscribedTopics={subscribedTopics}
        index={ rowID } />
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
        <View style={ styles.container }>
          <ScrollView ref="_scrollView" showsVerticalScrollIndicator={false}>
            {!subscribedTopics.edges.length ? null :
                <ScrollListView
                    dataSource={dataSource.cloneWithRows(subscribedTopics.edges)}
                    renderRow={(rowData, sectionID, rowID) => this._renderTopic(rowData, sectionID, rowID)}
                    pageSize={14}
                    isLoadingTail={isLoadingTail}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={20}
                    showsVerticalScrollIndicator={false}/>}

            {subscribedTopics.edges.length == 3 ? null :
                <Add addTopic={this._addTopic.bind(this)}/> }

            <ButtonsBoris subscribeNow={this.subscribeNow.bind(this)}/>
          </ScrollView>
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

const Add = (props) => (
    <View style={ {marginTop : 40 } }>
      <Button
          onPress={props.addTopic}
          label=""
          color="green"
          style={styles.button}>
        <Text style={ [styles.buttonText, {color : '#fff'} ]}>Add Topic</Text>
      </Button>
    </View>
)


const ReduxComponent = connect(state => ({
  user: state.user
}))(UserTopics)

export default Relay.createContainer(ReduxComponent, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {                          
        ${TopicSubscribed.getFragment('user')}                                               
        subscribedTopics: topics(first: 3, filter: SUBSCRIBED) {
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
