import React from 'react'
import { RootContainer } from 'react-relay'
import Loader from './components/loader'
import ViewerRoute from './routes/viewer'
import store from '../src/store'

/**
 * @param {Function} Component
 * @param {Object} [screenParams]
 * @param {Object} [options]
 * @param {Object} [options.route]
 * @param {Function} [options.renderFailure]
 * @param {Boolean} [options.forceFetch]
 */
export default function renderRootContainer(Component, screenParams, options) {
  const { route, forceFetch, renderFailure, renderFetched } = options || {}
  const finalRoute = route ? route : new ViewerRoute()
  const finalParams = screenParams ? screenParams : {}
  const finalRenderFailure = renderFailure ? renderFailure : null
  const finalForceFetch = forceFetch !== undefined ? forceFetch : false
  const finalRenderFetched =
    (renderFetched !== undefined) ?
      renderFetched :
        data => (
      <Component {...finalParams} {...data} />
    )
  return (
    <RootContainer
      store={store}
      Component={Component}
      route={finalRoute}
      forceFetch={finalForceFetch}
      renderLoading={() => (
        <Loader />
      )}
      renderFailure={finalRenderFailure}
      renderFetched={finalRenderFetched}
      />
  )
}
