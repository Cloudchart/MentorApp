import React, {
    Component,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    View,
    ListView
} from "react-native";
import { Button, ScrollListView, FBLoginButton } from "../../components";
import { connect } from "react-redux";
import styles from "./style";
import { getGradient } from "../../utils/colors";

const dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})


class Settings extends Component {

  /**
   *
   * @param settingData
   * @private
   */
  _handleItemPress (settingData) {
    const { navigator } = this.props;
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
      navigator.replace({
        scene: 'welcome',
        title: 'Virtual Mentor'
      })
    }, 0)
  }

  render () {
    const { settings } = this.props;
    return (
        <View style={ styles.container }>

          <ScrollListView
              dataSource={dataSource.cloneWithRows(settings.list)}
              renderRow={(props) => <ItemSettings {...props} handleItemPress={this._handleItemPress.bind(this)} />}
              pageSize={14}
              showsVerticalScrollIndicator={false}
              style={ styles.items }/>

          <FBLoginButton
              style={ styles.button }
              onLogout={this._onLogout.bind(this)}
          />
        </View>
    )
  }
}

class ItemSettings extends Component {
  constructor (props) {
    super(props)
    this.handleItemPress = this.props.handleItemPress.bind(null, this.props)
  }

  render () {
    return (
        <TouchableOpacity
            onPress={this.handleItemPress}
            activeOpacity={ 0.75 }
            style={ [ styles.item, { backgroundColor: getGradient('green', this.props.id) } ] }>
          <Text style={ styles.itemText }>
            { this.props.name }
          </Text>
        </TouchableOpacity>
    )
  }
}

export default connect(state=> ( {
  settings: state.settings
}))(Settings)
