import React, { Text, View } from 'react-native'
import { Boris, Button, TransparentButton } from '../../components'
import { commentStyle } from '../../components/confirmation-screens/style'

const BORIS_NOTE =
  'You\'re out of free topic slots, Master. You cat replace one of ' +
  'yours or add this topic later after you finish one'

export default function ExploreInsightsReplaceTopic({ onConfirmPress }) {
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
        color="orange"
        onPress={() => onConfirmPress()}
        style={commentStyle.button}
        >
        <Text style={commentStyle.buttonTextBlack}>
          Replace one of my topics
        </Text>
      </Button>
    </View>
  )
}
