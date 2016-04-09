import _ from "lodash";
import {
    SET_ADVICES
} from "../../actions/actions";


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
    default:
      return { ...state }
  }
}

export default insights;

