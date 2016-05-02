import { applyMiddleware, createStore, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import reducers from './reducers'

const middleware = applyMiddleware(
  thunkMiddleware,
  promiseMiddleware
)

export default createStore(
  reducers,
  compose(
    middleware
  )
)
