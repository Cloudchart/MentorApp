import React, {
  Component,
  View,
  Text,
  DeviceEventEmitter
} from "react-native";
import { Button } from "../../components";
import styles from "./style";
import { FBSDKAccessToken } from "react-native-fbsdkcore";
import { FBSDKLoginManager } from "react-native-fbsdklogin";


class FBLoginButton extends Component {

  constructor (props) {
    super(props)
    this.state = {
      errorRegister: false,
      user: null
    }
    FBSDKLoginManager.setLoginBehavior('native');
    this.onPress = this.onPress.bind(this)
  }

  componentWillMount () {

  }

  componentDidMount () {
    FBSDKAccessToken.getCurrentAccessToken((token)=> {
      if ( token ) {
        this.setState({ user: token })
      }
    })
  }

  componentWillUnmount () {

  }

  handleLogin () {
    FBSDKLoginManager.logInWithReadPermissions(this.props.permissions, (error, result) => {
      if ( error ) {
        this.props.onError && this.props.onError()
        return;
      }

      if ( result ) {
        if ( !error && !result.isCancelled && result.grantedPermissions ) {
          this.props.onLogin && this.props.onLogin();
        }
        if ( result.isCancelled ) {
          this.props.onCancel && this.props.onCancel()
        }
      }

    });
  }

  handleLogout () {
    FBSDKLoginManager.logOut();
    this.props.onLogout && this.props.onLogout()
  }

  onPress () {
    this.state.user
      ? this.handleLogout()
      : this.handleLogin();

    this.props.onPress && this.props.onPress();
  }

  render () {
    if ( !this.state.user ) {
      return <Login onPress={this.onPress} {...this.props}/>
    } else {
      return <Logout onPress={this.onPress} {...this.props}/>
    }
  }
}


const Login = (props) => (
  <Button
    label=""
    onPress={props.onPress}
    color="blue"
    style={[styles.connectButtonStyle, props.style]}>
    <Text style={styles.buttonText} numberOfLines={1}>
      Connect with <Text style={{fontWeight : '700'}}>Facebook</Text>
    </Text>
  </Button>
)

const Logout = (props) => (
  <Button
    label=""
    onPress={props.onPress}
    color="blue"
    style={[styles.connectButtonStyle, props.style]}>
    <Text style={styles.buttonText} numberOfLines={1}>
      <Text style={{fontWeight : '700'}}>Sign out</Text>
    </Text>
  </Button>
)

FBLoginButton.propTypes = {
  style: View.propTypes.style,
  onPress: React.PropTypes.func,
  onLogin: React.PropTypes.func,
  onLogout: React.PropTypes.func
}

FBLoginButton.defaultProps = {
  permissions: [ "email", "user_friends" ]
}

export default FBLoginButton;
