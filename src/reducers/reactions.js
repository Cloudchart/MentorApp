import {
  ACTION_SHOW_RANDOM_ADVICE,
} from "../actions/actions";


/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const reactions = (state = {
  show: false
}, action) => {
  switch ( action.type ) {
    case ACTION_SHOW_RANDOM_ADVICE:
      return {
        ...state,
        show: action.show
      }
    default:
      return { ...state }
  }
}

export default reactions;


