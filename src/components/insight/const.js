import React, { Dimensions } from "react-native";
import * as device from "../../utils/device";

const dimensions = Dimensions.get('window');

export const SWIPE_THRESHOLD = 120;
export const SWIPE_THRESHOLD_MINI = 90;
export const CONTROLS_WIDTH = dimensions.width * 0.8;
export const ADD_CARD_REF = 'ADD_CARD_REF';
export const CARD_REF = 'CARD_REF';
export const SHARE_CONTROLS_REF = 'SHARE_CONTROLS_REF';
export const SHARE_CARD_REF = 'SHARE_CARD_REF';
export const DEVIATION = device.size(8);
export const CONTROL_PIECE = 240 * 0.22; //dimensions.width * 0.35;

