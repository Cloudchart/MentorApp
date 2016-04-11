import _ from "lodash";
import {
  TOPICS_SAVE,
  SET_ROOT_TOPIC,
  TOPIC_ADD,
  TOPIC_DELETE
} from "../actions/actions";

/**
 *
 * @param state
 * @param id
 * @returns {Array}
 */
function selectOrUnselectTopic (state, id) {
  const newTopics = [ ...state.list ];
  const selectedCount = state.selectedTopics.length;
  newTopics.forEach((topic)=> {
    if ( topic.node.id == id ) {
      topic.selected = topic.selected ? false :
        selectedCount < 3 ? true : false
    }
  })

  return newTopics
}

/**
 *
 * @param topics
 * @returns {Array}
 */
function findSelectedTopics (topics) {
  const newTopics = [ ...topics ];
  return newTopics.filter((topic) => topic.selected);
}

/**
 *
 * @param topics
 * @returns {Array}
 */
function excludeSelectedTopics (topics) {
  const newTopics = [ ...topics ];
  return newTopics.filter((topic) => !topic.selected);
}

/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const topics = (state = {
  list: [],
  rootTopic : null,
  selectedTopics: [],
  excludeSelectedTopics: []
}, action) => {
  switch ( action.type ) {
    case TOPICS_SAVE:
      return {
        ...state,
        list: _.shuffle(action.topics)
      }
    case SET_ROOT_TOPIC:
      return {
        ...state,
        rootTopic: action.topic
      }
    case TOPIC_ADD:
      const topicsSelect = selectOrUnselectTopic(state, action.id)
      return {
        ...state,
        list: topicsSelect,
        selectedTopics: findSelectedTopics(topicsSelect),
        excludeSelectedTopics: excludeSelectedTopics(topicsSelect)
      }
    case TOPIC_DELETE:
      const topicsUnselect = selectOrUnselectTopic(state, action.id)
      return {
        ...state,
        list: topicsUnselect,
        selectedTopics: findSelectedTopics(topicsUnselect),
        excludeSelectedTopics: excludeSelectedTopics(topicsUnselect)
      }
    default:
      return { ...state }
  }
}

export default topics;

