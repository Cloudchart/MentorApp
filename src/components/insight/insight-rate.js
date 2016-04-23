import React, {
  Component,
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Linking,
  PanResponder,
  Animated
} from "react-native";
import styles from "./style";
import * as device from "../../utils/device";


class InsightRate extends Component {

  state = {
    rowHeight: 0,
    visibility: 0,
    update: 0
  }

  constructor (props) {
    super(props)
    this._onPressCard = this._onPressCard.bind(this)
  }

  /**
   *
   * @param evt
   * @private
   */
  _onPressCard (evt) {
    console.log('_onPressCard ');
  }


  calculateContentFontSize () {
    return {
      fontSize: device.fontSize(20),
      lineHeight: device.fontSize(20 * 1.2)
    }
  }

  render () {
    const { content, like, dislike } = this.props.insight;
    const { didNotWork, itWorks } = this.props;

    const styleInner = like ? styles.itemInnerLike : styles.itemInner;
    const styleText = like ? styles.itemTextLike : styles.itemText;
    const disLikeOpacity = like ? 0.7 : 1;
    const likeOpacity = dislike ? 0.7 : 1;

    return (
      <View
        activeOpacity={ 0.75 }
        style={[styles.item, this.props.style]}
        onPress={this._onPressCard}>

        <View style={ styleInner }>
          <Text style={[styleText, this.calculateContentFontSize(content)]}>
            {content.length ? content.trim() : content}
          </Text>
        </View>


        <View style={[styles.itemMoreInner, { paddingVertical : device.size(18) }]}>
          <View style={styles.itemMoreControl}>

            <TouchableOpacity
              activeOpacity={ 0.75 }
              style={styles.itemMoreControlLeft}
              onPress={didNotWork}>
              <Text style={[styles.itemMoreControlLeftText, { opacity : disLikeOpacity }]}>
                Didn’t work
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={ 0.75 }
              style={styles.itemMoreControlRight}
              onPress={itWorks}>
              <Text style={[styles.itemMoreControlRightText, { opacity : likeOpacity }]}>
                It works!
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>

    )
  }
}

export default InsightRate;
