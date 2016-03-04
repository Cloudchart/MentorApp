import { Dimensions } from "react-native";

function isTablet () {
  var dimensions = Dimensions.get('window'),
      w = dimensions.width,
      h = dimensions.height,
      checkBy = w;

  if ( w > h ) {
    checkBy = h;
  }
  return checkBy > 750;
}

function isIphone5 () {
  var dimensions = Dimensions.get('window'),
      w = dimensions.width,
      h = dimensions.height,
      checkBy = w;

  if ( w > h ) {
    checkBy = h;
  }
  return checkBy < 375;
}

function size (value) {
  value = Number(value);
  if ( isTablet() ) {
    return value * 1.1
  }

  return value;
}

function fontSize (value) {
  value = Number(value);
  if ( isTablet() ) {
    return value * 1.15
  }

  return value;
}


export {
    isTablet,
    isIphone5,
    size,
    fontSize
};
