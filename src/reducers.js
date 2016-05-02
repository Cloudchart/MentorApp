import { combineReducers } from 'redux'
import application from './reducers/application'
import user from './reducers/user'
import reactions from './reducers/reactions'
import collections from './reducers/collections'

export default combineReducers({
  application,
  collections,
  user,
  reactions
})
