import {
    USER_SUBSCRIBE,
    USER_SUBSCRIBE_NEWSLETTER,
    USER_TURN_NOTIFICATIONS,
    USER_FACEBOOK_LOGIN
} from "../../actions/actions";


/**
 *
 * @param state
 * @param action
 * @returns {*}
 */
const user = (state = {
  businessSubscription: false,
  subscribeNewsletter: false,
  NOTIFICATIONS: 'off',
  loginPermissions: [ "email", "user_friends" ],
  facebookLogin: false
}, action) => {
  switch ( action.type ) {
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

