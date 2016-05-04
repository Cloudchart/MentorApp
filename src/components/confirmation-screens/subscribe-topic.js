import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { Boris, Button, TransparentButton } from "../../components";
import { commentStyle } from "./style";
import { EventManager } from '../../event-manager';
import { subscribeOnTopic } from "../../actions/topic";
import { TOPICS_FORCE_FETCH } from "../../actions/application";
import { ExploreTopicSubscribeFull, ExploreTopicSubscribe } from './explore-topic-parts';

class SubscribeTopicAdd extends Component {

  constructor (props) {
    super(props)

    this.subscribeTopic = this.subscribeTopic.bind(this);
    this._notNow = this.props.undo.bind(this, 'not_now');
  }

  subscribeTopic () {
    const { topic, user } = this.props;
    subscribeOnTopic({ topic, user })
      .then(()=> {
        EventManager.emit(TOPICS_FORCE_FETCH)
      })

    this.props.undo && this.props.undo('add');
  }

  render () {
    const { subscribedTopics } = this.props;
    if ( !subscribedTopics.availableSlotsCount ) {
      return <ExploreTopicSubscribe {...this.props} />
    }

    //return <ExploreTopicSubscribeFull {...this.props} />
    return (
      <View style={ commentStyle.container }>
        <View style={ commentStyle.borisContainer }>
          <Boris
            mood="positive"
            size="small"
            note={"I see your interest, Master. Would you like me to add it to your topics?"}/>
        </View>

        <Button
          label=""
          color="green"
          onPress={this.subscribeTopic}
          style={ commentStyle.button }>
          <Text style={ commentStyle.buttonText }>Sure, add it</Text>
        </Button>

        <TransparentButton
          style={{paddingVertical: 10}}
          label="Not now, thanks"
          onPress={this._notNow}
          color="red"
        />

      </View>
    )
  }
}

export default SubscribeTopicAdd;
