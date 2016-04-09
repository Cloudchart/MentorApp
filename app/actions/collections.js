import Relay from 'react-relay';
import { getErrors } from '../utils/get-errors-actions';
import {
  AddCollectionToUserMutation,
  AddInsightToCollectionMutation,
  RemoveCollectionFromUserMutation,
  MarkInsightUselessInCollectionMutation,
  MarkInsightUsefulInCollectionMutation
} from "../mutations";

/**
 *
 * @param data
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
          reject(getErrors(transaction))
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
          reject(getErrors(transaction))
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
          reject(getErrors(transaction))
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
export function markInsightUsefulInCollection (data) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new MarkInsightUsefulInCollectionMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          reject(getErrors(transaction))
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
export function markInsightUselessInCollection (data) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new MarkInsightUselessInCollectionMutation(data), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          reject(getErrors(transaction))
        }
      }
    );
  })
}


