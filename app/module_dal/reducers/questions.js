import _ from "lodash";
import { USER_MARK_ADVICE, USER_MARK_ADVICE_NEGATIVE } from "../../actions/actions";


let list = _.shuffle([
  { id: '1', value: 'I work at a startup' },
  { id: '2', value: 'I want to work at a startup' },
  { id: '3', value: 'I\'m just curious' }
])

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const questions = (state = {
  list: list
}, action) => {
  switch ( action.type ) {
    case USER_MARK_ADVICE_NEGATIVE:
    default:
      return { ...state }
  }
}

export default questions;

