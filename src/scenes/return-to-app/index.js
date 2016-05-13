import React, {
  Animated,
  Component,
  StyleSheet,
  View
} from "react-native";
import Relay from 'react-relay';
import { Boris, Button } from "../../components";
import styles from "./style";
import { fragments } from "./fragments";


class ReturnToAppScene extends Component {

  state = {
    buttonOpacity: new Animated.Value(0)
  }

  constructor (props) {
    super(props)
    this._navigatorReplace = this._navigatorReplace.bind(this);
  }


  componentDidMount () {
    const { reactions } = this.props.viewer;
    const r = reactions && reactions.edges.length;

    if ( !r ) {
      this._navigatorReplace();
    } else {
      Animated.timing(this.state.buttonOpacity, {
        duration: 1000,
        toValue: 1
      }).start()
    }
  }

  _navigatorReplace () {
    const { viewer, navigator } = this.props;
    const { questions, insights } = viewer;
    let routerConf
    if ( questions && questions.edges.length ) {
      routerConf = {
        scene: 'questionnaire',
        title: '',
        goAfterFinish: 'insights',
        goAfterFinishProps: {
          filter: 'UNRATED',
        },
      }
    } else if ( insights && insights.edges.length ) {
      routerConf = {
        scene: 'follow-up',
        title: 'Rate used advice',
        goAfterFinish: 'insights',
        goAfterFinishProps: {
          filter: 'UNRATED',
        },
        buttonSkip: 'insights',
        buttonSkipProps: {
          filter: 'UNRATED',
        }
      }
    } else {
      routerConf = {
        scene: 'insights',
        filter: 'UNRATED',
      }
    }
    navigator.resetTo(routerConf);
  }


  _showBoris (reactions) {
    const { buttonOpacity } = this.state;
    const styleButton = [ styles.continue, { opacity: buttonOpacity } ];

    return (
      <View style={ styles.container }>
        <Boris
          mood={reactions.mood}
          size="big"
          note={reactions.content}
          animate={ true }
          style={ styles.boris }
        />

        <Animated.View style={styleButton}>
          <Button
            label="Let's go!"
            onPress={this._navigatorReplace}
            color="blue"
          />
        </Animated.View>
      </View>
    )
  }


  render () {
    const { viewer } = this.props;
    const { reactions } = viewer;

    if ( reactions && reactions.edges.length ) {
      return this._showBoris(reactions.edges[ 0 ].node);
    }

    return null;
  }
}


export default Relay.createContainer(ReturnToAppScene, {
  initialVariables: {
    count: 1,
    countInsights: 1,
    filter: 'ALL'
  },
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
            ${fragments}
        }
    `
  }
});

