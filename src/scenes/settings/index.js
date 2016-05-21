import React, {
  Component,
  Text,
  TouchableOpacity,
  View,
  ListView,
  AsyncStorage,
} from 'react-native'
import Relay from 'react-relay'
import { FBSDKLoginManager } from 'react-native-fbsdklogin'
import { APPLICATION__IS_FIRST_LAUNCH } from '../../storage'
import { Button, FBLoginButton } from '../../components'
import Loader from '../../components/loader'
import styles from './style'
import { getGradient } from '../../utils/colors'
import ViewerRoute from '../../routes/viewer'
import ResetUserMutation from '../../mutations/reset-user'

export default class SettingsScene extends Component {

  static defaultProps = {
    menuItems: [{
      id: 0,
      name: 'Profile',
      screen: 'profile',
    }, {
      id: 1,
      name: 'Explore',
      screen: 'explore-topic',
    }, {
      id: 2,
      name: 'Your topics',
      screen: 'user-topics',
    }, {
      id: 3,
      name: 'Subscription',
      screen: 'subscription',
    }, {
      id: 3,
      name: 'Reset settings',
      screen: 'welcome',
    }],
  }

  constructor(props, context) {
    super(props, context)
    const basicDataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.state = {
      menuDataSource: basicDataSource.cloneWithRows(props.menuItems),
      isPending: false
    }
  }

  handleResetSettingsSuccess() {
    const { navigator } = this.props
    this.setState({
      isPending: true,
    })
    AsyncStorage.setItem(APPLICATION__IS_FIRST_LAUNCH, 'true', () => {
      navigator.replace({
        scene: 'welcome',
        title: 'Virtual Mentor',
      })
    })
  }

  handleResetSettingsPress(data, relay) {
    const mutation = new ResetUserMutation({
      user: data.viewer,
    })
    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => {
        relay.forceFetch({}, readyState => {
          if (readyState.done) {
            FBSDKLoginManager.logOut()
            this.handleResetSettingsSuccess()
          }
        })
      },
    })
  }

  handleItemPress(menuItem) {
    this.props.navigator.push({
      scene: menuItem.screen,
      title: menuItem.name,
    })
  }

  handleLogout() {
    this.props.navigator.resetTo({
      scene: 'settings',
      title: 'Settings',
    })
  }

  _renderButtons(rowData, sectionID, rowID) {
    if (rowData.name === 'Reset settings') {
      return (
        <Relay.RootContainer
          Component={ResetSettingsMenuItem}
          route={new ViewerRoute()}
          renderFetched={data => (
            <ResetSettingsMenuItem
              {...data}
              {...rowData}
              rowID={rowID}
              onPress={relay => this.handleResetSettingsPress(data, relay)}
              />
          )}
          />
      )
    }
    return (
      <SettingsMenuItem
        {...rowData}
        rowID={rowID}
        onPress={() => this.handleItemPress(rowData)}
        />
    )
  }

  render() {
    const { isPending, menuDataSource } = this.state
    if (isPending) {
      return (
        <Loader />
      )
    }
    return (
      <View style={styles.container}>
        <ListView
          dataSource={menuDataSource}
          renderRow={(rowData, sectionID, rowID) => this._renderButtons(rowData, sectionID, rowID)}
          pageSize={20}
          showsVerticalScrollIndicator={true}
          style={styles.items}
          />
        <Relay.RootContainer
          Component={ProfileLoginLogoutButton}
          route={new ViewerRoute()}
          renderFetched={props => (
            <ProfileLoginLogoutButton
              {...props}
              onLogout={() => this.handleLogout()}
              />
          )}
          />
      </View>
    )
  }
}

const SettingsMenuItem = props => (
  <TouchableOpacity
    onPress={() => props.onPress(props.relay)}
    activeOpacity={0.75}
    style={[styles.item, { backgroundColor: getGradient('green', props.rowID) }]}
    >
    <Text style={styles.itemText}>
      {props.name}
    </Text>
  </TouchableOpacity>
)

const ResetSettingsMenuItem = Relay.createContainer(SettingsMenuItem, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        email
        name
      }
    `,
  },
})

const LoginLogoutButton = ({ viewer, onLogout, onViewerReady }) => {
  return (
    <FBLoginButton
      viewer={viewer}
      style={styles.button}
      onLogout={() => onLogout && onLogout()}
      />
  )
}

const ProfileLoginLogoutButton = Relay.createContainer(LoginLogoutButton, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        email
        name
      }
    `,
  },
})
