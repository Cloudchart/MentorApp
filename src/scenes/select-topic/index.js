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
import { getNotificationsPermission } from '../../system'
import { Boris, Button, Loader, Topic, ScrollListView } from '../../components'
import ExploreInsightsSubscription from '../explore-insights/subscription'
import { NOTIFICATIONS__PERMISSIONS_STATUS } from '../../storage'
import * as device from '../../utils/device'
import styles from './style'
import { _flex } from '../../styles/base'

const PAGE_SIZE = 30

function checkForAnyNotificationPermissions() {
  return new Promise((resolve, reject) => {
    try {
      PushNotificationIOS.checkPermissions(permissions => {
        const { badge, sound, alert } = permissions
        const hasAny = Boolean(badge || sound || alert)
        resolve(hasAny)
      })
    } catch (err) {
      reject(err)
    }
  })
}

class SelectTopicScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      isPending: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      subscribedTopicsCount: 0,
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
    let finalTopics
    let subscribedTopicsCount = 0
    if (excludeUserTopics) {
      finalTopics = topics.edges.filter(({ node }) => {
        if (node.isSubscribedByViewer) {
          subscribedTopicsCount++
        }
        return !node.isSubscribedByViewer
      })
    } else {
      finalTopics = topics.edges
      topics.edges.forEach(({ node }) => {
        if (node.isSubscribedByViewer) {
          subscribedTopicsCount++
        }
      })
    }
    this.setState({
      subscribedTopicsCount,
    })
    return dataSource.cloneWithRows(finalTopics)
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
    const { excludeUserTopics } = this.props
    if (excludeUserTopics) {
      this.setState({
        isPending: false,
      })
      this.props.navigator.pop()
    }
  }

  handleTopicPressBefore() {
    const { excludeUserTopics } = this.props
    if (excludeUserTopics) {
      this.setState({
        isPending: true,
      })
    }
  }

  async handleContinuePress() {
    const { navigator } = this.props
    let notificationsStatus
    try {
      notificationsStatus = await AsyncStorage.getItem(NOTIFICATIONS__PERMISSIONS_STATUS)
    } catch (e) {
      console.error('handleContinuePress()', e)
    }
    if (notificationsStatus && notificationsStatus == 'already_request_permissions') {
      console.log('already requested permissions, move to insights')
      navigator.resetTo({
        scene: 'insights',
        filter: 'UNRATED',
        renderOptions: {
          skipFirstRender: true,
        },
      })
      return
    }
    try {
      const granted = checkForAnyNotificationPermissions()
      if (granted) {
        console.log('requested permissions granted, move to insights')
        navigator.resetTo({
          scene: 'insights',
          filter: 'UNRATED',
          renderOptions: {
            skipFirstRender: true,
          },
        })
        return
      }
    } catch (err) {
      console.error('handleContinuePress()', err)
    }
    navigator.push({
      scene: 'notifications',
      title: 'Notifications',
    })
  }

  _renderButton() {
    const { excludeUserTopics } = this.props
    const { subscribedTopicsCount } = this.state
    if (excludeUserTopics) {
      return
    }
    if (subscribedTopicsCount === 0) {
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
    const topic = rowData.node
    return (
      <Topic
        topic={topic}
        user={viewer}
        index={rowID}
        onPressBefore={() => this.handleTopicPressBefore(topic)}
        onPress={() => this.handleTopicPress(topic)}
      />
    )
  }

  render() {
    const {
      isPending, isLoadingTail, dataSource, showConfirmation,
      subscribedTopicsCount,
      } = this.state
    const { excludeUserTopics, viewer, navigator } = this.props
    const { topics } = viewer
    const { availableSlotsCount } = topics
    if (isPending) {
      return (
        <Loader />
      )
    }
    if (availableSlotsCount === 0 &&
      excludeUserTopics &&
      showConfirmation) {
      return (
        <ExploreInsightsSubscription
          onConfirmPress={() => navigator.push({
            scene: 'subscription',
            title: 'Subscription',
            popToPop: 'pop',
            // ...topicConfirmationSave,
          })}
          onCancelPress={() =>  this.setState({ showConfirmation: false })}
          />
      )
    }

    // auto continue when free slots absent
    if (availableSlotsCount === 0 &&
      subscribedTopicsCount > 0) {
      // Fix 3. Warning while starting
      if (!this.autoHandleContinuePress) {
        this.autoHandleContinuePress = true
        this.handleContinuePress();
      }
    }

    const scrollListStyle = {
      marginBottom: (subscribedTopicsCount === 0) ? device.size(120) : device.size(80),
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
    count: 100,
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
      }
    `,
  },
})
