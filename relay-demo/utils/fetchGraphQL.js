let _graphQLURI = null
let _deviceID   = null

function fetchGraphQL(graphQLParams) {
  if (!_graphQLURI)
    throw new Error('fetchGraphQL: graphqlURI is not set.')

  if (!_deviceID)
    throw new Error('fetchGraphQL: deviceID is not set.')

  return fetch(_graphQLURI, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Device-Id': _deviceID,
    },
    body: JSON.stringify(graphQLParams)
  })
}

export function setGraphQLURI(graphQLURI) {
  _graphQLURI = graphQLURI
}

export function setDeviceID(deviceID) {
  _deviceID = deviceID
}

export default fetchGraphQL
