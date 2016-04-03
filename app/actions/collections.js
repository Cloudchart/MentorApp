import Relay from 'react-relay';
import {
  AddCollectionToUserMutation,
  AddInsightToCollectionMutation,
  RemoveCollectionFromUserMutation
} from "../mutations";

/**
 *
 * @param insight
 * @param collectionData
 * @param viewer
 * @returns {Promise}
 */
export function createCollection (data) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new AddCollectionToUserMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          let error = transaction.getError();
          reject(error.source)
        }
      }
    );
  })
}


/**
 *
 * @param data
 * @returns {Promise}
 */
export function removeCollection (data) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new RemoveCollectionFromUserMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          let error = transaction.getError()
          reject(error.source)
        }
      }
    );
  })
}


/**
 *
 * @param data
 * @returns {Promise}
 */
export function addToCollection (data) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new AddInsightToCollectionMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          let error = transaction.getError()
          reject(error)
        }
      }
    );
  })
}


