import Relay from 'react-relay';
import { getErrors } from '../utils/get-errors-actions';
import moment from 'moment';
import {
  ActivateUserMutation,
  ResetUserMutation,
  SetUserPushTokenMutation,
  UpdateUserNotificationsSettingsMutation,
  UpdateUserMutation
} from '../mutations';

import { FBSDKAccessToken, FBSDKGraphRequest } from "react-native-fbsdkcore";
import { FBSDKLoginManager } from "react-native-fbsdklogin";

FBSDKLoginManager.setLoginBehavior('native');
/**
 *
 * @param data
 * @returns {Promise}
 */
export function setUserPushToken (data) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new SetUserPushTokenMutation(data), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          reject(getErrors(transact))
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
export function activateUser (data) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new ActivateUserMutation(data), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          reject(getErrors(transact))
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
export function updateUser (data) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new UpdateUserMutation(data), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          reject(getErrors(transact))
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
export function resetUser (data) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new ResetUserMutation(data), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          let error = transact.getError()
          reject(error.source)
        }
      }
    )

    transaction.commit();
  })
}


/**
 *
 * @param viewer
 * @returns {Promise}
 */
export function updateUserNotifications (finishAt) {
  const now = moment().format('HH:MM');
  let newNotificationsSettings = {
    startAt: now,
    utcOffset: moment().utcOffset(),
    timesToSend: 0
  }

  if(finishAt){
    newNotificationsSettings.finishAt = now;
  }

  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new UpdateUserNotificationsSettingsMutation({ ...newNotificationsSettings }), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          let error = transact.getError();
          reject(error.source)
        }
      }
    )
    transaction.commit();
  })
}


/**
 *
 * @returns {Promise}
 */
export function fetchUserFBData () {
  return new Promise((resolve, reject)=> {
    var fetchFriendsRequest = new FBSDKGraphRequest((error, result) => {
      if ( !error ) {
        resolve(result);
      } else {
        reject(error);
      }
    }, 'me/?fields=email');
    fetchFriendsRequest.start();
  })
}


/**
 *
 * @returns {Promise}
 */
export function tryLoginFB () {
  return new Promise((resolve, reject)=> {
    FBSDKLoginManager.logInWithReadPermissions([ "email", "user_friends" ], (error, result) => {
      if ( error ) {
        reject(error)
        return;
      }
      if ( result ) {
        if ( !error && !result.isCancelled && result.grantedPermissions ) {
          resolve(result);
        }
        if ( result.isCancelled ) {
          reject({ isCancelled: true });
        }
      }
    });
  })
}

/**
 *
 * @returns {Promise}
 */
export function loginAndGetDataFromFB () {
  return new Promise((resolve, reject)=> {
    tryLoginFB()
      .then(()=> {
        fetchUserFBData()
          .then(resolve)
          .catch(reject)
      }).catch(reject)
  });
}
