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
    const transaction = Relay.Store.applyUpdate(
      new AddCollectionToUserMutation(data), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          reject(getErrors(transact))
        }
      }
    );

    transaction.commit();
  })
}


/**
 *
 * @param data
 * @returns {Promise}
 */
export function removeCollection (data) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new RemoveCollectionFromUserMutation(data), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          reject(getErrors(transact))
        }
      }
    );

    transaction.commit();
  })
}


/**
 *
 * @param data
 * @returns {Promise}
 */
export function addToCollection (data) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new AddInsightToCollectionMutation(data), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          reject(getErrors(transact))
        }
      }
    );

    transaction.commit();
  })
}

/**
 *
 * @param data
 * @returns {Promise}
 */
export function markInsightUsefulInCollection (data) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new MarkInsightUsefulInCollectionMutation(data), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          reject(getErrors(transact))
        }
      }
    );

    transaction.commit();
  })
}

/**
 *
 * @param data
 * @returns {Promise}
 */
export function markInsightUselessInCollection (data) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new MarkInsightUselessInCollectionMutation(data), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          reject(getErrors(transact))
        }
      }
    );

    transaction.commit();
  })
}


