import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { Boris, Button, TransparentButton } from "../../components";
import Icon from "react-native-vector-icons/FontAwesome";
import { commentStyle } from "./style";
import { allForNowStyle } from "./style";
import { topicFinished } from "./style";
import styles from "../../styles/base";

const BorisNote = "That's all for now! Want more advice more often? Human up and subscribe!";
const BorisNoteAllEnded = "Achievement unlocked! You have mastered all the topics, thus achieving supreme knowledge. I bow to you, Master";
const BorisNoteTopicFinished = "Congratulations, apprentice! You're not as hopeless as I thought. But no time to celebrate, let the learning go on!";


class CommentBad extends Component {

  constructor (props) {
    super(props)
    this.state = {
      user: null
    }

    this._undo = this.props.undo.bind(this, 'undo');
    this._delete = this.props.undo.bind(this, 'delete');
  }

  render () {
    return (
      <View style={ commentStyle.container }>
        <View style={ commentStyle.borisContainer }>
          <Boris
            mood="negative"
            size="small"
            note={"Really? Really?! You swipe left on Startup L. Jackson? My boy, you won't get too far!"}/>
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
          label="I know what a'm doing"
          onPress={this._delete}
          color="red"
        />

      </View>
    )
  }
}

class CommentGood extends Component {

  constructor (props) {
    super(props)

    this.state = {
      user: null
    }

    this._continue = this.props.continue.bind(this);
  }

  render () {
    return (
      <View style={ commentStyle.container }>
        <View style={ commentStyle.borisContainer }>
          <Boris
            mood="positive"
            size="small"
            note={"668 more users also approve this advice. You're on the right track, young padawan!"}/>
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

  constructor (props) {
    super(props)

    this.state = {};
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

  constructor (props) {
    super(props)

    this.state = {};
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
          color="orange"
          style={ allForNowStyle.button }>
          <Text style={ allForNowStyle.buttonText }>Okay</Text>
        </Button>

      </View>
    )
  }
}

class TopicFinished extends Component {

  constructor (props) {
    super(props)

    this.state = {};
    this.exploreTopic = this.exploreTopic.bind(this)
  }

  exploreTopic () {
    const { navigator } = this.props;
    navigator.push({ scene: 'explore_topic', title: 'Explore' })
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
          color="orange"
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


export {
  CommentBad,
  CommentGood,
  AllForNow,
  AllEnded,
  TopicFinished
}

