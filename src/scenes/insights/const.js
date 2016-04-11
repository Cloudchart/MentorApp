import React, { Dimensions } from "react-native";
import * as device from "../../utils/device";

const dimensions = Dimensions.get('window');

export const SWIPE_THRESHOLD = 120;
export const SWIPE_THRESHOLD_MINI = 90;
export const CONTROLS_WIDTH = device.size(240);
export const ADD_CARD_REF = 'ADD_CARD_REF';
export const SHARE_CONTROLS_REF = 'SHARE_CONTROLS_REF';
export const SHARE_CARD_REF = 'SHARE_CARD_REF';
export const DEVIATION = device.size(8);

export const CONTROL_PIECE = CONTROLS_WIDTH * 0.22;

