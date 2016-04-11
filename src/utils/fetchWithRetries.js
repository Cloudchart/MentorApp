const DEFAULT_TIMEOUT = 15 * 1000
const DEFAULT_RETRIES = [ 1000, 3000 ]

function warning (message) {
  console.warn(mesage)
}

function fetchWithRetries (uri, initWithRetries) {

  let { fetchTimeout, retryDelays, ...init } = initWithRetries || {}
  let requestsAttempted = 0
  let requestStartTime = 0

  if ( fetchTimeout == null ) fetchTimeout = DEFAULT_TIMEOUT
  if ( retryDelays == null ) retryDelays = DEFAULT_RETRIES

  return new Promise((resolve, reject) => {

    function sendTimedRequest () {
      requestsAttempted++
      requestStartTime = Date.now()

      let isRequestAlive = true
      let request = fetch(uri, init)

      let requestTimeout = setTimeout(() => {
        isRequestAlive = false
        if ( shouldRetry(requestsAttempted) ) {
          warning('fetchWithRetries: HTTP timeout, retrying.')
          retryRequest()
        } else {
          reject(new Error(`fetchWithRetries: Failed to get response from server, tried ${requestsAttempted} times`))
        }
      }, fetchTimeout)

      request.then(response => {
        clearTimeout(requestTimeout)
        if ( isRequestAlive ) {
          if ( response.status >= 200 && response.status < 300 ) {
            resolve(response)
          } else if ( shouldRetry(requestsAttempted) ) {
            warning('fetchWithRetries: HTTP error, retrying.')
            retryRequest()
          } else {
            let error = new Error(`fetchWithRetries: Still no successfull response after ${requestsAttempted} retries, giving up.`)
            error.response = response
            reject(error)
          }
        }
      }).catch(error => {
        clearTimeout(requestTimeout)
        if ( shouldRetry(requestsAttempted) ) {
          retryRequest()
        } else {
          reject(error)
        }
      })

    }

    function retryRequest () {
      let retryDelay = retryDelays[ requestsAttempted - 1 ]
      let retryStartTime = requestStartTime + retryDelay

      setTimeout(sendTimedRequest, retryStartTime - Date.now())
    }

    function shouldRetry (attempt) {
      return attempt <= retryDelays.length
    }

    sendTimedRequest()
  })
}

export default fetchWithRetries
