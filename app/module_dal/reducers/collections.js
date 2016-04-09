import _ from 'lodash';

import {
  SET_COLLECTIONS,
  SET_CURRENT_COLLECTION,
  COUNT_INSIGHTS_COLLECTIONS,
  COUNT_INSIGHTS_PLUS
} from "../../actions/actions";


function _getInsightsFromUserCollections (collections) {
  const newColl = [ ...collections.edges ];
  const coll = _.map(newColl, 'node');
  const insights = _.map(coll, 'insights'); // get insights into topics
  let count = 0;
  insights.forEach((item)=>{ count += item.count })
  return count;
}

/**
 *
 * @param collections
 * @param id
 * @returns {T}
 */
function findCollection(collections, id){
  return collections.find((item) => item.node.__dataID__ == id)
}


const collections = (state = {
  list: [],
  currentCollection : {
    insights : null
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

