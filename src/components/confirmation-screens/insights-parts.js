import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import Relay from 'react-relay';
import _ from 'lodash';
import { Boris, Button, TransparentButton } from "../index";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../../styles/base";
import { commentStyle, allForNowStyle, topicFinished } from "./style";

const BorisNote = "That's all for now! Want more advice more often? Human up and subscribe!";
const BorisNoteAllEnded = "Achievement unlocked! You have mastered all the topics, thus achieving supreme knowledge. I bow to you, Master";
const BorisNoteTopicFinished = "Congratulations, apprentice! You're not as hopeless as I thought. But no time to celebrate, let the learning go on!";


class CommentBad extends Component {

  state = {
    user: null
  }

  constructor (props) {
    super(props)
    this._undo = this.props.undo.bind(this, 'undo');
    this._delete = this.props.undo.bind(this, 'delete');
  }

  render () {
    const { dislikeReaction } = this.props;
    const { mood, content } = dislikeReaction;
    let ifMood = mood ? mood : 'negative';
    let ifContent = content ? content : '';

    return (
      <View style={ commentStyle.container }>
        <View style={ commentStyle.borisContainer }>
          <Boris
            mood={ifMood}
            size="small"
            note={ifContent}/>
        </View>

        <Button
          label=""
          color="green"
          onPress={this._undo}
          style={ commentStyle.button }>
          <Text style={ commentStyle.buttonText }>Undo</Text>
        </Button>

        <TransparentButton
          style={{paddingVertical: 10}}
          label="I know what I am doing"
          onPress={this._delete}
          color="red"
        />

      </View>
    )
  }
}

class CommentGood extends Component {

  state = {
    user: null
  }

  constructor (props) {
    super(props)
    this._continue = this.props.continue.bind(this);
  }

  render () {
    const { likeReaction } = this.props;
    const { mood, content } = likeReaction;
    let ifMood = mood ? mood : 'positive';
    let ifContent = content ? content : '';


    return (
      <View style={ commentStyle.container }>
        <View style={ commentStyle.borisContainer }>
          <Boris
            mood={ifMood}
            size="small"
            note={ifContent}/>
        </View>

        <Button
          label=""
          color="green"
          onPress={this._continue}
          style={ commentStyle.button }>
          <Text style={ [commentStyle.buttonText, {marginBottom: 0}] }>Continue</Text>
        </Button>
      </View>
    )
  }
}

class AllForNow extends Component {

  state = {}

  constructor (props) {
    super(props)
    this.subscribeNow = this.subscribeNow.bind(this)
  }

  subscribeNow () {
    const { navigator } = this.props;
    navigator.push({ scene: 'subscription', title: 'Subscription' })
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    return (
      <View style={ allForNowStyle.container }>
        <View style={ allForNowStyle.borisContainer }>
          <Boris mood="positive" size="small" note={ BorisNote }/>
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

class AllEnded extends Component {


  state = {}

  constructor (props) {
    super(props)
    this.subscribeNow = this.subscribeNow.bind(this)
  }

  subscribeNow () {
    const { navigator } = this.props;
    navigator.push({ scene: 'subscription', title: 'Subscription' })
  }

  /**
   *s
   * @returns {XML}
   */
  render () {
    return (
      <View style={ allForNowStyle.container }>
        <View style={ allForNowStyle.borisContainer }>
          <Boris mood="positive" size="small" note={ BorisNoteAllEnded }/>
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

class TopicFinished extends Component {

  state = {}

  constructor (props) {
    super(props)
    this.exploreTopic = this.exploreTopic.bind(this)
  }

  exploreTopic () {
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
  render () {
    return (
      <View style={ allForNowStyle.container }>
        <View>
          <Text style={topicFinished.text}>{`You're done!`}</Text>
        </View>
        <View style={topicFinished.star}>
          <Icon name="star" style={styles.crumbIconStar}/>
        </View>

        <View style={ allForNowStyle.borisContainer }>
          <Boris mood="positive" size="small" note={ BorisNoteTopicFinished }/>
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


class RandomAdvice extends Component {

  state = {
    reactions: {
      mood: 'positive',
      content: ''
    }
  }

  constructor (props) {
    super(props);

    this.gotIt = this.gotIt.bind(this);
  }

  gotIt () {
    this.props.undo && this.props.undo('hide');
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.viewer.reactions.edges.length;
  }

  /**
   *
   * @param reactions
   */
  getRandomReaction (reactions) {
    const sample = _.chain(reactions)
                    .map(n => n.node)
                    .shuffle()
                    .filter(n => n.content != this.state.reactions.content)
                    .sample()
                    .value();

    return sample;
  }

  render () {
    const { viewer } = this.props;
    const { reactions } = this.state;
    let mood = reactions.mood;
    let note = reactions.content;

    if ( !viewer.reactions.edges.length ) {
      mood = 'negative';
      note = 'error';
    } else {
      this.state.reactions = this.getRandomReaction(viewer.reactions.edges);
      mood = this.state.reactions.mood;
      note = this.state.reactions.content;
    }

    return (
      <View style={ commentStyle.container }>
        <View style={ commentStyle.borisContainer }>
          <Boris
            mood={mood}
            notAnimate={true}
            size="small"
            note={note}
            randomId={(Math.random(1000) * 100).toString(16)}/>
        </View>

        <Button
          label=""
          color="green"
          onPress={this.gotIt}
          style={ commentStyle.button }>
          <Text style={ commentStyle.buttonText }>Got it</Text>
        </Button>
      </View>
    )
  }
}


RandomAdvice = Relay.createContainer(RandomAdvice, {
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            reactions(first : 100, scope: "clicker") {
                edges {
                    node {
                        mood
                        content
                        weight
                    }
                }
            }
        }
    `
  }
});

export {
  CommentBad,
  CommentGood,
  AllForNow,
  AllEnded,
  TopicFinished,
  RandomAdvice
}
