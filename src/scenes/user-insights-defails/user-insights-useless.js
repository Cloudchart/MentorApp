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
import { SET_CURRENT_COLLECTION, UPDATE_COLLECTIONS } from "../../actions/actions";
import styles from "./style";


const BorisNoteForSubscription = `Grow your business like a bamboo. No, better than a bamboo!`;
let dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})


class UserInsightsUseless extends Component {

  constructor (props) {
    super(props)

    this.state = {
      allAdviceOpacityOn: false,
      scrollEnabled: true,
      isLoadingTail: false,
      addControlShow: false,
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.9)
    };

    this.saveTimeout = null;
    this._onSwipeStart = this._onSwipeStart.bind(this);
    this._opacityOff = this._opacityOff.bind(this);
    this._forceFetch = this._forceFetch.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    this._updateBasket()
  }

  componentWillMount () {
    this._updateBasket()
  }

  /**
   * update the basket in navBar
   * @private
   */
  _updateBasket () {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(()=> {
      const { node, dispatch } = this.props;
      dispatch({ type: SET_CURRENT_COLLECTION, collection: node })
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
    this.setState({ allAdviceOpacityOn: false })
  }

  _onShare (insight) {
    ActionSheetIOS.showShareActionSheetWithOptions({
        url: insight.origin.url || '',
        message: insight.content,
        subject: 'a subject to go in the email heading'
      },
      (error) => {},
      (success, method) => {}
    );
  }

  _renderInsight (rowData, sectionID, rowID) {
    const insight = rowData.node;
    return <Advice
      collection={this.props.node}
      navigator={this.props.navigator}
      allAdviceOpacityOn={this.state.allAdviceOpacityOn}
      opacityOff={this._opacityOff}
      insight={insight}
      isBadAdviceList={this.props.showBadAdvice}
      onSwipeStart={this._onSwipeStart}
      forceFetch={this._forceFetch}
      onShare={this._onShare.bind(this, insight)}/>
  }

  _forceFetch () {
    this.props.relay.forceFetch()

    // TODO : update prev screen { user collections }
    EventManager.emit(UPDATE_COLLECTIONS)
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    const { isLoadingTail, scrollEnabled } = this.state;
    const { node } = this.props;
    return (
      <View style={ styles.container }>
        <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={true}>
          <ButtonsBoris />

          {!node.insights.edges || !node.insights.edges.length ? null :
            <ScrollListView
              scrollEnabled={scrollEnabled}
              dataSource={dataSource.cloneWithRows(node.insights.edges)}
              renderRow={(rowData, sectionID, rowID) => this._renderInsight(rowData, sectionID, rowID)}
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
    countInsights: 100,
    filter: 'USELESS'
  },
  fragments: {
    node : () => Relay.QL`
        fragment on UserCollection {
            id
            name
            insights(first : $countInsights, filter : $filter) {
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
