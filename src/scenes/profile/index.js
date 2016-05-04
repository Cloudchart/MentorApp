import React, {
  Component,
  Text,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import Relay from 'react-relay';
import { Boris, Button, TransparentButton } from "../../components";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { FBSDKGraphRequest, FBSDKAccessToken } from "react-native-fbsdkcore";
import { FBSDKLoginManager } from "react-native-fbsdklogin";
import { USER_SUBSCRIBE_NEWSLETTER, USER_FACEBOOK_LOGIN } from "../../actions/application";
import { loginAndGetDataFromFB } from "../../actions/user";
import styles from "./style";
import baseStyles from "../../styles/base";

class Profile extends Component {

  state = {
    userEmail: ''
  }

  constructor (props) {
    super(props);

    /** trying to get the token */
    if ( !this.props.viewer.email ) {
      this._tryLogin();
    } else {
      this.state.userEmail = this.props.viewer.email;
    }
    this.subscribe = this.subscribe.bind(this)
  }

  /**
   *
   * @private
   */
  _tryLogin () {
    const { navigator } = this.props;

    loginAndGetDataFromFB()
      .then((data)=> {
        this.setState({ userEmail: data.email })
      })
      .catch((err)=> {
        if ( err.isCancelled ) {
          navigator.pop();
        } else {
          alert('Error logging in.');
        }
      })
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
            id
            name
            email
        }
    `
  }
});

