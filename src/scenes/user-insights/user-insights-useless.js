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
import _ from 'lodash';
import { connect } from "react-redux";
import { Boris, Button, ScrollListView, Insight } from "../../components";
import Advice from "./advice";
import Empty from "./empty";
import {
  SET_CURRENT_COLLECTION,
  UPDATE_COLLECTIONS,
  UPDATE_ADVICES_COLLECTIONS,
} from "../../actions/application";

import styles from "./style";


const BorisNoteForSubscription = `Grow your business like a bamboo. No, better than a bamboo!`;


class UserInsightsUseless extends Component {

  state = {
    scrollEnabled: true,
    isLoadingTail: false,
    addControlShow: false,
    pan: new Animated.ValueXY(),
    enter: new Animated.Value(1),
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  }

  constructor (props) {
    super(props)
    this.saveTimeout = null;
    this.replace = false;
    this._onSwipeStart = this._onSwipeStart.bind(this);
    this._opacityOff = this._opacityOff.bind(this);
    this._forceFetch = this._forceFetch.bind(this);
    this._updatePrevScreen = _.throttle(this._updatePrevScreen.bind(this), 200);
  }

  componentWillReceiveProps (nextProps) {
    const { insightsUseless } = nextProps.node;
    const thisUseless = this.props.node.insightsUseless;

    if ( insightsUseless.edges.length != thisUseless.edges.length ) {
      this._updateBasket(nextProps)
      this._updatePrevScreen()
      this.state.listInsights = insightsUseless.edges;
    }

    if ( !insightsUseless.edges.length && !this.replace ) {
      this.replace = true;
      this.setState({ is_empty: true })
    } else if ( insightsUseless.edges.length ) {
      this.replace = false;
    }
  }

  componentWillMount () {
    const { insightsUseless } = this.props.node;
    this.state.listInsights = insightsUseless.edges;
    this.state.dataSource = this.state.dataSource.cloneWithRows(this.state.listInsights);
    this._updateBasket(this.props)
  }

  _updatePrevScreen () {
    EventManager.emit(UPDATE_ADVICES_COLLECTIONS);
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
        navigator={this.props.navigator}
        isBadAdviceList={this.props.showBadAdvice}
        onSwipeStart={this._onSwipeStart}
        forceFetch={this._forceFetch}/>
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
          automaticallyAdjustContentInsets={true}
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


const ReduxComponent = connect()(UserInsightsUseless);
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
