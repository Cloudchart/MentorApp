import _ from "lodash";
import {
    USER_MARK_ADVICE,
    USER_MARK_ADVICE_NEGATIVE
} from "../actions/actions";

let listTopics = _.shuffle([
  {
    "id": 1,
    "title": "Design",
    "text": "We could use this in the Rebound example to update the scale"
  }, {
    "id": 2,
    "title": "Development",
    "text": "We could use this in the Rebound example to update the scale"
  }, {
    "id": 3,
    "title": "Growth",
    "text": "We could use this in the Rebound example to update the scale"
  },
  {
    "id": 4,
    "title": "Launch",
    "text": "We could use this in the Rebound example to update the scale"
  },
  {
    "id": 5,
    "title": "Investment",
    "text": "We could use this in the Rebound example to update the scale"
  },
  {
    "id": 6,
    "title": "Product",
    "text": "We could use this in the Rebound example to update the scale"
  },
  {
    "id": 7,
    "title": "Team",
    "text": "We could use this in the Rebound example to update the scale"
  }
])

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const topics = (state = {
  list: listTopics
}, action) => {
  switch ( action.type ) {
    case USER_MARK_ADVICE:
    case USER_MARK_ADVICE_NEGATIVE:
    default:
      return { ...state }
  }
}

export default topics;

