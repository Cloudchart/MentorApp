import React, { Component, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import styles from "./style";


const ActiveOpacity = {
  activeOpacity: 0.75
}


class Subscription extends Component {

  render () {
    return (
        <ScrollView>
          <View style={ styles.container }>
            <Text style={ styles.noteText }>
              Subscribe for the most efficient mentoring:
              get more advices, more topic slots,
              premium content, detailed progress state.
            </Text>
            <View style={ styles.subscriptionsContainer }>
              <TouchableOpacity { ...ActiveOpacity } style={ styles.subscription }>
                <View style={ styles.subscriptionTitle }>
                  <Text style={ styles.subscriptionTitleText }>
                    3 premium topics
                  </Text>
                  <Text style={ styles.subscriptionTitleNote }>
                    incl. this one
                  </Text>
                </View>
                <View style={ styles.subscriptionPrice }>
                  <Text style={ styles.subscriptionPriceText }>
                    <Text style={ styles.subscriptionPriceTextNote }>just</Text>
                    <Text>&nbsp;</Text>
                    $0.99
                    <Text style={ [styles.subscriptionPriceTextNote, styles.transparentText] }>/mo</Text>
                  </Text>
                  <Text style={ styles.subscriptionTitleNote }/>
                </View>
              </TouchableOpacity>
              <TouchableOpacity { ...ActiveOpacity } style={ styles.subscription }>
                <View style={ styles.subscriptionTitle }>
                  <Text style={ styles.subscriptionTitleText }>
                    Full access
                  </Text>
                  <Text style={ styles.subscriptionTitleNote }>
                    (billed monthly)
                  </Text>
                </View>
                <View style={ styles.subscriptionPrice }>
                  <Text style={ styles.subscriptionPriceText }>
                    $7.99
                    <Text style={ styles.subscriptionPriceTextNote }>/mo</Text>
                  </Text>
                  <Text style={ styles.subscriptionTitleNote }/>
                </View>
              </TouchableOpacity>
              <TouchableOpacity { ...ActiveOpacity } style={ styles.subscription }>
                <View style={ styles.subscriptionTitle }>
                  <Text style={ styles.subscriptionTitleText }>
                    Full access
                  </Text>
                  <Text style={ styles.subscriptionTitleNote }>
                    (billed annually*)
                  </Text>
                </View>
                <View style={ styles.subscriptionPrice }>
                  <Text style={ [styles.subscriptionPriceText, styles.subscriptionDisabledText] }>
                    $7.99
                  </Text>
                  <Text style={ styles.subscriptionTitleNote }/>
                  <View style={ styles.deleted }/>
                </View>
                <View style={ styles.subscriptionPrice }>
                  <Text style={ styles.subscriptionPriceText }>
                    $5.60
                    <Text style={ styles.subscriptionPriceTextNote }>/mo</Text>
                  </Text>
                  <Text style={ styles.subscriptionTitleNote }/>
                </View>
              </TouchableOpacity>

              <View style={ styles.subscriptionsFootnote}>
                <Text style={ styles.subscriptionsFootnoteText }>
                  * 30% off! That's mentoring for just 18 cents
                </Text>
                <Text style={ styles.subscriptionsFootnoteText }>
                  a day or the price of 1 coffee in 3 weeks
                </Text>
              </View>
            </View>

            <TouchableOpacity { ...ActiveOpacity } style={ styles.denyControl }>
              <Text style={ styles.denyControlText}>Sorry, not now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    )
  }

}

export default Subscription
