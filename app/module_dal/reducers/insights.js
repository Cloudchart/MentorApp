import _ from "lodash";
import {
    SET_ADVICES,
    USER_MARK_ADVICE,
    USER_MARK_ADVICE_NEGATIVE,
    USER_MARK_ADVICE_BAD
} from "../../actions/actions";


/**
 *
 * @param advices
 * @param id
 * @returns {Array.<T>}
 */
function markAdviceNegative (advices, id) {
  const newAdvices = [ ...advices ];
  return newAdvices.filter((advice) => {
    if ( advice.id == id ) {
      advice.negative = true;
    }
    return advice;
  });
}


/**
 *
 * @param advices
 * @param id
 * @returns {Array.<T>}
 */
function markAdvicePositive (advices, id) {
  const newAdvices = [ ...advices ];
  return newAdvices.filter((advice) => {
    if ( advice.id == id ) {
      advice.positive = true;
    }
    return advice;
  });
}


/**
 *
 * @param advices
 * @param id
 * @returns {Array.<T>}
 */
function markAdviceBad (advices, id) {
  const newAdvices = [ ...advices ];
  return newAdvices.filter((advice) => {
    if ( advice.id == id ) {
      advice.bad = true;
    }
    return advice;
  });
}

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const insights = (state = {
  list: []
}, action) => {
  switch ( action.type ) {
    case SET_ADVICES:
      return {
        ...state,
        list: _.shuffle(action.insights)
      }
    case USER_MARK_ADVICE:
      return {
        ...state,
        list: markAdvicePositive(state.list, action.id)
      }
    case USER_MARK_ADVICE_NEGATIVE:
      return {
        ...state,
        list: markAdviceNegative(state.list, action.id)
      }
    case USER_MARK_ADVICE_BAD:
      return {
        ...state,
        list: markAdviceBad(state.list, action.id)
      }
    default:
      return { ...state }
  }
}

export default insights;

