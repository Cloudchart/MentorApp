import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import _ from 'lodash'
import { Boris, Button, TransparentButton } from '../index'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../../styles/base'
import { commentStyle, allForNowStyle, topicFinished } from './style'

const ALL_FOR_NOW_MESSAGE =
  'That\'s all for now! Want more advice more often? Human up and subscribe!'
const ALL_ENDED_MESSAGE =
  'Achievement unlocked! You have mastered all the topics, thus achieving supreme ' +
  'knowledge. I bow to you, Master'
const TOPIC_FINISHED_MESSAGE =
  'Congratulations, apprentice! You\'re not as hopeless as I thought. But no time ' +
  'to celebrate, let the learning go on!'

export const CommentBad = props => {
  const { mood, content, handleNext, handleUndo } = props
  const borisMood = mood ? mood : 'negative'
  const borisMessage = content ? content : ''
  return (
    <View style={commentStyle.container}>
      <View style={commentStyle.borisContainer}>
        <Boris
          mood={borisMood}
          size="small"
          note={borisMessage}
          />
      </View>
      <Button
        label=""
        color="green"
        onPress={() => handleNext && handleNext()}
        style={commentStyle.button}
        >
        <Text style={commentStyle.buttonText}>
          Undo
        </Text>
      </Button>
      <TransparentButton
        style={{paddingVertical: 10}}
        label='I know what I am doing'
        onPress={() => handleUndo && handleUndo()}
        color="red"
        />
    </View>
  )
}

export const CommentGood = props => {
  const { mood, content, handleNext } = props
  let borisMood = mood ? mood : 'positive'
  let borisMessage = content ? content : ''
  return (
    <View style={commentStyle.container}>
      <View style={commentStyle.borisContainer}>
        <Boris
          mood={borisMood}
          size="small"
          note={borisMessage}/>
      </View>
      <Button
        label=""
        color="green"
        onPress={() => handleNext && handleNext()}
        style={commentStyle.button}
        >
        <Text style={[commentStyle.buttonText, {marginBottom: 0}]}>
          Continue
        </Text>
      </Button>
    </View>
  )
}

export class AllForNow extends Component {

  constructor(props) {
    super(props)
    this.subscribeNow = this.subscribeNow.bind(this)
  }

  subscribeNow() {
    const { navigator } = this.props;
    navigator.push({scene: 'subscription', title: 'Subscription'})
  }

  render() {
    return (
      <View style={ allForNowStyle.container }>
        <View style={ allForNowStyle.borisContainer }>
          <Boris mood="positive" size="small" note={ALL_FOR_NOW_MESSAGE}/>
        </View>

        <Button
          onPress={this.subscribeNow}
          label=""
          color="orange"
          style={ allForNowStyle.button }>
          <Text style={ allForNowStyle.buttonText }>Subscribe now</Text>
        </Button>

      </View>
    )
  }
}

export class AllEnded extends Component {

  constructor(props) {
    super(props)
    this.subscribeNow = this.subscribeNow.bind(this)
  }

  subscribeNow() {
    const { navigator } = this.props;
    navigator.push({scene: 'subscription', title: 'Subscription'})
  }

  render() {
    return (
      <View style={ allForNowStyle.container }>
        <View style={ allForNowStyle.borisContainer }>
          <Boris mood="positive" size="small" note={ALL_ENDED_MESSAGE}/>
        </View>

        <Button
          onPress={this.subscribeNow}
          label=""
          color="green"
          style={ allForNowStyle.button }>
          <Text style={ allForNowStyle.buttonText }>Okay</Text>
        </Button>

      </View>
    )
  }
}

export class TopicFinished extends Component {

  state = {}

  constructor(props) {
    super(props)
    this.exploreTopic = this.exploreTopic.bind(this)
  }

  exploreTopic() {
    const { navigator } = this.props;
    navigator.push({
      scene: 'select_topics',
      title: 'Select up to 3 topics to start:',
      filterUserAddedTopic: true
    })
  }

  /**
   *s
   * @returns {XML}
   */
  render() {
    return (
      <View style={ allForNowStyle.container }>
        <View>
          <Text style={topicFinished.text}>{`You're done!`}</Text>
        </View>
        <View style={topicFinished.star}>
          <Icon name="star" style={styles.crumbIconStar}/>
        </View>

        <View style={ allForNowStyle.borisContainer }>
          <Boris mood="positive" size="small" note={TOPIC_FINISHED_MESSAGE}/>
        </View>

        <Button
          onPress={this.exploreTopic}
          label=""
          color="green"
          style={ allForNowStyle.button }>
          <Text style={ allForNowStyle.buttonText }>Add another topic </Text>
        </Button>

        <TransparentButton
          style={{paddingVertical: 20, marginTop: 5}}
          label="Continue learning"
          onPress={this.props.continueLearning}
          color="green"
          />

      </View>
    )
  }
}
