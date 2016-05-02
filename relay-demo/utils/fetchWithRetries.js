const DEFAULT_TIMEOUT = 15000
const DEFAULT_RETRIES = [1000, 3000]

function fetchWithRetries(uri, initWithRetries) {

  const { fetchTimeout, retryDelays, ...init } = initWithRetries
  const _fetchTimeout = fetchTimeout != null ? fetchTimeout || DEFAULT_TIMEOUT
  const _retryDelays = retryDelays != null ? retryDelays || DEFAULT_RETRIES

  let requestsAttempted = 0
  let requestStartTime = 0

  return new Promise((resolve, reject) => {

    function sendTimedRequest() {
      requestsAttempted++
      requestStartTime = Date.now()
      let isRequestAlive = true
      const request = fetch(uri, init)

      const requestTimeout = setTimeout(() => {
        isRequestAlive = false
        if (shouldRetry(requestsAttempted)) {
          console.warn(`fetchWithRetries: HTTP error, retrying.`)
          retryRequest()
        } else {
          reject(new Error(`fetchWithRetries: Failed to get response from server, tried ${requestsAttempted} times.`))
        }
      }, _fetchTimeout)

      request.then(response => {

        clearTimeout(requestTimeout)
        if (isRequestAlive) {
          if (response.status >= 200 && response.status < 300) {
            resolve(response)
          } else if (shouldRetry(requestsAttempted)) {
            console.warn(`fetchWithRetries: HTTP error, retrying.`)
            retryRequest()
          } else {
            const error = new Error(`fetchWithRetries: Still no successfull response after ${requestsAttempted} retries, giving up.`)
            error.response = response
            reject(error)
          }
        }

      }).catch(error => {
        clearTimeout(requestTimeout)
        if (shouldRetry(requestsAttempted)) {
          retryRequest()
        } else {
          reject(error)
        }
      })
    }

    function retryRequest() {
      const retryDelay = _retryDelays[requestsAttempted - 1]
      const retryStartTime = requestStartTime + retryDelay
      setTimeout(sendTimedRequest, retryStartTime - Date.now())
    }

    function shouldRetry(attempt) {
      return attempt <= _retryDelays.length
    }

    sendTimedRequest()
  })

}

export default fetchWithRetries
