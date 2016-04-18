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
import { Boris, Answers, ScrollListView, Loader } from "../../components";
import { answerTheQuestion } from "../../actions/questions";
import styles from "./style";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})


class Questionnaire extends Component {

  static defaultProps = {
    questions: {}
  }

  state = {
    isLoadingTail: false,
    addControlShow: false
  }

  constructor (props) {
    super(props)

    this.PAGE_SIZE = 30;
  }

  componentDidMount () {

  }

  _onSelect (questionID, answerID) {
    const { navigator } = this.props;

    answerTheQuestion({ questionID, answerID })
      .then((transaction)=> {
        navigator.push({
          scene: 'select_topics',
          title: 'Select up to 3 topics to start:'
        })
      })
  }

  _onEndReached () {
    const { relay, viewer, questions } = this.props;
    let pageNext = questions.pageInfo;
    let count = relay.variables.count;

    if ( !pageNext || !pageNext.hasNextPage ) {
      return;
    }

    this.setState({ isLoadingTail: true })
    relay.setVariables({ count: count + this.PAGE_SIZE }, (transaction) => {
      if ( transaction.done ) this.setState({ isLoadingTail: false })
    });
  }

  _renderAnswer (rawData, sectionID, rowID) {
    const { questions } = this.props.viewer;
    const question = questions.edges[ 0 ].node;
    return (
      <Answer
        {...rawData.node}
        rowID={rowID}
        onSelect={this._onSelect.bind(this, question.id, rawData.node.id)}/>
    )
  }

  render () {
    const { isLoadingTail } = this.state;
    const { questions } = this.props.viewer;

    if ( !questions.edges.length ) {
      return null;
    }

    const question = questions.edges[ 0 ].node;
    const answers = question.answers.edges;

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <Boris
            size="small"
            mood="positive"
            note={`Tell me something about yourself so I can adjust my setup to serve you better.        ${question.content}`}
            style={ styles.boris }
          />

          {!answers.length ? null :
            <ListView
              dataSource={dataSource.cloneWithRows(answers)}
              renderRow={(rawData, sectionID, rowID) => this._renderAnswer(rawData, sectionID, rowID)}
              pageSize={30}
              isLoadingTail={isLoadingTail}
              onEndReached={this._onEndReached.bind(this)}
              onEndReachedThreshold={20}
              showsVerticalScrollIndicator={false}
              style={styles.answerList}
            />}
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

  static defaultProps = {
    id: 0,
    content: '',
    position: 1,
    reaction: {
      id: 0,
      scope: '',
      mood: '',
      content: '',
      weight: 0
    }
  }

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <TouchableOpacity
        onPress={this.props.onSelect}
        activeOpacity={ 0.75 }
        style={styles.answer}>
        <Text style={ styles.answerText }>
          { this.props.content }
        </Text>
      </TouchableOpacity>
    )
  }
}


var botReactionFragment = Relay.QL`
    fragment on BotReaction {
        id
        mood
        content
    }
`;

var answerFragment = Relay.QL`
    fragment on Answer {
        id
        content
        position
        reaction {
            ${botReactionFragment}        
        }
    }
`;

var questionFragment = Relay.QL`
    fragment on Question {
        id
        content
        reaction {
            ${botReactionFragment}
        }
        answers(first: 100) {
            edges {
                node {
                    ${answerFragment}
                }
            }
        }

    }
`;


export default Relay.createContainer(Questionnaire, {
  initialVariables: {
    count: 30,
    filter: 'ALL'
  },
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            questions(first: $count) {
                edges {
                    node {
                        ${questionFragment}
                    }
                }
                pageInfo {
                    hasNextPage
                    startCursor
                    endCursor
                }
            }
        }
    `
  }
});



