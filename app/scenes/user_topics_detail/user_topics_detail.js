import React, {
  Component,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  ListView,
  AlertIOS,
  Animated,
  Easing,
  Dimensions,
  ActionSheetIOS,
  PanResponder
} from "react-native";
import Relay from 'react-relay';
import { connect } from "react-redux";
import { Boris, Button, Loader, ScrollListView, Insight } from "../../components";
import styles from "./style";
import Advice from "./advice";
import { UPDATE_ADVICE_INTO_COLLECTION } from "../../actions/actions";

const BorisNoteForSubscription = `Grow your business like a bamboo. No, better than a bamboo!`;

let dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

let COLLECTION_ID = null;

class UserTopicsDetail extends Component {

  constructor (props) {
    super(props)

    if ( props.collectionId ) {
      COLLECTION_ID = props.collectionId;
    }

    this.state = {
      allAdviceOpacityOn: false,
      loader: true,
      scrollEnabled: true,
      isLoadingTail: false,
      addControlShow: false,
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.9),
      showBad: false
    };

    this._onSwipeStart = this._onSwipeStart.bind(this)
    this._opacityOff = this._opacityOff.bind(this)
    this._onMarkBad = this._onMarkBad.bind(this)
    this._onShare = this._onShare.bind(this);
    this._onMarkGood = this._onMarkGood.bind(this)
    this._selectTopic = this._selectTopic.bind(this)
  }

  componentDidMount () {
    setTimeout(()=> {
      this.setState({ loader: false })
    }, 500)
  }

  getAdvices () {
    const { showBadAdvice, collections } = this.props;
    if ( COLLECTION_ID && !showBadAdvice ) {
      return this.findGoodAdvices(collections.list, COLLECTION_ID)
    } else if ( COLLECTION_ID && showBadAdvice ) {
      return this.findBadAdvices(collections.list, COLLECTION_ID)
    }
  }

  componentWillUnmount () {

  }

  /**
   *
   * @private
   */
  _onEndReached () {

  }


  /**
   *
   * @param id
   * @private
   */
  _selectTopic (topic) {

  }

  _onSwipeStart (prop) {
    this.setState({
      scrollEnabled: prop
    })
  }

  _opacityOff () {
    this.setState({ allAdviceOpacityOn: false })
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
   *
   * @param collections
   * @param id
   * @returns {Array.<T>}
   */
  findBadAdvices (collections, id) {
    const col = this.findCollectionById(collections, id)
    //const advices = col.advices.filter((advice) => advice.bad ? true : false);
    //return advices;
  }

  findGoodAdvices (collections, id) {
    const col = this.findCollectionById(collections, id)
    //return col.advices.filter((advice) => !advice.bad);
  }

  /**
   *
   * @param currentAdvice
   * @private
   */
  _onMarkBad (currentAdvice) {
    const { dispatch, collections } = this.props;
    const collection = this.findCollectionById(collections.list, COLLECTION_ID)

    dispatch({
      type: UPDATE_ADVICE_INTO_COLLECTION,
      data: { collection, currentAdvice }
    })
  }

  /**
   *
   * if bad advices count < 1, then return back
   *
   * @param currentAdvice
   * @private
   */
  _onMarkGood (currentAdvice) {
    const { dispatch, collections, navigator } = this.props;
    const collection = this.findCollectionById(collections.list, COLLECTION_ID)


    dispatch({
      type: UPDATE_ADVICE_INTO_COLLECTION,
      data: {
        collection,
        currentAdvice,
        positive: true
      }
    })

    let countBadAdvice = this.findBadAdvices(collections.list, COLLECTION_ID);
    if ( !countBadAdvice.length ) {
      navigator.pop()
    }
  }

  _goNextAdvice () {
    const { advices } = this.props;
    let current = advices.list.indexOf(this.state.currentAdvice);
    let newIdx = current + 1;

    this.setState({
      currentAdvice: advices.list[ newIdx ]
    });
  }

  _onShare (currentAdvice) {
    ActionSheetIOS.showShareActionSheetWithOptions({
        url: currentAdvice.url || '',
        message: currentAdvice.text,
        subject: 'a subject to go in the email heading'
      },
      (error) => {
        //console.error(error);
      },
      (success, method) => {
        var text;
        if ( success ) {
          text = `Shared via ${method}`;
        } else {
          text = 'You didn\'t share';
        }
        //this.setState({text});
      });
  }

  _card (props, i) {
    return <Advice
      allAdviceOpacityOn={this.state.allAdviceOpacityOn}
      opacityOff={this._opacityOff}
      currentAdvice={props}
      key={i}
      isBadAdviceList={this.props.showBadAdvice}
      onSwipeStart={this._onSwipeStart}
      onMarkBad={this._onMarkBad}
      onMarkGood={this._onMarkGood}
      onShare={this._onShare}
      selectTopic={this._selectTopic}/>
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    const { loader, isLoadingTail, scrollEnabled } = this.state;

    if ( loader ) {
      return <Loader />
    }

    let advices = this.getAdvices();

    return (
      <View style={ styles.container }>
        <ScrollView scrollEnabled={scrollEnabled} showsVerticalScrollIndicator={true}>
          <ButtonsBoris />
          {!advices || !advices.length ? null :
            <ScrollListView
              scrollEnabled={scrollEnabled}
              key={advices}
              dataSource={dataSource.cloneWithRows(advices)}
              renderRow={(props) => this._card(props)}
              isLoadingTail={isLoadingTail}
              onEndReached={this._onEndReached.bind(this)}
              onEndReachedThreshold={20}
              showsVerticalScrollIndicator={true}
              style={styles.scroll}
            />
          }
        </ScrollView>
      </View>
    )
  }
}

const ButtonsBoris = (props) => (
  <View style={ styles.borisContainer }>
    <Boris mood="positive" size="small" note={ BorisNoteForSubscription }/>
  </View>
)


const ReduxComponent = connect(state => ({
  user: state.user,
  collections: state.collections,
  currentCollection: state.collections.currentCollection
}))(UserTopicsDetail)

export default Relay.createContainer(ReduxComponent, {
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            collections(first: 100) {
                edges {
                    node {
                        id
                    }
                }
            }
        }
    `
  }
});
