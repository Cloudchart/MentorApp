import Relay from 'react-relay';
import {
  SubscribeOnTopicMutation,
  UnsubscribeFromTopicMutation
} from '../mutations';

/**
 *
 * @param insight
 * @returns {Promise}
 */
export function subscribeOnTopic (data) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new SubscribeOnTopicMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          let error = transaction.getError()
          reject(error.source)
        }
      }
    )
  })
}


/**
 *
 * @param data
 * @returns {Promise}
 */
export function unsubscribeFromTopic (data) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new UnsubscribeFromTopicMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          let error = transaction.getError()
          reject(error.source)
        }
      }
    )
  })
}
