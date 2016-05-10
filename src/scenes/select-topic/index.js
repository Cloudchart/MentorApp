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
  AsyncStorage,
} from 'react-native'
import Relay from 'react-relay'
import { checkPermissionsNotification } from '../../system'
import { Boris, Button, Loader, Topic, ScrollListView } from '../../components'
import SubscribeTopicAdd from '../../components/confirmation-screens/subscribe-topic-add'
import { STORAGE_KEY } from '../../actions/application'
import * as device from '../../utils/device'
import styles from './style'
import { _flex } from '../../styles/base'

const PAGE_SIZE = 30

class SelectTopicScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  componentDidMount() {
    const { viewer } = this.props
    this.setState({
      dataSource: this._getDataSource(viewer.topics),
    })
  }

  componentWillReceiveProps(nextProps) {
    const { viewer } = this.props
    if (nextProps.viewer.topics !== viewer.topics) {
      this.setState({
        dataSource: this._getDataSource(nextProps.viewer.topics),
      })
    }
  }

  _getDataSource(topics) {
    const { excludeUserTopics } = this.props
    const { dataSource } = this.state
    let finalTopics;
    if (excludeUserTopics) {
      finalTopics = topics.edges.filter(topic =>
        !topic.node.isSubscribedByViewer
      )
    } else {
      finalTopics = topics.edges
    }
    this._topicsData = (this._topicsData || []).concat(finalTopics)
    return dataSource.cloneWithRows(this._topicsData)
  }

  handleEndReached() {
    const { relay, viewer } = this.props
    const { pageInfo } = viewer.topics
    if (!pageInfo || !pageInfo.hasNextPage) {
      return
    }
    const { count } = relay.variables
    this.setState({
      isLoadingTail: true,
    })
    relay.setVariables({
      count: count + PAGE_SIZE,
    }, transaction => {
      if (transaction.done) {
        this.setState({
          isLoadingTail: false,
        })
      }
    })
  }

  handleTopicPress(topic) {
    //this.props.relay.forceFetch()
  }

  handleTopicPressBefore(topic) {
    //const { excludeUserTopics, viewer, navigator } = this.props
    const { excludeUserTopics } = this.props
    //const { availableSlotsCount } = viewer.subscribedTopics
    if (excludeUserTopics) {
      this.props.navigator.pop()
    }
    /*if ( filterUserAddedTopic && !availableSlotsCount ) {
     this.setState({
     topicConfirmationSave: {
     topic,
     user: viewer
     },
     showConfirmation: true
     })
     }*/
  }

  async handleContinuePress() {
    const { navigator } = this.props
    let notificationsStatus
    try {
      notificationsStatus = await AsyncStorage.getItem(STORAGE_KEY)
    } catch (e) {
      // nothing
    }
    if (notificationsStatus && notificationsStatus == 'already_request_permissions') {
      navigator.resetTo({
        scene: 'insights',
        filter: 'UNRATED',
        title: '',
      })
      return
    }
    try {
      const permissions = checkPermissionsNotification()
      if (permissions === 'on') {
        navigator.resetTo({
          scene: 'insights',
          filter: 'UNRATED',
          title: '',
        })
        return
      }
    } catch (error) {
      // nothing
    }
    navigator.push({
      scene: 'notifications',
      title: 'Notifications',
    })
  }

  _renderButton() {
    const { excludeUserTopics, viewer } = this.props
    if (excludeUserTopics) {
      return
    }
    if (viewer.subscribedTopics.edges.length === 0) {
      return (
        <View style={styles.containerBoris}>
          <Boris
            mood="positive"
            size="small"
            animate={ true }
            style={styles.boris}
          />
          <Text style={styles.textBoris}>
            Yoy can always change them later, Master!
          </Text>
        </View>
      )
    }
    return (
      <View style={styles.button}>
        <Button
          label="Continue"
          onPress={() => this.handleContinuePress()}
          color="green"
          style={{marginHorizontal: device.size(18)}}
        />
      </View>
    )
  }

  _renderTopic(rowData, sectionID, rowID) {
    const { viewer } = this.props
    const { subscribedTopics } = viewer
    const topic = rowData.node
    return (
      <Topic
        topic={topic}
        user={viewer}
        subscribedTopics={subscribedTopics}
        index={rowID}
        onPressBefore={() => this.handleTopicPressBefore(topic)}
        onPress={() => this.handleTopicPress(topic)}
      />
    )
  }

  render() {
    const { isLoadingTail, dataSource, topicConfirmationSave, showConfirmation } = this.state
    const { excludeUserTopics, viewer, navigator } = this.props
    const { subscribedTopics } = viewer
    if (subscribedTopics.availableSlotsCount === 0 &&
      excludeUserTopics &&
      showConfirmation) {
      return (
        <SubscribeTopicAdd
          navigator={navigator}
          popToTop="pop"
          onNotNowPress={() =>  this.setState({ showConfirmation: false })}
          subscribedTopics={viewer.subscribedTopics}
          {...topicConfirmationSave}
          />
      )
    }
    const scrollListStyle = {
      marginBottom: (subscribedTopics.edges.length === 0) ? device.size(120) : device.size(80),
    }
    return (
      <View style={styles.container}>
        <ScrollListView
          dataSource={dataSource}
          renderRow={(rowData, sectionID, rowID) => this._renderTopic(rowData, sectionID, rowID)}
          pageSize={30}
          isLoadingTail={isLoadingTail}
          onEndReached={() => this.handleEndReached()}
          onEndReachedThreshold={20}
          showsVerticalScrollIndicator={true}
          style={[_flex, scrollListStyle]}
        />
        {this._renderButton()}
      </View>
    )
  }
}

export default Relay.createContainer(SelectTopicScene, {
  initialVariables: {
    count: 30,
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
        subscribedTopics: topics(first: 100, filter: SUBSCRIBED) {
          availableSlotsCount
          edges {
            node {
              id
            }
          }
        }
      }
    `,
  },
})
