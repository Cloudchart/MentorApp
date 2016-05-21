import React, {
  Component,
  View,
  Text,
  DeviceEventEmitter
} from 'react-native'
import { Button } from '../../components'
import styles from './style'
import { loginAndGetDataFromFB, updateUser } from '../../actions/user'
import { FBSDKAccessToken, FBSDKGraphRequest } from 'react-native-fbsdkcore'
import { FBSDKLoginManager } from 'react-native-fbsdklogin'

class FBLoginButton extends Component {

  static propTypes = {
    style: View.propTypes.style,
    onPress: React.PropTypes.func,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func
  }

  static defaultProps = {
    permissions: [ "email", "user_friends" ]
  }

  state = {
    errorRegister: false,
    user: null
  }

  constructor (props) {
    super(props)
    this.onPress = this.onPress.bind(this)
  }


  componentDidMount () {
    FBSDKAccessToken.getCurrentAccessToken((token)=> {
      if ( token ) {
        this.setState({ user: token })
      }
    })
  }


  /**
   *
   */
  async handleLogin () {
    try {
      const result = await loginAndGetDataFromFB();
      await updateUser({
        user: {
          id: this.props.viewer.id,
          email: result.email
        }
      });

      if ( result.email ) {
        this.setState({
          user: result,
          userEmail: result.email
        })
        this.props.onLogin && this.props.onLogin(result);
      }
    } catch ( err ) {
      if ( err.isCancelled ) {
        this.props.onCancel && this.props.onCancel(err)
      } else {
        this.props.onError && this.props.onError(err)
      }
    }
  }

  handleLogout () {
    FBSDKLoginManager.logOut();
    this.setState({ user: null });
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

export default FBLoginButton;
