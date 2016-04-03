import React, {
  PushNotificationIOS,
  AppState,
  AlertIOS,
  AsyncStorage,
  NetInfo
} from "react-native";
import Relay from 'react-relay';
import { STORAGE_KEY } from "./actions/actions";
import {
  ActivateUserMutation,
  ResetUserMutation,
  SetUserPushTokenMutation,
  UserNotificationsSettingsMutation
} from "./mutations";

/**
 * check notification permissions
 * @private
 */
async function checkPermissions () {
  try {
    let confirm = await AsyncStorage.getItem(STORAGE_KEY);
    let permission = await _checkPermissionsNotification();
    let isConfirm = (confirm && confirm == 'already_request_permissions')
    let isPermission = (permission && permission == 'on')

    if ( isConfirm && !isPermission ) {
      AlertIOS.alert(
        'Notification Received',
        'Alert message: notifications off',
        [ {
          text: 'Dismiss',
          onPress: null
        } ]
      );
    }
  } catch ( e ) {
  }
}

/**
 *
 * @param notification
 * @private
 */
function notificationMessages (notification) {
  AlertIOS.alert(
    'Notification Received',
    'Alert message: ' + notification.getMessage(),
    [ {
      text: 'Dismiss',
      onPress: null
    } ]
  );
}


/**
 *
 * @private
 */
function recordNotifications (viewer) {
  let { notificationsSettings } = viewer;

  if ( !notificationsSettings ) notificationsSettings = {};

  let newNotificationsSettings = Object.assign(notificationsSettings, {
    startAt: 'test startAt',
    finishAt: 'test finishAt',
    utcOffset: 23434532453,
    timesToSend: 234234234
  })

  Relay.Store.commitUpdate(
    new UserNotificationsSettingsMutation({ notification: newNotificationsSettings }), {
      onSuccess: (transaction) => {
        console.log('UserNotificationsSettingsMutation', transaction);
      }
    }
  );
}

function checkNET (showAlert) {
  return new Promise((resolve, reject) => {
    NetInfo.fetch().done((reach) => {
      resolve(reach)
      if ( showAlert && reach == 'none' ) {
        NETAlert()
      }
    });
  })
}

function NETAlert () {
  AlertIOS.alert(
    'Notification Received',
    'Alert message: No network connection',
    [ {
      text: 'Dismiss',
      onPress: null
    } ]
  );
}

/**
 *
 * @returns {Promise}
 * @private
 */
function checkPermissionsNotification () {
  return new Promise((resolve, reject) => {
    PushNotificationIOS.checkPermissions((permissions) => {
      const { badge, sound, alert } = permissions;
      resolve(( badge || sound || alert ) ? 'on' : 'off')
    })
  })
}


export {
  checkPermissionsNotification,
  checkPermissions,
  checkNET,
  NETAlert,
  recordNotifications,
  notificationMessages
}
