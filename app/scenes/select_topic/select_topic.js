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
    PushNotificationIOS
} from "react-native";
import { Boris, Button, Loader, Topic, ExploreTopicAdd } from "../../components";
import { TOPIC_ADD } from "../../module_dal/actions/actions";
import * as device from "../../utils/device";
import { connect } from "react-redux";
import styles from "./style";
import { _flex } from "../../styles/base";


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class SelectTopic extends Component {

  constructor (props) {
    super(props)

    this.state = {
      loader: true,
      buttonOpacity: new Animated.Value(0),
      isLoadingTail: false,
      showConfirmation: false
    };

    this._selected = false;
    this._onEndReached = this._onEndReached.bind(this);
    this._selectTopic = this._selectTopic.bind(this)
    this._undoConfirmation = this._undoConfirmation.bind(this)
  }

  componentDidMount () {
    setTimeout(()=> {
      this.setState({ loader: false })
    }, 1000)
  }

  componentWillMount () {
    this.topicsList = this.getTopicList()
  }

  componentWillUnmount () {

  }

  getTopicList () {
    const { user, filterUserAddedTopic } = this.props;
    if ( !this._selected && filterUserAddedTopic ) {
      this._selected = true;
      if ( !user.excludeSelectedTopics.length ) {
        return user.topics
      } else {
        return user.excludeSelectedTopics
      }

    } else {
      return user.topics
    }
  }

  _selectTopic (id) {
    const { filterUserAddedTopic } = this.props;
    if ( filterUserAddedTopic ) {
      this.setState({
        showConfirmation: true,
        topicConfirmationId: id
      })
    } else {
      this._addTopic(id)
    }
  }

  _addTopic (id) {
    const { dispatch, navigator, user, filterUserAddedTopic } = this.props;
    const { selectedTopics } = user;
    dispatch({ type: TOPIC_ADD, id })

    /**
     * if the number is 3 topics
     * back to the settings
     */
    if ( filterUserAddedTopic && (selectedTopics.length + 1) == 3 ) {
      setTimeout(()=> {
        navigator.pop()
      }, 500)
    }
  }

  _undoConfirmation (params, evt) {
    switch ( params ) {
      case 'add':
        this._addTopic(this.state.topicConfirmationId)
      case 'not_now':
        this.setState({ showConfirmation: false })
      default:
    }
  }

  _onEndReached () {
    let { dispatch } = this.props;
  }


  _pressContinue () {
    const { navigator } = this.props;

    PushNotificationIOS.checkPermissions((permissions) => {
      const { badge, sound, alert } = permissions;
      if ( badge || sound || alert ) {
        navigator.push({ scene: 'advice_for_me', title: '' })
      } else {
        navigator.push({ scene: 'notifications', title: 'Notifications' })
      }
    })
  }

  render () {
    const { user, filterUserAddedTopic } = this.props;
    const { selectedTopics } = user;
    const { loader, isLoadingTail, showConfirmation } = this.state;

    if ( loader ) {
      return <Loader />
    }

    if ( showConfirmation ) {
      return <ExploreTopicAdd undo={this._undoConfirmation}/>
    }

    return (
        <View style={styles.container}>
          <ScrollView ref="_scrollView" showsVerticalScrollIndicator={false}>
            <ListView
                dataSource={dataSource.cloneWithRows(this.topicsList)}
                renderRow={(rowData, sectionID, rowID) => <Topic {...rowData} index={rowID} selectTopic={this._selectTopic}/>}
                pageSize={14}
                isLoadingTail={isLoadingTail}
                onEndReached={this._onEndReached}
                onEndReachedThreshold={20}
                showsVerticalScrollIndicator={false}
                style={ _flex}
            />

            {selectedTopics.length == 3 ? null :
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
                </View>}

            {selectedTopics.length != 3 || filterUserAddedTopic ? null :
                <View style={styles.button}>
                  <Button
                      label="Continue"
                      onPress={()=>{ this._pressContinue() }}
                      color="green"
                      style={{marginHorizontal: device.size(18)}}
                  />
                </View>
            }
          </ScrollView>
        </View>
    )
  }
}

export default connect(state => ({
  user: state.user
}))(SelectTopic)
