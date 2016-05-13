import React, {
  PushNotificationIOS,
  AppState,
  AlertIOS,
  AsyncStorage,
  NetInfo
} from 'react-native'
import { NOTIFICATIONS_PERMISSION_STATUS } from './actions/application'

/**
 * @returns {Promise|void}
 */
export async function checkPermissions() {
  try {
    const notificationsStatus = await AsyncStorage.getItem(NOTIFICATIONS_PERMISSION_STATUS)
    const isNotificationsAllowed = await getNotificationPermission()
    const isNotificationsRequested = (notificationsStatus === 'already_request_permissions')
    if (isNotificationsRequested && !isNotificationsAllowed) {
      AlertIOS.alert(
        'Notification Received',
        'Alert message: notifications off',
        [{
          text: 'Dismiss',
          onPress: null,
        }]
      )
    }
  } catch (e) {
    // nothing
  }
}

// export function handleNotificationReceived(notification) {
//   AlertIOS.alert(
//     'Notification Received',
//     'Alert message: ' + notification.getMessage(),
//     [{
//       text: 'Dismiss',
//       onPress: null,
//     }]
//   )
// }

export function checkNET(showAlert) {
  return new Promise((resolve, reject) => {
    NetInfo.fetch().done((reach) => {
      resolve(reach)
      if ( showAlert && reach == 'none' ) {
        //NETAlert()
      }
    })
  })
}

export function NETAlert() {
  AlertIOS.alert(
    'Notification Received',
    'Alert message: No network connection',
    [ {
      text: 'Dismiss',
      onPress: null
    } ]
  )
}

/**
 * @returns {Promise|Boolean}
 */
export function getNotificationsPermission() {
  return new Promise(resolve => {
    PushNotificationIOS.checkPermissions(permissions => {
      const { badge, sound, alert } = permissions
      const result = Boolean(badge || sound || alert)
      resolve(result)
    })
  })
}
