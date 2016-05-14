import React, {
  Component,
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import Relay from 'react-relay'
import { Boris, Answers, ScrollListView, Loader } from '../../components'
import Button from '../../components/button'
import {
  CommentGood,
  CommentBad,
} from '../../components/confirmation-screens/insights-parts'
import AnswerTheQuestionMutation from '../../mutations/answer-the-question'
import styles, { reactionStyles } from './style'

const PAGE_SIZE = 30
const getBorisNoteForQuestion = ({ content }) => (
  `Tell me something about yourself so I can adjust my setup to serve you better.        ${content}`
)

class QuestionnaireScene extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      questionIndex: 0,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isAnswerPending: false,
      lastAnswerReaction: null,
    }
  }

  componentDidMount() {
    const { viewer, navigator, isFirstLaunch } = this.props
    const { edges } = viewer.questions
    if (edges.length === 0) {
      if (isFirstLaunch) {
        const { availableSlotsCount } = viewer.topics
        navigator.push({
          scene: 'select_topics',
          title: 'Select up to ' + availableSlotsCount + ' topics to start:',
          isFirstLaunch,
        })
        return
      }
      navigator.push({
        scene: 'insights',
        title: '',
        filter: 'UNRATED',
      })
      return
    }
    this.setState({
      dataSource: this._getDataSource(viewer.questions),
    })
  }

  componentWillReceiveProps(nextProps) {
    const { viewer } = this.props
    if (nextProps.viewer.questions !== viewer.questions) {
      const { questions } = nextProps.viewer
      this.setState({
        dataSource: this._getDataSource(questions),
      })
    }
  }

  _getDataSource(questions) {
    const { dataSource, questionIndex } = this.state
    let answers
    if (questions.edges[questionIndex]) {
      const question = questions.edges[questionIndex].node
      answers = question.answers.edges
    } else {
      answers = []
    }
    this._data = [].concat(answers)
    return dataSource.cloneWithRows(this._data)
  }

  handleEndReached() {
    const { relay, viewer } = this.props
    const { pageInfo } = viewer.questions
    if (!pageInfo || !pageInfo.hasNextPage) {
      return
    }
    const { count } = relay.variables
    this.setState({
      isLoadingTail: true,
    })
    relay.setVariables({
      count: count + PAGE_SIZE,
    }, transaction => {
      if (transaction.done) {
        this.setState({
          isLoadingTail: false,
        })
      }
    })
  }

  handleSelect(questionID, answerID) {
    const { navigator, goAfterFinish, goAfterFinishProps } = this.props
    this.setState({
      isAnswerPending: true,
      answerReaction: null,
    })
    const mutation = new AnswerTheQuestionMutation({
      questionID,
      answerID,
    })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: response => {
        if (response) {
          const { viewer } = this.props
          const { questions, topics } = viewer
          const { questionIndex } = this.state
          const { answers } = questions.edges[questionIndex].node
          // try to get reaction for the answer
          let isFinished = true
          answers.edges.forEach(({ node }) => {
            if (node.id === answerID && node.reaction) {
              isFinished = false
              this.setState({
                lastAnswerReaction: node.reaction,
              })
            }
          })
          // try to seek to the next question
          if (questions.edges[questionIndex + 1]) {
            isFinished = false
            this.setState({
              questionIndex: questionIndex + 1,
            })
            return
          }
          if (isFinished === false) {
            this.setState({
              isAnswerPending: false,
            })
            return
          }
          this._showNextScreen()
        } else {
          this.setState({
            isAnswerPending: false,
          })
        }
      },
      onFailure: () => {
        this.setState({
          isAnswerPending: false,
          lastAnswerReaction: null,
        })
      }
    })
  }

  handleConfirmReactionPress() {
    const { viewer } = this.props
    const { questionIndex } = this.state
    if (viewer.questions.edges[questionIndex + 1]) {
      this.setState({
        questionIndex: questionIndex + 1,
        lastAnswerReaction: null,
      })
      return
    }
    this._showNextScreen()
  }

  _showNextScreen() {
    const { viewer, navigator } = this.props
    const { topics } = viewer
    const { availableSlotsCount } = topics
    const nextRoute = {
      scene: 'select_topics',
      title: 'Select up to ' + availableSlotsCount + ' topics to start:',
    }
    navigator.push(nextRoute)
  }

  _renderAnswer(rawData, sectionID, rowID) {
    const { questions } = this.props.viewer
    const { questionIndex } = this.state
    const question = questions.edges[questionIndex].node
    return (
      <Answer
        {...rawData.node}
        rowID={rowID}
        onSelect={() => this.handleSelect(question.id, rawData.node.id)}
        />
    )
  }

  render () {
    const { isLoadingTail, questionIndex, isAnswerPending, lastAnswerReaction } = this.state
    const { questions } = this.props.viewer
    const question =
      questions.edges[questionIndex] &&
        questions.edges[questionIndex].node
    if (!question) {
      return null
    }
    if (isAnswerPending) {
      return (
        <Loader />
      )
    }
    if (lastAnswerReaction) {
      return (
        <View style={reactionStyles.container}>
          <View style={reactionStyles.borisContainer}>
            <Boris
              mood={lastAnswerReaction.mood}
              notAnimate={true}
              size="small"
              note={lastAnswerReaction.content}
              randomId={(Math.random(1000) * 100).toString(16)}
              />
          </View>
          <Button
            label=""
            color="green"
            onPress={() => this.handleConfirmReactionPress()}
            style={reactionStyles.button}
            >
            <Text style={reactionStyles.buttonText}>
              Got it
            </Text>
          </Button>
        </View>
      )
    }
    const answers = question.answers.edges
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Boris
            size="small"
            mood="positive"
            note={getBorisNoteForQuestion(question)}
            style={styles.boris}
          />
          {(answers.length > 0) && (
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rawData, sectionID, rowID) => this._renderAnswer(rawData, sectionID, rowID)}
              pageSize={PAGE_SIZE}
              isLoadingTail={isLoadingTail}
              onEndReached={() => this.handleEndReached()}
              onEndReachedThreshold={20}
              showsVerticalScrollIndicator={false}
              style={styles.answerList}
            />
          )}
        </ScrollView>
      </View>
    )
  }
}

const Answer = ({ content, onSelect }) => (
  <TouchableOpacity
    onPress={onSelect}
    activeOpacity={ 0.75 }
    style={styles.answer}>
    <Text style={styles.answerText}>
      {content}
    </Text>
  </TouchableOpacity>
)

const reactionFragment = Relay.QL`
  fragment on BotReaction {
    id
    mood
    content
  }
`

const answerFragment = Relay.QL`
  fragment on Answer {
    id
    content
    position
    reaction {
      ${reactionFragment}
    }
  }
`

const questionFragment = Relay.QL`
  fragment on Question {
    id
    content
    reaction {
      ${reactionFragment}
    }
    answers(first: $count) {
      edges {
        node {
          ${answerFragment}
        }
      }
    }
  }
`

export default Relay.createContainer(QuestionnaireScene, {
  initialVariables: {
    count: 30,
    filter: 'UNANSWERED',
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        topics {
          availableSlotsCount
        }
        questions(first: 100, filter: $filter) {
          edges {
            node {
              ${questionFragment}
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `
  },
})
