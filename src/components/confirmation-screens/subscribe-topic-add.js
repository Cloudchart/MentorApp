import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native'
import { Boris, Button, TransparentButton } from '../../components'
import { commentStyle } from './style'
import { EventManager } from '../../event-manager'
import { subscribeOnTopic } from '../../actions/topic'
import { TOPICS_FORCE_FETCH } from '../../actions/application'
import { ExploreTopicSubscribeFull, ExploreTopicSubscribe } from './explore-topic-parts'

const BORIS_NOTE = 'I see your interest, Master. Would you like me to add it to your topics?'

export default function SubscribeTopicAdd(props) {
  const handleSubscribeTopicPress = () => {
    const { topic, user, onSubscribePress } = props
    subscribeOnTopic({ topic, user })
      .then(() => {
        EventManager.emit(TOPICS_FORCE_FETCH)
      })
    onSubscribePress && onSubscribePress()
  }
  const { subscribedTopics } = props
  if (subscribedTopics.availableSlotsCount === 0) {
    return (
      <ExploreTopicSubscribe {...props} />
    )
  }
  return (
    <View style={commentStyle.container}>
      <View style={commentStyle.borisContainer}>
        <Boris
          mood="positive"
          size="small"
          note={BORIS_NOTE}
          />
      </View>
      <Button
        label=""
        color="green"
        onPress={() => handleSubscribeTopicPress()}
        style={commentStyle.button}
        >
        <Text style={commentStyle.buttonText}>
          Sure, add it
        </Text>
      </Button>
      <TransparentButton
        style={{paddingVertical: 10}}
        label="Not now, thanks"
        onPress={() => props.onNotNowPress && props.onNotNowPress()}
        color="red"
        />
    </View>
  )
}
