import React, { Component, StyleSheet, View, Text, ScrollView } from "react-native";
import { Boris, Button, TransparentButton, FBLoginButton } from "../../components";
import { connect } from "react-redux";
import { USER_FACEBOOK_LOGIN } from "../../module_dal/actions/actions";
import { ANGRY_TOANGRY } from '../../components/boris/sequences-big';
import styles from "./style";


class Connect extends Component {

  constructor (props) {
    super(props)
    this.state = {
      errorRegister: false
    }
  }

  _onLogin (data) {
    const { navigator, dispatch } = this.props;
    this.setState({ errorRegister: false })

    setTimeout(()=> {
      dispatch({ type: USER_FACEBOOK_LOGIN })
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
                onLogin={this._onLogin.bind(this)}
                onError={this._onError.bind(this)}
                onCancel={this._onCancel.bind(this)}
                onPermissionsMissing={this._onPermissionsMissing.bind(this)}
            />
            <TransparentButton
                label="Skip"
                onPress={ ()=>{ navigator.replace({scene : 'questionnaire', title: '' }) } }
                color="blue"
                style={ styles.skipButtonStyle }
            />
          </View>
        </View>
    )
  }
}

Connect.propTypes = {
  onForward: React.PropTypes.func
};

export default connect()(Connect)
