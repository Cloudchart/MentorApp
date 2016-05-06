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
} from 'react-native'
import Relay from 'react-relay'
import {
  Boris,
  Button,
  TopicSubscribed,
  ScrollListView
} from '../../components'
import styles from './style'
import { EventManager } from '../../event-manager'
import * as device from '../../utils/device'
import { getGradient } from '../../utils/colors'
import { TOPICS_FORCE_FETCH } from '../../actions/application'

const getBorisNote = ({ availableSlotsCount }) => (
  `Don\’t restrain yourself with ${availableSlotsCount} topics, meatb… Master. ` +
  'Subscribe and unlock the full power of your Virtual Mentor!'
)

class UserTopicsScene extends Component {

  constructor (props, context) {
    super(props, context)
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (event, gestureState) => {
        this.setState({ closeAllItems: true })
        return false
      },
    })
    this.state = {
      closeAllItems: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  componentDidMount() {
    const { viewer } = this.props
    this.setState({
      dataSource: this._getTopicsDataSource(viewer.subscribedTopics),
    })
  }

  componentWillReceiveProps(nextProps) {
    const { viewer } = this.props
    if (nextProps.viewer.subscribedTopics !== viewer.subscribedTopics) {
      const { subscribedTopics } = nextProps.viewer
      this.setState({
        dataSource: this._getTopicsDataSource(subscribedTopics),
      })
    }
  }

  _getTopicsDataSource(topics) {
    const { dataSource } = this.state
    const filteredTopics = topics.edges.filter(topic => (
        !topic.node.isSubscribedByViewer)
    )
    this._topicsData = (this._topicsData || []).concat(filteredTopics)
    return dataSource.cloneWithRows(this._topicsData)
  }

  handleSubscribePress() {
    this.props.navigator.push({
      scene: 'subscription',
      title: 'Subscription',
    })
  }

  handleAddTopicPress(availableToSelect) {
    const title =
      (availableToSelect > 1) ?
        'Select up to ' + availableToSelect + ' topics to start:' :
        'Select any one of following topics:'
    this.props.navigator.push({
      scene: 'select_topics',
      title,
      filterUserAddedTopic: true,
      availableToSelect,
    })
  }

  handleEndReached() {
    const { relay, viewer } = this.props
    const { pageInfo } = viewer.subscribedTopics
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

  _renderTopic(rowData, sectionID, rowID) {
    const { viewer } = this.props
    const { closeAllItems } = this.state
    const { subscribedTopics } = viewer
    return (
      <View>
        <TopicSubscribed
          topic={rowData.node}
          closeAllItems={closeAllItems}
          user={viewer}
          subscribedTopics={subscribedTopics}
          unsubscribeFromTopicCallback={() => console.log('UnsubscribeFromTopic')}
          index={rowID}
          />
      </View>
    )
  }

  _renderAddButtons() {
    const { viewer } = this.props
    const { subscribedTopics } = viewer
    if (subscribedTopics.availableSlotsCount === 0) {
      return null
    }
    const result = []
    for (let index = 0, length = subscribedTopics.availableSlotsCount; index < length; index++) {
      result.push(
        <AddTopicButton
          key={index}
          onPress={() => this.handleAddTopicPress(subscribedTopics.availableSlotsCount)}
          index={subscribedTopics.edges.length + index}
          />
      )
    }
    return result
  }

  render () {
    const { viewer } = this.props
    const { subscribedTopics } = viewer
    const { isLoadingTail, dataSource } = this.state
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <ScrollView
          showsVerticalScrollIndicator={true}>
          {(subscribedTopics.edges.length > 0) && (
            <ListView
              dataSource={dataSource}
              renderRow={(rowData, sectionID, rowID) => this._renderTopic(rowData, sectionID, rowID)}
              pageSize={14}
              isLoadingTail={isLoadingTail}
              onEndReached={() => this.handleEndReached()}
              onEndReachedThreshold={20}
              showsVerticalScrollIndicator={false}
              />
          )}
          {this._renderAddButtons()}
          <SubscribeButton
            availableSlotsCount={subscribedTopics.availableSlotsCount}
            onPress={() => this.handleSubscribePress()}
            />
        </ScrollView>
      </View>
    )
  }
}

const SubscribeButton = ({ onPress, availableSlotsCount }) => (
  <View style={{ marginTop: device.size(40) }}>
    <View style={styles.borisContainer}>
      <Boris
        mood="positive"
        size="small"
        note={getBorisNote({ availableSlotsCount })}
        />
    </View>
    <Button
      onPress={onPress}
      label=""
      color="orange"
      style={styles.button}>
      <Text style={styles.buttonText}>
        Subscribe now
      </Text>
    </Button>
  </View>
)

const AddTopicButton = ({ onPress, index }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    style={[styles.item, { backgroundColor: getGradient('green', index) }]}>
    <View style={styles.itemInner}>
      <Text style={styles.itemText} numberOfLines={1}>
        Add Topic
      </Text>
    </View>
  </TouchableOpacity>
)

export default Relay.createContainer(UserTopicsScene, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${TopicSubscribed.getFragment('user')}
        subscribedTopics: topics(first: 100, filter: SUBSCRIBED) {
          availableSlotsCount
          edges {
            node {
              ${TopicSubscribed.getFragment('topic')}
            }
          }
        }
      }
    `
  }
})
