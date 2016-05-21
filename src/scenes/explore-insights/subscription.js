import React, { Text, View } from 'react-native'
import { Boris, Button, TransparentButton } from '../../components'
import { commentStyle } from '../../components/confirmation-screens/style'

const BORIS_NOTE =
  'You\'re out of free topic slots, Master. Subscribe, and we\'ll have an exciting time learning'

export default function ExploreInsightsSubscription({ onConfirmPress, onCancelPress }) {
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
          Subscribe now
        </Text>
      </Button>
      <TransparentButton
        style={{ paddingVertical: 10 }}
        label="Replace one of my topics"
        onPress={() => onCancelPress()}
        color="orange"
        />
    </View>
  )
}
