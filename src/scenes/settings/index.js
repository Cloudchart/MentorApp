import React, {
  Component,
  Text,
  TouchableOpacity,
  View,
  ListView
} from 'react-native'
import Relay from 'react-relay'
import { Button, FBLoginButton, Loader } from '../../components'
import styles from './style'
import { getGradient } from '../../utils/colors'
import { resetUser } from '../../actions/user'
import { ViewerRoute } from '../../routes'

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
    }
  }

  handleItemPress(menuItem) {
    const { navigator, viewer } = this.props
    if (menuItem.name == 'resetUser') {
      resetUser({ user: viewer })
        .then(() => {
          navigator.replace({
            scene: 'welcome',
            title: 'Virtual Mentor',
          })
        })
      return
    }
    navigator.push({
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
    return (
      <SettingsMenuItem
        {...rowData}
        rowID={rowID}
        onPress={() => this.handleItemPress(rowData)}
        />
    )
  }

  render() {
    const { viewer } = this.props
    const { menuDataSource } = this.state
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
          onLogout={() => this.handleLogout()}
          />
      </View>
    )
  }
}

const SettingsMenuItem = ({ rowID, name, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={[styles.item, { backgroundColor: getGradient('green', rowID) }]}
    >
    <Text style={styles.itemText}>
      {name}
    </Text>
  </TouchableOpacity>
)

const LoginLogoutButton = ({ viewer, onLogout }) => (
  <FBLoginButton
    viewer={viewer}
    style={styles.button}
    onLogout={() => onLogout && onLogout()}
    />
)

const ProfileLoginLogoutButton = Relay.createContainer(LoginLogoutButton, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        email
        name
      }
    `
  },
})
