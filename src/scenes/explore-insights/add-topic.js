import React, { Text, View } from 'react-native'
import { Boris, Button, TransparentButton } from '../../components'
import { commentStyle } from '../../components/confirmation-screens/style'

const BORIS_NOTE = 'I see your interest, Master. Would you like me to add it to your topics?'

export default function ExploreInsightsAddTopic({  onConfirmPress, onCancelPress }) {
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
        onPress={() => onConfirmPress()}
        style={commentStyle.button}
        >
        <Text style={commentStyle.buttonText}>
          Sure, add it
        </Text>
      </Button>
      <TransparentButton
        style={{ paddingVertical: 10 }}
        label="Not now, thanks"
        onPress={() => onCancelPress()}
        color="red"
        />
    </View>
  )
}
