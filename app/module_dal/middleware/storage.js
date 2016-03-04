import { AsyncStorage } from "react-native";


const STORAGE_KEY = '@ALL:STATE';

export const writeState = ({ getState }) => (next) => (action) => {
  const result = next(action);
  try {
    const state = JSON.stringify(getState());
    AsyncStorage.setItem(STORAGE_KEY, state);
  } catch ( e ) {
    console.warn('AsyncStorage write error')
  }
  return result;
};

export const readState = () => {
  let state;
  try {
    //state = JSON.parse(window.localStorage.getItem(key));
  } catch ( err ) {
    // saved data is not valid
  }
  return state || {};
};

