import React, {
    Component,
    StyleSheet,
    View,
    Text,
    ScrollView,
    WebView
} from "react-native";
import styles from "./style";
import { Loader } from "../../components";
import Share from "../../components/navbar/share";
import AngleLeft from "../../components/navbar/back";

const WEBVIEW_REF = 'webview';

class WebViewScreen extends Component {

  constructor (props) {
    super(props)

    this.state = {
      scalesPageToFit: true,
      loading: true
    }
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
    const { advice } = this.props;

    return (
        <View style={ styles.container }>
          <WebView
              style={ styles.webView }
              ref={WEBVIEW_REF}
              automaticallyAdjustContentInsets={false}
              source={{uri: advice.url}}
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
              <Share url={advice.url}/>
            </View>
          </View>
        </View>
    )
  }
}


export default WebViewScreen;
