import React, {
    Component,
    StyleSheet,
    View,
    Text,
    ScrollView,
    WebView
} from "react-native";
import Relay from 'react-relay';

import styles from "./style";
import { Loader } from "../../components";
import Share from "../../navbar/share";
import AngleLeft from "../../navbar/back";

const WEBVIEW_REF = 'webview';

class WebViewScreen extends Component {

  state = {
    scalesPageToFit: true,
    loading: true
  }

  constructor (props) {
    super(props)
  }

  onNavigationStateChange () {

  }

  onShouldStartLoadWithRequest () {
    return true;
  }

  _onLoad () {

  }

  _onError () {
    const { navigator } = this.props
    //navigator.pop()
  }

  goBack () {
    this.refs[ WEBVIEW_REF ].goBack();
  }

  goForward () {
    this.refs[ WEBVIEW_REF ].goForward();
  }

  reload () {
    this.refs[ WEBVIEW_REF ].reload();
  }

  render () {
    const { url } = this.props;

    return (
        <View style={ styles.container }>
          <WebView
              style={ styles.webView }
              ref={WEBVIEW_REF}
              automaticallyAdjustContentInsets={false}
              source={{uri: url}}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              decelerationRate="normal"
              onNavigationStateChange={this.onNavigationStateChange.bind(this)}
              onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest.bind(this)}
              onLoad={this._onLoad.bind(this)}
              onError={this._onError.bind(this)}
              startInLoadingState={true}
              scalesPageToFit={this.state.scalesPageToFit}
          />

          <View style={ styles.navigation }>
            <AngleLeft navigator={this.props.navigator}/>

            <View style={styles.rightButton}>
              <Share url={url}/>
            </View>
          </View>
        </View>
    )
  }
}

export default Relay.createContainer(WebViewScreen, {
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
