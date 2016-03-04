import _ from 'lodash'

import {
    CREATE_COLLECTIONS,
    ADD_TO_COLLECTIONS,
    DELETE_COLLECTIONS,
    WATCH_COLLECTION,
    DELETE_FROM_COLLECTIONS,
    UPDATE_ADVICE_INTO_COLLECTION
} from "../actions/actions";
import { EventManager } from "../../event_manager";


/**
 *
 * @param collections
 * @param id
 * @returns {*|Array|Array.<T>}
 */
function filterCollection (collections, id) {
  return collections.filter((item) => item.id != id)
}

/**
 *
 * @param collections
 * @param id
 * @returns {*|T}
 */
function findCollectionById (collections, id) {
  return collections.find((item) => item.id == id)
}

/**
 *
 * @param collections
 * @param id
 * @returns {*|T}
 */
function isAddedAdvice (collections, id) {
  return collections.find((item) => {
    return item.advices.find((adv) => adv.id == id)
  })
}

/**
 *
 * create new collection
 * @param collections
 * @param item
 * @returns {Array}
 */
function addItem (collections, item) {
  const newColl = [ ...collections ]
  item.advices = [];
  newColl.push(item);
  return [ ...newColl ];
}

/**
 * add new advice to collection
 * @param collections
 * @param data
 * @returns {Array}
 */
function addToCollection (collections, data) {
  let newColl = [ ...collections ];
  const isAdded = isAddedAdvice(newColl, data.advice.id)

  // if the advice is already to some of the collection
  if ( isAdded && (isAdded.id != data.id) ) {
    newColl.forEach((item) => {
      if ( item.id == isAdded.id ) {
        item.advices = deleteFromAdvices(isAdded, data)
      }
    })
    //if the advice in the current collection
  } else if ( isAdded && (isAdded.id == data.id) ) {
    return newColl
  }

  newColl.find((item)=> {
    if ( item.id == data.id ) {
      item.advices.push(data.advice)
      return true;
    }
  });

  return newColl
}


/**
 *
 * @param collections
 * @param data
 * @returns {{}}
 */
function deleteFromAdvices (collections, data) {
  const newColl = { ...collections }
  return newColl.advices.filter((advice)=> advice.id != data.advice.id)
}

function deleteFromCollection (collections, data) {

}

/**
 *
 * @param collections
 * @param data
 * @returns {null[]}
 */
function updateAdvice(collections, data){
  const newColl = [ ...collections ];
  const copyColl = {...data.collection}
  const advice = data.currentAdvice;
  const adviceFilter = markAdviceBad(copyColl.advices, advice.id);
  const adviceFilterBad = adviceFilter.filter((item) => item.bad)
  let saveCollection;

  newColl.forEach((item) => {
    if ( item.id == copyColl.id ) {
      saveCollection = item;
      item.advices = adviceFilter;
      item.advicesBad = adviceFilterBad;
    }
  })
  EventManager.emit(WATCH_COLLECTION, { collection : saveCollection })

  return newColl;
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
const collections = (state = {
  list: [
    {
      "id": 1,
      "name": "Company Culture",
      "topic_name": "Growth",
      "advices": [
        {
          "id": 38,
          "name": "Company Culture",
          "topic_name": "Growth",
          "text": "Invoked once, both on the client and server, immediately"
        }
      ]
    }, {
      "id": 2,
      "name": "Design topics",
      "topic_name": "Design",
      "advices": [
        {
          "id": 39,
          "name": "Company Culture",
          "topic_name": "Growth",
          "text": "Invoked once, both on the client and server, immediately"
        }
      ]
    }, {
      "id": 3,
      "name": "Unsorted",
      "topic_name": "Development",
      "advices": [
        {
          "id": 42,
          "name": "Company Culture",
          "topic_name": "Growth",
          "text": "Invoked once, both on the client and server, immediately"
        }
      ]
    },
    {
      "id": 4,
      "name": "What ?",
      "topic_name": "Launch",
      "advices": [
        {
          "id": 1,
          "name": "Company Culture 1",
          "topic_name": "Growth",
          "text": "Invoked 1 once, both on the client and server, immediately"
        },
        {
          "id": 2,
          "name": "Company Culture 2",
          "topic_name": "Growth",
          "text": "Invoked 2 once, both on the client and server, immediately"
        }, {
          "id": 3,
          "name": "Company Culture 3",
          "topic_name": "Growth",
          "text": "Invoked 3 once, both on the client and server, immediately"
        },
        {
          "id": 4,
          "name": "Company Culture 4",
          "topic_name": "Growth",
          "text": "Invoked 4 once, both on the client and server, immediately"
        },
        {
          "id": 5,
          "name": "Company Culture 5",
          "topic_name": "Growth",
          "text": "Invoked once, both on the client and server, immediately"
        },
        {
          "id": 6,
          "name": "Company Culture 6",
          "topic_name": "Growth",
          "text": "Invoked once, both on the client and server, immediately"
        },
        {
          "id": 7,
          "name": "Company Culture 7",
          "topic_name": "Growth",
          "text": "Invoked once, both on the client and server, immediately"
        }
      ]
    }
  ],
  watch_collection : null
}, action) => {
  switch ( action.type ) {
    case CREATE_COLLECTIONS:
      return {
        ...state,
        list: addItem(state.list, action.data)
      }
    case DELETE_COLLECTIONS:
      return {
        ...state,
        list: filterCollection([ ...state.list ], action.id)
      }
    case ADD_TO_COLLECTIONS:
      return {
        ...state,
        list: addToCollection(state.list, action.data)
      }
    case DELETE_FROM_COLLECTIONS:
      return {
        ...state,
        list: deleteFromCollection(state.list, action.data)
      }
    case UPDATE_ADVICE_INTO_COLLECTION:
      return {
        ...state,
        list: updateAdvice(state.list, action.data)
      }
    default:
      return { ...state }
  }
}

export default collections;

