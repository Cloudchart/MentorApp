import {
  SAVE_UNIQUE_ID_AND_DATE,
  UPDATE_APP_START_TIME,
  UPDATE_APP_BACKGROUND_TIME,
} from '../actions/application'

const initialState = {
  unique_id: '',
  date: {},
  appStartTime: '',
  background: ''
}

const application = (state = initialState, action = {}) => {
  switch (action.type) {
    case SAVE_UNIQUE_ID_AND_DATE:
      return {
        ...state,
        unique_id: action.id,
        appStartTime: action.appStart,
      }
    case UPDATE_APP_START_TIME:
      return {
        ...state,
        appStartTime: action.appStart,
      }
    case UPDATE_APP_BACKGROUND_TIME:
      return {
        ...state,
        background: action.background,
      }
    default:
      return { ...state }
  }
}

export default application;

