import React, {
    Component,
    Text,
    ScrollView,
    TouchableOpacity,
    View
} from "react-native";
import Relay from 'react-relay';
import { Boris, Button, TransparentButton, Loader } from "../../components";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { FBSDKGraphRequest, FBSDKAccessToken } from "react-native-fbsdkcore";
import { FBSDKLoginManager } from "react-native-fbsdklogin";
import { USER_SUBSCRIBE_NEWSLETTER, USER_FACEBOOK_LOGIN } from "../../actions/actions";
import styles from "./style";
import baseStyles from "../../styles/base";

class Profile extends Component {

  constructor (props) {
    super(props)

    this.state = {
      userEmail: ''
    }

    FBSDKLoginManager.setLoginBehavior('native');

    /** trying to get the token */
    FBSDKAccessToken.getCurrentAccessToken((token)=> {
      if ( token ) {
        this._fetchUserData()
      } else {
        this._tryLogin()
      }
    })

    this.subscribe = this.subscribe.bind(this)
  }

  /**
   *
   * @private
   */
  _tryLogin () {
    const { user, navigator, dispatch } = this.props;
    FBSDKLoginManager.logInWithReadPermissions(user.loginPermissions, (error, result) => {
      if ( error ) {
        alert('Error logging in.');
      } else {
        if ( result.isCancelled ) {
          navigator.pop()
        } else {
          dispatch({ type: USER_FACEBOOK_LOGIN })
          this._fetchUserData()
        }
      }
    });
  }

  /**
   *
   * @private
   */
  _fetchUserData () {
    var fetchFriendsRequest = new FBSDKGraphRequest((error, result) => {
      if ( !error ) {
        this.setState({
          userEmail: result.email
        })
      }
    }, 'me/?fields=email');
    fetchFriendsRequest.start();
  }

  subscribe () {
    const { dispatch } = this.props;
    if ( this.state.userEmail ) {
      dispatch({
        type: USER_SUBSCRIBE_NEWSLETTER,
        email: this.state.userEmail
      })
    }
  }

  render () {
    const { user } = this.props;
    const borisText = `My sensors detected your email: ${this.state.userEmail}, Master. Would you like me to send you some pleasantly rare emails!`;
    const borisTextSubscribe = `This is your profile. You can manage your newsletter subscription below, Master.`;

    if ( user.subscribeNewsletter ) {
      return <AllReadySubscribe borisText={borisTextSubscribe}/>
    }

    if ( !this.state.userEmail ) {
      return <Loader />
    }

    return (
        <View style={ styles.container }>
          <View style={ styles.borisContainer }>
            <Boris
                mood="positive"
                size="small"
                note={ borisText }/>
          </View>

          <Button
              label=""
              color="green"
              onPress={this.subscribe}
              style={ styles.button }>
            <Text style={ styles.buttonText }>Subscribe to newsletter</Text>
          </Button>
        </View>
    )
  }
}


const AllReadySubscribe = (props) => (
    <View style={ styles.container }>
      <View style={ styles.borisContainer }>
        <Boris
            mood="positive"
            size="small"
            note={ props.borisText }/>
      </View>

      <Button
          label=""
          color="green"
          style={ styles.button }>
        <View style={styles.buttonInner}>
          <Text style={ styles.buttonText }>Subscribe to newsletter</Text>
          <Icon name="check" style={[baseStyles.crumbIconAngle, styles.selectedIcon]}/>
        </View>
      </Button>
    </View>
)

const ReduxComponent = connect(state => ({
  user: state.user
}))(Profile)

export default Relay.createContainer(ReduxComponent, {
  fragments: {
    viewer: () => Relay.QL`     
      fragment on User {       
        topics(first: 100, filter: DEFAULT) {
          edges {
            node {
              name
            }
          }
        }
      }
    `
  }
});

