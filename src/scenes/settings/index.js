import React, {
  Component,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  ListView
} from "react-native";
import Relay from 'react-relay';
import { Button, FBLoginButton } from "../../components";
import styles from "./style";
import { getGradient } from "../../utils/colors";

import { resetUser } from "../../actions/user";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})


class Settings extends Component {


  static defaultProps = {
    menu: [
      {
        id: 0,
        name: 'Profile',
        screen: 'profile'
      },
      {
        id: 1,
        name: 'Explore',
        screen: 'explore-topic'
      },
      {
        id: 2,
        name: 'Your topics',
        screen: 'user-topics'
      },
      {
        id: 3,
        name: 'Subscription',
        screen: 'subscription'
      },
      {
        id: 3,
        name: 'Reset settings',
        screen: 'welcome'
      }
    ]
  }

  constructor (props) {
    super(props)
    this._onLogout = this._onLogout.bind(this);
  }

  /**
   *
   * @param settingData
   * @private
   */
  _handleItemPress (settingData) {
    const { navigator, viewer } = this.props;

    if ( settingData.name == 'resetUser' ) {
      resetUser({ user: viewer })
        .then(()=> {
          navigator.replace({
            scene: 'welcome',
            title: 'Virtual Mentor'
          })
        });
      return;
    }

    navigator.push({
      scene: settingData.screen,
      title: settingData.name
    })
  }

  /**
   * Logout and return welcome screen
   * @param data
   * @private
   */
  _onLogout (data) {
    const { navigator } = this.props;
    setTimeout(()=> {
      navigator.resetTo({
        scene: 'welcome',
        title: 'Virtual Mentor'
      })
    }, 0)
  }

  _renderButtons (rowData, sectionID, rowID) {
    return (
      <ItemSettings
        {...rowData}
        rowID={rowID}
        handleItemPress={this._handleItemPress.bind(this, rowData)}/>
    )
  }

  render () {
    const { menu } = this.props;
    return (
      <View style={ styles.container }>

        <ListView
          dataSource={dataSource.cloneWithRows(menu)}
          renderRow={(rowData, sectionID, rowID) => this._renderButtons(rowData, sectionID, rowID)}
          pageSize={20}
          showsVerticalScrollIndicator={true}
          style={ styles.items }/>

        <FBLoginButton
          viewer={this.props.viewer}
          style={ styles.button }
          onLogout={this._onLogout}
        />
      </View>
    )
  }
}

class ItemSettings extends Component {
  render () {
    return (
      <TouchableOpacity
        onPress={this.props.handleItemPress}
        activeOpacity={ 0.75 }
        style={ [ styles.item, { backgroundColor: getGradient('green', this.props.rowID) } ] }>
        <Text style={ styles.itemText }>
          { this.props.name }
        </Text>
      </TouchableOpacity>
    )
  }
}

export default Relay.createContainer(Settings, {
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            id
            email
            name
        }
    `
  }
});
