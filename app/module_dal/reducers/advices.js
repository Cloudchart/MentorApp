import _ from "lodash";
import {
    USER_MARK_ADVICE,
    USER_MARK_ADVICE_NEGATIVE,
    USER_MARK_ADVICE_BAD
} from "../actions/actions";


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



let listAdvices = _.shuffle([
  {
    "id": 1,
    "name": "Company Culture",
    "topic_name": "Growth",
    "text": "Invoked once, both on the client and server, immediately"
  }, {
    "id": 2,
    "name": "Design topics and UX/UI and something more",
    "topic_name": "Design",
    "text": "The componentDidMount() method of child components",
    "confirmation": true,
    "url": "http://google.com"
  }, {
    "id": 3,
    "name": "Unsorted",
    "topic_name": "Development",
    "text": "If you want to integrate with other JavaScript frameworks, set timers using",
    "url": "http://yandex.com"
  },
  {
    "id": 4,
    "name": "What ?",
    "topic_name": "Launch",
    "text": "Perform any necessary cleanup in this method, such as invalidating",
    "confirmation": true,
    "url": "https://www.flickr.com/"
  }
])

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const advices = (state = {
  list: listAdvices
}, action) => {
  switch ( action.type ) {
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

export default advices;

