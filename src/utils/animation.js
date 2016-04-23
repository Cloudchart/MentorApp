import React, { LayoutAnimation } from "react-native";

export const Presets = {
  Linear: LayoutAnimation.create(
    100, LayoutAnimation.Types.linear, LayoutAnimation.Properties.opacity
  )
}

export function ScrollHandler (params, evt) {
  const { isLoadingTail, onEndReachedThreshold } = params;
  evt = evt.nativeEvent;
  const scrollTarget = evt.contentSize.height - (evt.layoutMeasurement.height);
  const curScroll = evt.contentOffset.y;

  if ( scrollTarget > 0 && (curScroll - onEndReachedThreshold) > scrollTarget && !isLoadingTail ) {
    params.callback();
  }
}

