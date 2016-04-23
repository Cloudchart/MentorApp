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
 */
export async function checkPermissions () {
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
 */
export function notificationMessages (notification) {
  AlertIOS.alert(
    'Notification Received',
    'Alert message: ' + notification.getMessage(),
    [ {
      text: 'Dismiss',
      onPress: null
    } ]
  );
}

export function checkNET (showAlert) {
  return new Promise((resolve, reject) => {
    NetInfo.fetch().done((reach) => {
      resolve(reach)
      if ( showAlert && reach == 'none' ) {
        //NETAlert()
      }
    });
  })
}

export function NETAlert () {
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
 */
export function checkPermissionsNotification () {
  return new Promise((resolve, reject) => {
    PushNotificationIOS.checkPermissions((permissions) => {
      const { badge, sound, alert } = permissions;
      resolve(( badge || sound || alert ) ? 'on' : 'off')
    })
  })
}
