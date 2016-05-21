import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { Boris, Button, TransparentButton } from "../../components";
import { commentStyle } from "./style";

class ExploreTopicSubscribe extends Component {

  constructor (props) {
    super(props)

    this.replaceTopic = this.replaceTopic.bind(this);
    this.subscribeNow = this.subscribeNow.bind(this);
    this._notNow = this.props.undo.bind(this, 'not_now');
  }

  subscribeNow () {
    const { navigator } = this.props;
    navigator.push({
      scene: 'subscription',
      title: 'Subscription'
    })
  }

  replaceTopic () {
    const { navigator, topic, popToTop } = this.props;
    navigator.replace({
      scene: 'replace-topic',
      title: 'Replace one of yours topics:',
      topic : topic,
      popToTop : popToTop
    })
  }

  render () {
    return (
      <View style={ commentStyle.container }>
        <View style={ commentStyle.borisContainer }>
          <Boris
            mood="positive"
            size="small"
            note="You're out of free topic slots, Master. Subscribe, and we'll have an exciting time learning"/>
        </View>

        <Button
          label=""
          color="orange"
          onPress={this.subscribeNow}
          style={ commentStyle.button }>
          <Text style={commentStyle.buttonTextBlack}>Subscribe now</Text>
        </Button>

        <TransparentButton
          style={{paddingVertical: 10}}
          label="Replace one of my topics"
          onPress={this.replaceTopic}
          color="orange"
        />

      </View>
    )
  }
}

class ExploreTopicSubscribeFull extends Component {

  constructor (props) {
    super(props)
    this.replaceTopic = this.replaceTopic.bind(this);
  }

  replaceTopic () {
    const { navigator, topic, popToTop } = this.props;

    navigator.replace({
      scene: 'replace-topic',
      title: 'Replace one of yours topics:',
      topic : topic,
      popToTop : popToTop
    })
  }

  render () {
    return (
      <View style={ commentStyle.container }>
        <View style={ commentStyle.borisContainer }>
          <Boris
            mood="positive"
            size="small"
            note="You're out of free topic slots, Master. You cat replace one of yours or add this topic later after you finish one"/>
        </View>

        <Button
          label=""
          color="orange"
          onPress={this.replaceTopic}
          style={ commentStyle.button }>
          <Text style={ commentStyle.buttonTextBlack }>Replace one of my topics</Text>
        </Button>
      </View>
    )
  }
}

export {
  ExploreTopicSubscribe,
  ExploreTopicSubscribeFull
}


