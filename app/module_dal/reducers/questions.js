import _ from "lodash";


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
    default:
      return { ...state }
  }
}

export default questions;

