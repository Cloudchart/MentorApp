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
  const newColl = [ ...collections.edges ];
  const coll = _.map(newColl, 'node');
  const insights = _.map(coll, 'insights'); // get insights into topics
  let count = 0;
  insights.forEach((item)=> { count += item.count })
  return count;
}

/**
 *
 * @param collections
 * @param id
 * @returns {T}
 */
function findCollection (collections, id) {
  return collections.find((item) => item.node.__dataID__ == id)
}


function movementInsightsInCollection (state, insight, filter) {

  return {
    USEFUL: [],
    USELESS: []
  }
}

function markUseful (insights) {
  let insightsLocal = [ ...insights ];

  return insightsLocal;
}

function markUseless (insights) {
  let insightsLocal = [ ...insights ];

  return insightsLocal;
}


const collections = (state = {
  list: [],
  currentCollection: {
    insights: null
  },
  USEFUL: [],
  USELESS: [],
  count_insight: 0
}, action) => {
  switch ( action.type ) {
    case SET_COLLECTIONS:
      return {
        ...state,
        list: action.collections.edges
      }
    case SET_INSIGHTS_USEFUL:
      return {
        ...state,
        USEFUL: [ ...action.data.insights.edges ]
      }
    case SET_INSIGHTS_USELESS:
      return {
        ...state,
        USELESS: [ ...action.data.insights.edges ]
      }

    case MOVEMENT_INSIGHTS_IN_COLLECTION:
      return {
        ...state,
        ...movementInsightsInCollection(state, action.insight, action.filter)
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

