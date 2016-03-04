import React, { LayoutAnimation } from "react-native";

export const Presets = {
  Linear: LayoutAnimation.create(
      100, LayoutAnimation.Types.linear, LayoutAnimation.Properties.opacity
  )
}

