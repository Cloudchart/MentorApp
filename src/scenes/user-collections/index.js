import React, {
  Component,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ListView,
  DeviceEventEmitter,
  PanResponder,
} from 'react-native'
import Relay from 'react-relay'
import { connect } from 'react-redux'
import AddInsightToCollectionMutation from '../../mutations/add-insight-to-collection'
import { ScrollHandler } from '../../utils/animation'
import { createCollection, removeCollection } from '../../actions/collections'
import * as actions from '../../actions/application'
import Icon from 'react-native-vector-icons/FontAwesome'
import { EventManager } from '../../event-manager'
import UserCollectionItem from './collection-item'
import OnlyAdd from './only-add'
import styles from './style'
import baseStyles from '../../styles/base'

const PAGE_SIZE = 20
const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class UserCollectionsScene extends Component {

  constructor(props, context) {
    super(props, context)
    this._keyboardDidShowSubscription = DeviceEventEmitter.addListener(
      'keyboardDidShow',
      this.handleKeyboardDidShow.bind(this)
    )
    this._keyboardWillHideSubscription = DeviceEventEmitter.addListener(
      'keyboardWillHide',
      this.handleKeyboardWillHide.bind(this)
    )

    this._textInput = null
    this._goBack = false
    // subscribe to an event to create a new collection
    this._showControlAddNewItem = this._showControlAddNewItem.bind(this)
    this._forceFetch = this._forceFetch.bind(this)
    EventManager.addListener(actions.ACTION_ADD_USER_COLLECTION, this._showControlAddNewItem)
    EventManager.addListener(actions.UPDATE_COLLECTIONS, this._forceFetch)


    this._handleCollectionNameChange = this._handleCollectionNameChange.bind(this)
    this._handleCollectionNameBlur = this._handleCollectionNameBlur.bind(this)
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        this.setState({ closeAllItems: true })
        return false
      }
    })
    this.state = {
      loader: false,
      isLoadingTail: false,
      collectionName: '',
      collections: [],
      addControlShow: false,
    }
  }

  componentWillMount() {
    const { insightNode, viewer } = this.props
    const { edges } = viewer.collections
    this.setState({
      insightNode,
      collections: edges.map(edge => edge.node),
    })
  }

  componentDidMount() {
    const { dispatch, viewer } = this.props
    const { collections } = viewer
    dispatch({
      type: actions.SET_COLLECTIONS,
      collections,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { collections } = nextProps.viewer
    const nextCollections = collections.edges.map(edge => edge.node)
    this.setState({
      collections: nextCollections,
    })
    this._updateCounterAdvice(collections);
    if (!nextCollections || !nextCollections.length && !this._goBack) {
      this._goBack = true
      this.props.navigator.popToTop()
    }
  }

  componentDidUpdate(prevProps) {
    const { viewer } = this.props
    if (this.state.collections.length < viewer.collections.edges.length) {
      this._updateCounterAdvice(viewer.collections)
    }
  }

  componentWillUnmount() {
    this._goBack = false
    EventManager.removeListener(actions.ACTION_ADD_USER_COLLECTION, this._showControlAddNewItem)
    EventManager.removeListener(actions.UPDATE_COLLECTIONS, this._forceFetch)
    this._keyboardDidShowSubscription.remove()
    this._keyboardWillHideSubscription.remove()
  }


  /**
   *
   * @param frames
   * @private
   */
  handleKeyboardDidShow(frames) {
    if (!frames.endCoordinates) {
      return
    }
    const { collections } = this.state
    if (collections && collections.length > 3) {
      setTimeout(() => {
        let scrollResponder = this.refs._scrollView.getScrollResponder()
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          React.findNodeHandle(this.refs[ 'newItemInput' ]),
          76
        )
      }, 0)
    }
  }

  /**
   *
   * @param frames
   * @private
   */
  handleKeyboardWillHide(frames) {
    let scrollResponder = this.refs._scrollView.getScrollResponder()
    setTimeout(() => {
      scrollResponder.scrollTo({ y: 0, animated: false })
    }, 0)
  }

  /**
   *
   * @param collections
   * @private
   */
  _updateCounterAdvice (collections) {
    const { dispatch } = this.props;
    const throttle = _.throttle(()=> {
      dispatch({
        type: actions.COUNT_INSIGHTS_COLLECTIONS,
        collections: collections
      })
    }, 100);
    throttle();
  }


  /**
   *
   * @returns {boolean}
   * @private
   */
  _showControlAddNewItem () {
    if ( this.state.addControlShow ) return false;
    this.setState({ addControlShow: true });
  }

  /**
   * Add new collection_item and relay forceFetch
   * @returns {boolean}
   * @private
   */
  _createNewUserCollection () {
    const { viewer, relay } = this.props
    const { collectionName, insightNode } = this.state
    const collection = {
      id: (Math.random(100) * 1000).toString(16),
      name: collectionName,
    }
    createCollection({ collection, user: viewer })
      .then(transaction => {
        if (transaction.addCollectionToUser && transaction.addCollectionToUser.collection ) {
          const { collection } = transaction.addCollectionToUser
          this.state.collections.push(this.prepareCollectionData(collection))
          this.setState({
            collections: [ ...this.state.collections ],
            collectionName: '',
          })
          if (insightNode) {
            this._addInsightToCollection(
              transaction.addCollectionToUser.collection
            )
          }
        }
      })
      .catch(() => this.setState({ collectionName: '' }))
  }

  /**
   *
   * @param coll
   * @returns {{}}
   */
  prepareCollectionData (coll) {
    let collection = { ...coll };
    collection.__dataID__ = collection.id;
    collection.insights = {
      count: 0,
      edges: [],
      usefulCount: 0,
      uselessCount: 0
    };
    return collection
  }


  /**
   * delete item from collections
   * @param id
   * @private
   */
  handleDeleteRow(collection) {
    const viewer = this.props.viewer;
    removeCollection({ collection: collection, user: viewer });
  }

  /**
   * Add current insight to specified collection
   * @param {Object} collection
   * @private
   */
  _addInsightToCollection(collection) {
    const { insightNode } = this.state
    const mutation = new AddInsightToCollectionMutation({
      insight: insightNode,
      collection,
    })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => this.props.navigator.pop(),
    })
  }

  _handleCollectionNameChange (name) {
    this.state.collectionName = name;
  }

  clearText () {
    this._textInput.setNativeProps({ text: '' });
  }

  _handleCollectionNameBlur () {
    const { collectionName } = this.state;
    if ( collectionName.length ) {
      this.setState({ addControlShow: false })
      this._createNewUserCollection()
    } else {
      this.setState({ addControlShow: false })
    }
  }

  // TODO:
  _forceFetch () {
    this.props.relay.forceFetch();
  }

  handleEndReached() {
    const { relay, viewer } = this.props;
    let pageNext = viewer.collections.pageInfo;
    let count = relay.variables.count;
    if ( !pageNext || !pageNext.hasNextPage ) {
      return;
    }
    this.setState({ isLoadingTail: true })
    relay.setVariables({ count: count + PAGE_SIZE }, transaction => {
      if (transaction.done) {
        this.setState({ isLoadingTail: false })
      }
    })
  }

  handlePressRow(collection) {
    const { navigator } = this.props
    navigator.push({
      scene: 'user-insights_useful',
      title: collection.name,
      collectionId: collection.id,
    })
  }

  _renderNewItem () {
    const { collectionName } = this.state;
    return (
      <View style={ [styles.collectionItem, styles.newCollection] }>
        <View style={ styles.collectionItemInner }>
          <Icon name="folder-open-o" style={[baseStyles.crumbIcon, baseStyles.folderIcon]}/>
          <TextInput
            ref={component => this._textInput = component}
            style={ styles.collectionText }
            placeholder="Enter new collection name"
            placeholderTextColor="hsl(137, 100%, 83%)"
            autoFocus={ true }
            onChangeText={ this._handleCollectionNameChange }
            onFocus={frames => this.handleKeyboardDidShow(frames)}
            onBlur={ this._handleCollectionNameBlur }
          />
        </View>
      </View>
    )
  }

  _renderCollectionItem(rowData, sectionID, rowID) {
    const { viewer } = this.props
    const { insightNode, closeAllItems } = this.state
    const collection = rowData
    if (insightNode) {
      return (
        <OnlyAdd
          key={rowID}
          collection={collection}
          user={viewer}
          onPress={() => this._addInsightToCollection(collection)}
        />
      )
    } else {
      return (
        <UserCollectionItem
          key={rowID}
          collection={collection}
          user={viewer}
          closeAllItems={closeAllItems}
          deleteRow={() => this.handleDeleteRow(collection)}
          pressRow={() => this.handlePressRow(collection)}
        />
      )
    }
  }

  _renderList () {
    return this.state.collections.map((collection, index) => {
      return this._renderCollectionItem(collection, null, index)
    })
  }

  render() {
    const { isLoadingTail, addControlShow, collections } = this.state
    const scrollHandler = ScrollHandler.bind(this, {
      isLoadingTail,
      callback: addControlShow ? () => {} : () => this.handleEndReached(),
      onEndReachedThreshold: 20,
    })
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <ScrollView
          onScroll={scrollHandler}
          ref="_scrollView"
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps={false}
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          >
          <ListView
            enableEmptySections={true}
            dataSource={dataSource.cloneWithRows(collections)}
            renderRow={(rowData, sectionID, rowID) => this._renderCollectionItem(rowData, sectionID, rowID)}
            pageSize={20}
            isLoadingTail={isLoadingTail}
            renderHeader={() => null}
            />
          {(addControlShow || (!collections.length && !this._goBack)) && (
            this._renderNewItem()
          )}
          <View ref="newItemInput"></View>
        </ScrollView>
      </View>
    )
  }
}

const ReduxComponent = connect()(UserCollectionsScene)

export default Relay.createContainer(ReduxComponent, {
  initialVariables: {
    count: 20,
    filter: 'USEFUL'
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${UserCollectionItem.getFragment('user')}
        ${OnlyAdd.getFragment('user')}
        collections(first: $count) {
          edges {
            node {
              id
              name
              insights(first: 3, filter: $filter) {
                count
                usefulCount
                uselessCount
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `
  },
});
