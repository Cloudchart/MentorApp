import Relay from 'react-relay';
import { getErrors } from '../utils/get-errors-actions';
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
    const transaction = Relay.Store.applyUpdate(
      new SubscribeOnTopicMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          reject(getErrors(transaction))
        }
      }
    )

    transaction.commit();
  })
}


/**
 *
 * @param data
 * @returns {Promise}
 */
export function unsubscribeFromTopic (data) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new UnsubscribeFromTopicMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          reject(getErrors(transaction))
        }
      }
    )

    transaction.commit();
  })
}
