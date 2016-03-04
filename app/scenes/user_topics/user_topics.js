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
import { connect } from "react-redux";
import { Boris, Button, Loader, ScrollListView } from "../../components";
import UserTopic from "./topic";
import styles from "./style";
import { USER_SUBSCRIBE, TOPIC_DELETE } from "../../module_dal/actions/actions";

const BorisNoteForSubscription = "Don’t restrain yourself with 3 topics, meatb… Master. Subscribe and unlock the full power of your Virtual Mentor!";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class UserTopics extends Component {

  constructor (props) {
    super(props)

    this.state = {
      loader: true,
      isLoadingTail: false,
      addControlShow: false
    };
  }

  componentDidMount () {
    const { user, navigator } = this.props;
    const { selectedTopics } = user;

    setTimeout(()=> {
      this.setState({ loader: false })
    }, 1000)
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

  _topic (props, sectionID, rowID) {
    return <UserTopic {...props} index={rowID} deleteRow={this._deleteTopic.bind(this)}/>
  }

  _deleteTopic (id, evt) {
    const { dispatch } = this.props;
    dispatch({ type: TOPIC_DELETE, id })
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    const { user } = this.props;
    const { selectedTopics, businessSubscription } = user;
    const { loader, isLoadingTail } = this.state;

    if ( loader ) {
      return <Loader />
    }

    return (
        <View style={ styles.container }>
          <ScrollView ref="_scrollView" showsVerticalScrollIndicator={false}>
            {!selectedTopics.length ? null :
                <ScrollListView
                    dataSource={dataSource.cloneWithRows(selectedTopics)}
                    renderRow={(props, sectionID, rowID) => this._topic(props, sectionID, rowID)}
                    pageSize={14}
                    isLoadingTail={isLoadingTail}
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={20}
                    showsVerticalScrollIndicator={false}/>}

            {selectedTopics.length == 3 ? null :
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


export default connect(state => ({
  user: state.user
}))(UserTopics)
