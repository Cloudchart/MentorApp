import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Linking,
  PanResponder,
  Animated
} from 'react-native'
import styles from './style'
import * as device from '../../utils/device'

function calculateContentFontSize() {
  return {
    fontSize: device.fontSize(20),
    lineHeight: device.fontSize(20 * 1.2),
  }
}

export default function InsightRate({
  insight, itWorksState, didNotWorkState,
  onItWorksPress, onDidNotWorkPress, style,
}) {
  const finalContent = insight.content && insight.content.trim()
  const styleInner = itWorksState ? styles.itemInnerLike : styles.itemInner
  const styleText = itWorksState ? styles.itemTextLike : styles.itemText
  const disLikeOpacity = didNotWorkState ? 1 : 0.7
  const likeOpacity = itWorksState ? 1 : 0.7
  return (
    <View
      activeOpacity={0.75}
      style={[styles.item, style]}
      >
      <View style={styleInner}>
        <Text style={[styleText, calculateContentFontSize(finalContent)]}>
          {finalContent}
        </Text>
      </View>
      <View style={[styles.itemMoreInner, { paddingVertical : device.size(18) }]}>
        <View style={styles.itemMoreControl}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.itemMoreControlLeft}
            onPress={() => onDidNotWorkPress && onDidNotWorkPress(insight)}
            >
            <Text style={[styles.itemMoreControlLeftText, { opacity: disLikeOpacity }]}>
              Didn’t work
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.itemMoreControlRight}
            onPress={() => onItWorksPress && onItWorksPress(insight)}
            >
            <Text style={[styles.itemMoreControlRightText, { opacity: likeOpacity }]}>
              It works!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
