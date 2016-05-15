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
import { ScrollHandler } from '../../utils/animation'
import { createCollection, removeCollection, addToCollection } from '../../actions/collections'
import * as actions from '../../actions/application'
import Icon from 'react-native-vector-icons/FontAwesome'
import { EventManager } from '../../event-manager'
import UserCollectionItem from './collection-item'
import OnlyAdd from './only-add'
import styles from './style'
import baseStyles from '../../styles/base'

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class UserCollectionsScene extends Component {

  state = {
    loader: false,
    isLoadingTail: false,
    collectionName: '',
    collections: [],
    addControlShow: false
  }

  constructor (props) {
    super(props)
    this.PAGE_SIZE = 20
    this._textInput = null
    this._goBack = false
    // subscribe to an event to create a new collection
    this._showControlAddNewItem = this._showControlAddNewItem.bind(this)
    this._forceFetch = this._forceFetch.bind(this)

    EventManager.addListener(actions.ACTION_ADD_USER_COLLECTION, this._showControlAddNewItem)
    EventManager.addListener(actions.UPDATE_COLLECTIONS, this._forceFetch)

    this.keyboardDidShowSubscription = DeviceEventEmitter.addListener('keyboardDidShow', this._keyboardDidShow.bind(this))
    this.keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', this._keyboardWillHide.bind(this))

    this._handleCollectionNameChange = this._handleCollectionNameChange.bind(this)
    this._handleCollectionNameBlur = this._handleCollectionNameBlur.bind(this)
    this._onEndReached = this._onEndReached.bind(this)
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this.renderHeader = this.renderHeader.bind(this)

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        this.setState({ closeAllItems: true })
        return false
      }
    })
  }


  componentWillReceiveProps (nextProps) {
    this.state.collections = _.map(nextProps.viewer.collections.edges, 'node');
    this._updateCounterAdvice(nextProps.viewer.collections);
    if ( !this.state.collections || !this.state.collections.length && !this._goBack ) {
      this._goBack = true;
      this.props.navigator.popToTop();
    }
  }

  componentDidMount () {
    const { dispatch, viewer } = this.props;
    dispatch({ type: actions.SET_COLLECTIONS, collections: viewer.collections })
  }

  componentWillMount () {
    this.state.advice = this.props.advice;
    this.state.collections = _.map(this.props.viewer.collections.edges, 'node');
  }

  componentDidUpdate (prevProps) {
    const { dispatch, viewer } = this.props;
    if ( this.state.collections < viewer.collections.edges.length ) {
      this._updateCounterAdvice(viewer.collections);
    }
  }

  componentWillUnmount () {
    this._goBack = false;
    EventManager.removeListener(actions.ACTION_ADD_USER_COLLECTION, this._showControlAddNewItem);
    EventManager.removeListener(actions.UPDATE_COLLECTIONS, this._forceFetch);
    this.keyboardDidShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
  }


  /**
   *
   * @param frames
   * @private
   */
  _keyboardDidShow (frames) {
    if ( !frames.endCoordinates ) return;
    const { viewer } = this.props;
    const coll = this.state.collections;
    if ( coll.length && coll.length > 3 ) {
      setTimeout(() => {
        let scrollResponder = this.refs._scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          React.findNodeHandle(this.refs[ 'newItemInput' ]),
          76
        );
      }, 0);
    }
  }

  /**
   *
   * @param frames
   * @private
   */
  _keyboardWillHide (frames) {
    let scrollResponder = this.refs._scrollView.getScrollResponder();
    setTimeout(()=> {
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
    const { viewer, relay } = this.props;
    const { collectionName, advice } = this.state;

    let collectionData = {
      id: (Math.random(100) * 1000).toString(16),
      name: collectionName
    }

    createCollection({ collection: collectionData, user: viewer })
      .then((tran)=> {
        if ( tran.addCollectionToUser && tran.addCollectionToUser.collection ) {
          let collection = tran.addCollectionToUser.collection;
          this.state.collections.push(this.prepareCollectionData(collection))
          this.setState({
            collections: [ ...this.state.collections ],
            collectionName: ''
          });

          if ( advice ) {
            this._addInsightToCollection(
              tran.addCollectionToUser.collection
            )
          }
        }
      })
      .catch((transaction)=> {
        this.setState({ collectionName: '' })
      })
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
   * add new insight to collection
   * @param collectionId
   * @private
   */
  _addInsightToCollection (collection) {
    const { navigator } = this.props;
    addToCollection({ insight: this.state.advice, collection })
      .then((transaction)=> {
        navigator.pop();
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

  _onEndReached () {
    const { relay, viewer } = this.props;
    let pageNext = viewer.collections.pageInfo;
    let count = relay.variables.count;

    if ( !pageNext || !pageNext.hasNextPage ) {
      return;
    }

    this.setState({ isLoadingTail: true })
    relay.setVariables({ count: count + this.PAGE_SIZE }, (transaction) => {
      if ( transaction.done ) this.setState({ isLoadingTail: false })
    });
  }

  renderHeader () {
    return null;
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
            onFocus={ this._keyboardDidShow }
            onBlur={ this._handleCollectionNameBlur }
          />
        </View>
      </View>
    )
  }

  _renderCollectionItem (rowData, sectionID, rowID) {
    const { viewer } = this.props
    const { addControlShow, advice, closeAllItems } = this.state
    const last = (parseInt(rowID) + 1) == this.state.collections.length
    const collection = rowData
    if (advice) {
      return (
        <OnlyAdd
          key={rowID}
          collection={collection}
          user={viewer}
          pressRow={this._addInsightToCollection.bind(this, collection)}/>
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
    const _scroll = ScrollHandler.bind(this, {
      isLoadingTail,
      callback: !addControlShow ? this._onEndReached : () => {},
      onEndReachedThreshold: 20,
    })
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <ScrollView
          onScroll={_scroll}
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
            renderHeader={this.renderHeader}
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
