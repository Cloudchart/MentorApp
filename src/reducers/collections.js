import _ from 'lodash';

import {
  SET_COLLECTIONS,
  SET_CURRENT_COLLECTION,
  COUNT_INSIGHTS_COLLECTIONS,
  MOVEMENT_INSIGHTS_IN_COLLECTION,
  COUNT_INSIGHTS_PLUS,
  SET_INSIGHTS_USELESS,
  SET_INSIGHTS_USEFUL
} from "../actions/actions";


function _getInsightsFromUserCollections (collections) {
  let countInsights = 0;
  _.chain([ ...collections.edges ])
   .map(n => n.node)
   .map(n => n.insights)
   .forEach(n => countInsights += n.count)
   .value();
  return countInsights;
}


const collections = (state = {
  list: [],
  currentCollection: {
    insights: null
  },
  count_insight: 0
}, action) => {
  switch ( action.type ) {
    case SET_COLLECTIONS:
      return {
        ...state,
        list: action.collections.edges
      }
    case SET_CURRENT_COLLECTION:
      return {
        ...state,
        currentCollection: action.collection
      }
    case COUNT_INSIGHTS_COLLECTIONS:
      return {
        ...state,
        count_insight: _getInsightsFromUserCollections(action.collections)
      }
    case COUNT_INSIGHTS_PLUS:
      return {
        ...state,
        count_insight: state.count_insight + 1
      }
    default:
      return { ...state }
  }
}

export default collections;

