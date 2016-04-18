import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Relay from 'react-relay';
import { Loader, ScrollListView } from "../../components";
import { getGradient } from "../../utils/colors";
import styles from "./style";

class TopicEmpty extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    const { topic, index, selectTopic } = this.props;
    const paidColor = { backgroundColor: topic.isPaid ? 'blue' : getGradient('green', index) }
    return (
      <TouchableOpacity
        activeOpacity={ 0.75 }
        style={[styles.item, paidColor ]}
        onPress={selectTopic}>
        <View style={ styles.itemInner }>
          <Text style={ styles.itemText } numberOfLines={ 1 }>
            { topic.name }
          </Text>

          {this.props.children}
        </View>
      </TouchableOpacity>
    )
  }
}


export default Relay.createContainer(TopicEmpty, {

  fragments: {
    user: () => Relay.QL`
        fragment on User {
            id
        }
    `,

    topic: () => Relay.QL`
        fragment on Topic {
            id
            name
            isPaid
        }
    `
  }
});

