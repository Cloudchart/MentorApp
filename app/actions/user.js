import Relay from 'react-relay';
import { getErrors } from '../utils/get-errors-actions';
import {
  ActivateUserMutation,
  ResetUserMutation,
  SetUserPushTokenMutation,
  UserNotificationsSettingsMutation
} from '../mutations';

/**
 *
 * @param data
 * @returns {Promise}
 */
export function setUserPushToken (data) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new SetUserPushTokenMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          reject(getErrors(transaction))
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
export function activateUser (data) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new ActivateUserMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          reject(getErrors(transaction))
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
export function resetUser (data) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new ResetUserMutation(data), {
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
