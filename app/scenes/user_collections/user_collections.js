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
    CREATE_COLLECTIONS,
    ADD_TO_COLLECTIONS,
    DELETE_COLLECTIONS,
    ACTION_ADD_USER_COLLECTION,
    USER_MARK_ADVICE
} from "../../module_dal/actions/actions";
import { EventManager } from "../../event_manager";
import { connect } from "react-redux";
import UserCollectionItem from "./collection_item";
import OnlyAdd from "./only_add";
import AddNewItem from "./add_new_item";
import styles from "./style";
import { _flex } from "../../styles/base";


const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class UserCollections extends Component {

  constructor (props) {
    super(props)

    this.state = {
      loader: true,
      isLoadingTail: false,
      collectionName: '',
      addControlShow: false
    };

    this._add = this._showControlAddNewItem.bind(this);
    EventManager.addListener(ACTION_ADD_USER_COLLECTION, this._add);

    this.keyboardDidShowSubscription = DeviceEventEmitter.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', this._keyboardWillHide.bind(this));


    this._deleteRow = this._deleteRow.bind(this);
    this._onPressRow = this._onPressRow.bind(this);

    this._handleCollectionNameChange = this._handleCollectionNameChange.bind(this);
    this._handleCollectionNameEdit = this._handleCollectionNameEdit.bind(this);
    this._handleCollectionNameBlur = this._handleCollectionNameBlur.bind(this);
    this._onEndReached = this._onEndReached.bind(this);
  }

  componentDidMount () {
    setTimeout(()=> {
      this.setState({ loader: false })
    }, 1000)
  }

  componentWillMount () {
    this.state.advice = this.props.advice;
  }

  componentWillUnmount () {
    EventManager.removeListener(ACTION_ADD_USER_COLLECTION, this._add);
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
    const { collections } = this.props;
    if ( collections.list.length && collections.list.length > 3 ) {
      setTimeout(() => {
        let scrollResponder = this.refs._scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            React.findNodeHandle(this.refs[ 'newItemInput' ]),
            100
        );
      }, 50);
    }
  }

  /**
   *
   * @param frames
   * @private
   */
  _keyboardWillHide (frames) {
    let scrollResponder = this.refs._scrollView.getScrollResponder();
    scrollResponder.scrollTo({ y: 0, animated: true })
  }

  /**
   *
   * @returns {boolean}
   * @private
   */
  _showControlAddNewItem () {
    if ( this.state.loader || this.state.addControlShow ) return false;
    this.setState({ addControlShow: true })
  }

  /**
   * Add new collection_item
   * @returns {boolean}
   * @private
   */
  _createNewUserCollection () {
    const { dispatch } = this.props;
    if ( this.state.loader ) return false;
    dispatch({
      type: CREATE_COLLECTIONS,
      data: {
        id: Math.random() * 100,
        name: this.state.collectionName,
        count: Infinity
      }
    })
    this.setState({ collectionName: '' })
  }

  /**
   *
   * @param collections
   * @param id
   * @returns {*|T}
   */
  findCollectionById (collections, id) {
    return collections.find((item) => item.id == id)
  }

  /**
   * add new advice to collection
   * after add, remove {this.props.advice = null};
   * @param collectionId
   * @private
   */
  _addToCollectionAdvice (collectionId) {
    const { dispatch, navigator } = this.props;

    dispatch({
      type: USER_MARK_ADVICE,
      id: this.state.advice.id
    })

    dispatch({
      type: ADD_TO_COLLECTIONS,
      data: {
        id: collectionId,
        advice: this.state.advice
      }
    })

    setTimeout(()=> {
      navigator.pop()
    }, 300)
  }

  _handleCollectionNameChange (name) {
    this.setState({ collectionName: name })
  }

  _handleCollectionNameEdit () {
    //console.log('done')
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


  /**
   * delete item from collections
   * @param id
   * @private
   */
  _deleteRow (id) {
    const { dispatch } = this.props;
    dispatch({ type: DELETE_COLLECTIONS, id })
  }

  _onEndReached () {
    let { dispatch } = this.props;
  }

  /**
   *
   * @private
   */
  _onPressRow (id, evt) {
    const { collections, navigator } = this.props;
    const collection = this.findCollectionById(collections.list, id);

    navigator.push({
      scene: 'topic_detail',
      title: collection.name,
      collectionId: id
    })
  }

  collectionItem (props) {
    if ( this.state.advice ) {
      return <OnlyAdd {...props} pressRow={this._addToCollectionAdvice.bind(this)}/>
    } else {
      return <UserCollectionItem
          {...props}
          deleteRow={ this._deleteRow }
          pressRow={ this._onPressRow }
      />
    }
  }

  render () {
    const { collections } = this.props;
    const { loader, isLoadingTail, addControlShow, collectionName } = this.state;

    if ( loader ) {
      return <Loader />
    }

    return (
        <View style={ styles.container }>
          <ScrollView ref="_scrollView">
            {!collections.list.length ? null :
                <ScrollListView
                    dataSource={dataSource.cloneWithRows(collections.list)}
                    renderRow={(props) => this.collectionItem(props)}
                    pageSize={14}
                    isLoadingTail={isLoadingTail}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={20}
                    showsVerticalScrollIndicator={false}
                    style={ _flex }
                />}

            {!addControlShow ? null :
                <AddNewItem
                    ref="newItemInput"
                    collectionName={collectionName}
                    onChangeText={ this._handleCollectionNameChange }
                    onEndEditing={ this._handleCollectionNameEdit }
                    onBlur={ this._handleCollectionNameBlur }/>}
          </ScrollView>
        </View>
    )
  }
}

export default connect(state => ({
  collections: state.collections
}))(UserCollections)
