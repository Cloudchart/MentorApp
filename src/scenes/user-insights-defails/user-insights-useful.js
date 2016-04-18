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
import { EventManager } from '../../event-manager';
import { connect } from "react-redux";
import { Boris, Button, ScrollListView, Insight } from "../../components";
import Advice from "./advice";
import Empty from "./empty";
import {
  SET_CURRENT_COLLECTION,
  UPDATE_COLLECTIONS,
  UPDATE_ADVICES_COLLECTIONS,
  setUselessAction,
  setUsefulAction
} from "../../actions/actions";
import {
  MarkInsightUsefulInCollectionMutation,
  MarkInsightUselessInCollectionMutation
} from "../../mutations";
import styles from "./style";


const BorisNoteForSubscription = `Grow your business like a bamboo. No, better than a bamboo!`;

class UserInsightsUseful extends Component {

  state = {
    listInsights: [],
    is_empty: false,
    scrollEnabled: true,
    isLoadingTail: false,
    addControlShow: false,
    pan: new Animated.ValueXY(),
    enter: new Animated.Value(0.9),
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  }


  constructor (props) {
    super(props)
    this.saveTimeout = null;
    this._onSwipeStart = this._onSwipeStart.bind(this)
    this._opacityOff = this._opacityOff.bind(this)
    this._forceFetch = this._forceFetch.bind(this);

    EventManager.addListener(UPDATE_ADVICES_COLLECTIONS, this._forceFetch)
  }

  componentWillReceiveProps (nextProps) {
    const { insightsUseful } = nextProps.node;
    const thisUseful = this.props.node.insightsUseful;

    if ( insightsUseful.edges.length != thisUseful.edges.length ) {
      this._updateBasket(nextProps)
      this.state.listInsights = insightsUseful.edges;
    }
    if ( !insightsUseful.edges.length ) {
      this.setState({ is_empty: true })
    } else {
      this.state.is_empty = false;
    }
  }

  componentWillMount () {
    const { insightsUseful } = this.props.node;
    this.state.listInsights = insightsUseful.edges;
    this.state.dataSource = this.state.dataSource.cloneWithRows(this.state.listInsights);
    this._updateBasket(this.props)
  }

  componentWillUnmount () {
    EventManager.removeListener(UPDATE_ADVICES_COLLECTIONS, this._forceFetch);
    this.saveTimeout = null;
  }


  /**
   * update the basket in navBar
   * @private
   */
  _updateBasket (nextProps) {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(()=> {
      const { dispatch } = this.props;
      dispatch({ type: SET_CURRENT_COLLECTION, collection: nextProps.node })
    }, 66)
  }

  /**
   *
   * @private
   */
  _onEndReached () {

  }

  _onSwipeStart (prop) {
    this.setState({
      scrollEnabled: prop
    })
  }

  _opacityOff () {

  }


  _onShare () {}

  _forceFetch () {
    this.props.relay.forceFetch();
    // TODO : update prev screen { user collections }
    EventManager.emit(UPDATE_COLLECTIONS)
  }

  _renderInsight (rowData, sectionID, rowID) {
    return (
      <Advice
        key={rowID}
        collection={this.props.node}
        opacityOff={this._opacityOff}
        insight={rowData.node}
        isBadAdviceList={this.props.showBadAdvice}
        onSwipeStart={this._onSwipeStart}
        forceFetch={this._forceFetch}
        onShare={this._onShare}/>
    )
  }

  _renderList () {
    const { listInsights } = this.state;
    if ( !listInsights.length ) return null;
    return listInsights.map((collection, index)=> {
      return this._renderInsight(collection, null, index)
    })
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    const { scrollEnabled, is_empty } = this.state;

    if ( is_empty ) {
      return <Empty />
    }

    return (
      <View style={ styles.container }>
        <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={true}>
          <ButtonsBoris />
          <View style={styles.scroll}>
            {this._renderList()}
          </View>
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



var insightFragment = Relay.QL`
    fragment on Insight {
        id
        content
        origin {
            author
            url
            title
            duration
        }
    }
`;

const ReduxComponent = connect()(UserInsightsUseful);

export default Relay.createContainer(ReduxComponent, {
  initialVariables: {
    countInsights: 100
  },
  fragments: {
    node : () => Relay.QL`
        fragment on UserCollection {
            id
            name
            insights(first : 1, filter : ALL) {
                usefulCount
                uselessCount
            }
            insightsUseless: insights(first : $countInsights, filter : USELESS) {
                usefulCount
                uselessCount
                edges {
                    node {
                        ${insightFragment}
                    }
                }
            }
            insightsUseful: insights(first : $countInsights, filter : USEFUL) {
                usefulCount
                uselessCount
                edges {
                    node {
                        ${insightFragment}
                    }
                }
            }
        }
    `,
    viewer: () => Relay.QL`
        fragment on User {
            id
        }
    `
  }
});
