import React, {
  Component,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ListView,
  DeviceEventEmitter
} from "react-native";
import { Loader, ScrollListView } from "../../components";
import {
  UPDATE_COLLECTIONS,
  ACTION_ADD_USER_COLLECTION
} from "../../actions/actions";
import Relay from 'react-relay';
import { connect } from "react-redux";
import { ScrollHandler } from "../../utils/animation";

import {
  createCollection,
  removeCollection,
  addToCollection
} from "../../actions/collections";

import {
  COUNT_INSIGHTS_PLUS,
  SET_COLLECTIONS,
  COUNT_INSIGHTS_COLLECTIONS
} from "../../actions/actions";

import { AddInsightToCollectionMutation } from "../../mutations";
import Icon from "react-native-vector-icons/FontAwesome";
import { EventManager } from "../../event-manager";
import UserCollectionItem from "./collection-item";
import OnlyAdd from "./only-add";
import styles from "./style";
import baseStyles from "../../styles/base";


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class UserCollections extends Component {

  constructor (props) {
    super(props)

    this.state = {
      loader: false,
      isLoadingTail: false,
      collectionName: '',
      addControlShow: false
    };

    this.PAGE_SIZE = 20;

    // subscribe to an event to create a new collection
    this._showControlAddNewItem = this._showControlAddNewItem.bind(this);
    this._forceFetch = this._forceFetch.bind(this);
    EventManager.addListener(ACTION_ADD_USER_COLLECTION, this._showControlAddNewItem);
    EventManager.addListener(UPDATE_COLLECTIONS, this._forceFetch)

    this.keyboardDidShowSubscription = DeviceEventEmitter.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', this._keyboardWillHide.bind(this));


    this._deleteRow = this._deleteRow.bind(this);
    this._handleCollectionNameChange = this._handleCollectionNameChange.bind(this);
    this._handleCollectionNameBlur = this._handleCollectionNameBlur.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  componentWillReceiveProps (nextProps) {

  }

  componentDidMount () {
    const { dispatch, viewer } = this.props;
    dispatch({ type: SET_COLLECTIONS, collections: viewer.collections })
  }

  componentWillMount () {
    this.state.advice = this.props.advice;
  }

  componentDidUpdate (prevProps) {
    const { dispatch, viewer } = this.props;
    const prevCountCollections = prevProps.viewer.collections.edges.length;

    if ( viewer.collections.edges.length < prevCountCollections ) {
      dispatch({
        type: COUNT_INSIGHTS_COLLECTIONS,
        collections: viewer.collections
      })
    }

  }

  componentWillUnmount () {
    EventManager.removeListener(ACTION_ADD_USER_COLLECTION, this._showControlAddNewItem);
    EventManager.removeListener(UPDATE_COLLECTIONS, this._forceFetch);
    this.keyboardDidShowSubscription.remove()
    this.keyboardWillHideSubscription.remove()
  }


  /**
   *
   * @param frames
   * @private
   */
  _keyboardDidShow (frames) {
    if ( !frames.endCoordinates ) return;
    const { viewer } = this.props;
    const coll = viewer.collections.edges;
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
   * @returns {boolean}
   * @private
   */
  _showControlAddNewItem () {
    if ( this.state.addControlShow ) return false;
    this.setState({ addControlShow: true })
  }

  /**
   * Add new collection_item and relay forceFetch
   * @returns {boolean}
   * @private
   */
  _createNewUserCollection () {
    const { viewer, relay } = this.props;
    const { collectionName } = this.state;

    let collectionData = {
      id: (Math.random(100) * 1000).toString(16),
      name: collectionName
    }

    createCollection({ collection: collectionData, user: viewer })
      .then((transaction)=> {
        this._forceFetch();
        this.setState({ collectionName: '' })
      })
      .catch((transaction)=> {
        this.setState({ collectionName: '' })
      })
  }


  /**
   * delete item from collections
   * @param id
   * @private
   */
  _deleteRow (collection) {
    const viewer = this.props.viewer;
    removeCollection({ collection: collection, user: viewer })
  }

  /**
   * add new insight to collection
   * @param collectionId
   * @private
   */
  _addInsightToCollection (collection) {
    const { dispatch, relay, navigator } = this.props;
    navigator.pop();

    addToCollection({ insight: this.state.advice, collection })
      .then((transaction)=> {
        this._forceFetch();
        dispatch({ type: COUNT_INSIGHTS_PLUS })
      })
  }

  _handleCollectionNameChange (name) {
    this.setState({ collectionName: name })
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

  /**
   * if usefulCount == 0 then go to  showBadAdvice: true
   *
   * @param collection
   * @param evt
   * @private
   */
  _onPressRow (collection, evt) {
    const { navigator } = this.props;
    const { insights } = collection;
    let routeParams = {
      scene: 'insights_useful',
      title: collection.name,
      collectionId: collection.id
    };
    if ( !insights.usefulCount && insights.uselessCount ) {
      routeParams = {
        ...routeParams,
        scene: 'insights_useless',
        showBadAdvice: true
      }
    }
    navigator.push(routeParams)
  }

  _addNewItem () {
    const { collectionName, } = this.state;
    return (
      <View style={ [styles.collectionItem, styles.newCollection] }>
        <View style={ styles.collectionItemInner }>
          <Icon name="folder-open-o" style={[baseStyles.crumbIcon, baseStyles.folderIcon]}/>
          <TextInput
            value={ collectionName }
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

  /**
   * @param props
   * @returns {XML}
   * @private
   */
  _renderCollectionItem (rowData, sectionID, rowID) {
    const collection = rowData.node;
    const { viewer } = this.props;

    const last = (parseInt(rowID) + 1) == viewer.collections.edges.length;
    const { addControlShow, advice } = this.state;
    const isShow = addControlShow && last;

    if ( advice ) {
      return (
        <View key={rowID}>
          <OnlyAdd
            collection={collection}
            user={viewer}
            pressRow={this._addInsightToCollection.bind(this, collection)}/>
          {!isShow ? null : this._addNewItem()}
        </View>
      )
    } else {
      return (
        <View key={rowID}>
          <UserCollectionItem
            collection={collection}
            user={viewer}
            deleteRow={ this._deleteRow }
            pressRow={ this._onPressRow.bind(this, collection) }
          />
          {!isShow ? null : this._addNewItem()}
        </View>
      )
    }
  }

  render () {
    const { viewer } = this.props;
    const { isLoadingTail, addControlShow } = this.state;

    const _scroll = ()=> {
      ScrollHandler.bind(this, {
        isLoadingTail,
        callback: !addControlShow ? this._onEndReached : () => {},
        onEndReachedThreshold: 20
      });
    }

    return (
      <View style={ styles.container }>
        <ScrollView
          onScroll={_scroll}
          ref="_scrollView"
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps={false}
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}>
          <ScrollListView
            dataSource={dataSource.cloneWithRows(viewer.collections.edges)}
            renderRow={(rowData, sectionID, rowID) => this._renderCollectionItem(rowData, sectionID, rowID)}
            pageSize={20}
            isLoadingTail={isLoadingTail}
            renderHeader={this.renderHeader}/>


          {/* infernal */}
          {!viewer.collections.edges.length ? this._addNewItem() : null  }
          <View ref="newItemInput"></View>
        </ScrollView>
      </View>
    )
  }
}


const ReduxComponent = connect()(UserCollections)
var collectionFragment = Relay.QL`
    fragment on UserCollection {
        id
        name
        insights(first : 3, filter : $filter) {
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
`;

export default Relay.createContainer(ReduxComponent, {
  initialVariables: {
    count: 20,
    filter: 'ALL'
  },
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            ${UserCollectionItem.getFragment('user')}
            ${OnlyAdd.getFragment('user')}
            collections(first: $count) {
                edges {
                    node {
                        ${collectionFragment}
                        ${AddInsightToCollectionMutation.getFragment('collection')}
                    }
                }
                pageInfo {
                    hasNextPage
                }
            }
        }
    `
  }
});
