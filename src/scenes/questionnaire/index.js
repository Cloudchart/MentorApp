import React, {
    Component,
    StyleSheet,
    View,
    Text,
    ListView,
    ScrollView,
    TouchableOpacity
} from "react-native";
import Relay from 'react-relay';
import { connect } from "react-redux";
import { Boris, Answers, ScrollListView, Loader } from "../../components";
import styles from "./style";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})


class Questionnaire extends Component {

  constructor (props) {
    super(props)
    this.state = {
      loader: true,
      isLoadingTail: false,
      addControlShow: false
    };
  }

  componentDidMount () {
    /*setTimeout(()=> {
      this.setState({ loader: false })
    }, 1000)*/
  }

  _onSelect (key) {
    const { navigator } = this.props;
    navigator.push({
      scene: 'select_topics',
      title: 'Select up to 3 topics to start:',
      data: { key }
    })
  }

  _onEndReached () {

  }

  render () {
    const { loader, isLoadingTail } = this.state;
    const { questions } = this.props;

    /*if ( loader ) {
      return <Loader />
    }*/

    return (
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>

            <Boris
                size="small"
                mood="positive"
                note={"Tell me a bit about yourself so I can fine-tune my advice engines for you!"}
                style={ styles.boris }
            />

            <ListView
                dataSource={dataSource.cloneWithRows(questions.list)}
                renderRow={(props, sectionID, rowID) => {
                    return <Answer {...props}
                      questionsCount={questions.list.length}
                      rowID={rowID}
                      onSelect={this._onSelect.bind(this)} />
                  }}
                pageSize={14}
                isLoadingTail={isLoadingTail}
                onEndReached={this._onEndReached.bind(this)}
                onEndReachedThreshold={20}
                showsVerticalScrollIndicator={false}
                style={styles.answerList}
            />
          </ScrollView>
        </View>
    )
  }
}

/**
 *
 * @param props
 * @returns {XML}
 * @constructor
 */

class Answer extends Component {

  constructor (props) {
    super(props)

    this.onSelect = this.props.onSelect.bind(null, this.props.id)
  }

  render () {
    return (
        <TouchableOpacity
            onPress={this.onSelect}
            key={ this.props.key }
            activeOpacity={ 0.75 }
            style={styles.answer}>
          <Text style={ styles.answerText }>
            { this.props.value }
          </Text>
        </TouchableOpacity>
    )
  }
}


const ReduxComponent = connect(state => ({
  questions: state.questions
}))(Questionnaire)

export default Relay.createContainer(ReduxComponent, {
  fragments: {
    viewer: () => Relay.QL`     
      fragment on User {       
        topics(first: 100, filter: DEFAULT) {
          edges {
            node {
              name
            }
          }
        }
      }
    `
  }
});

