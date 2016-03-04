import {
    TOPIC_ADD,
    TOPIC_DELETE,
    USER_SUBSCRIBE,
    USER_SUBSCRIBE_NEWSLETTER,
    USER_TURN_NOTIFICATIONS,
    USER_FACEBOOK_LOGIN
} from "../actions/actions";

/**
 *
 * @param state
 * @param id
 * @returns {Array}
 */
function selectOrUnselectTopic (state, id) {
  const newTopics = [ ...state.topics ];
  const selectedCount = state.selectedTopics.length;
  newTopics.forEach((topic)=> {
    if ( topic.id == id ) {
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
const user = (state = {
  topics: [
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
  ],
  selectedTopics: [],
  excludeSelectedTopics: [],
  businessSubscription: false,
  subscribeNewsletter: false,
  NOTIFICATIONS: 'off',
  loginPermissions: [ "email", "user_friends" ],
  facebookLogin: false
}, action) => {
  switch ( action.type ) {
    case TOPIC_ADD:
      const topicsSelect = selectOrUnselectTopic(state, action.id)
      return {
        ...state,
        topics: topicsSelect,
        selectedTopics: findSelectedTopics(topicsSelect),
        excludeSelectedTopics: excludeSelectedTopics(topicsSelect)
      }
    case TOPIC_DELETE:
      const topicsUnselect = selectOrUnselectTopic(state, action.id)
      return {
        ...state,
        topics: topicsUnselect,
        selectedTopics: findSelectedTopics(topicsUnselect),
        excludeSelectedTopics: excludeSelectedTopics(topicsUnselect)
      }
    case USER_SUBSCRIBE:
      return {
        ...state,
        businessSubscription: true
      }
    case USER_SUBSCRIBE_NEWSLETTER:
      return {
        ...state,
        subscribeNewsletter: action.email
      }
    case USER_TURN_NOTIFICATIONS:
      return {
        ...state,
        NOTIFICATIONS: action.NOTIFICATIONS
      }
    case USER_FACEBOOK_LOGIN:
      return {
        ...state,
        facebookLogin: true
      }
    default:
      return { ...state }
  }
}

export default user;

