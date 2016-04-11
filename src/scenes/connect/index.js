import React, {
  Component,
  StyleSheet,
  View,
  Text,
  ScrollView
} from "react-native";
import Relay from 'react-relay';
import { Boris, Button, TransparentButton, FBLoginButton } from "../../components";
import styles from "./style";


class Connect extends Component {

  constructor (props) {
    super(props)
    this.state = {
      errorRegister: false
    }

    this._onLogin = this._onLogin.bind(this)
    this._onError = this._onError.bind(this)
    this._onCancel = this._onCancel.bind(this)
    this._onPermissionsMissing = this._onPermissionsMissing.bind(this)
  }

  componentDidMount () {

  }

  _onLogin (data) {
    const { navigator } = this.props;
    setTimeout(()=> {
      this.setState({ errorRegister: false })
      navigator.push({ scene: 'questionnaire', title: '' })
    }, 0)
  }

  _onError (data) {
    setTimeout(()=> {
      this.setState({ errorRegister: true })
    }, 500)
  }

  _onCancel () {
    setTimeout(()=> {
      this.setState({ errorRegister: true })
    }, 500)
  }

  _onPermissionsMissing (data) {

  }

  render () {
    const { navigator } = this.props;
    const { errorRegister } = this.state;


    let note = errorRegister ? "Something went wrong. Please correct the problem and try again."
      : "Let's connect your profile so I can track your progress and mentor you properly!"

    let mood = errorRegister ? 'negative' : 'positive';
    let moodSequences = errorRegister ? 'ANGRY_TOANGRY' : 'NEUTRAL_TALK';

    return (
      <View style={ styles.container }>

        <Boris
          mood={mood}
          moodSequences={moodSequences}
          size="big"
          note={note}
          style={ styles.boris }
        />

        <View style={ styles.containerButtons }>
          <FBLoginButton
            onLogin={this._onLogin}
            onError={this._onError}
            onCancel={this._onCancel}
            onPermissionsMissing={this._onPermissionsMissing}
          />
          <TransparentButton
            label="Skip"
            onPress={ ()=>{ navigator.push({scene : 'questionnaire', title: '' }) } }
            color="blue"
            style={ styles.skipButtonStyle }
          />
        </View>
      </View>
    )
  }
}

export default Relay.createContainer(Connect, {
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            topics(first: 1, filter: DEFAULT) {
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
