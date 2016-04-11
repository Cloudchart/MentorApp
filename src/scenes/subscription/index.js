import { NativeModules } from 'react-native'
import { InAppUtils } from 'NativeModules'
import React, {
  Component,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  AlertIOS,
} from 'react-native'
import Relay from 'react-relay';

import styles from './styles'

const PRODUCT_3_PREMIUM_TOPICS = 'org.reactjs.native.example.Mentor2.3_premium_topics';
const PRODUCT_FULL_ACCESS_MONTHLY = 'org.reactjs.native.example.Mentor2.full_access_monthly';
const PRODUCT_FULL_ACCESS_YEARLY = 'org.reactjs.native.example.Mentor2.full_access_yearly';

const ActiveOpacity = {
  activeOpacity: 0.75
};

class Subscription extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      loadedProducts: {}
    };
  }

  componentDidMount () {
    const products = [
      PRODUCT_3_PREMIUM_TOPICS,
      PRODUCT_FULL_ACCESS_MONTHLY,
      PRODUCT_FULL_ACCESS_YEARLY,
    ];
    InAppUtils.loadProducts(products, (error, products) => {
      if ( error ) {
        alert(
          'Failed to load products. It\'s OK if you run the app in Simulator. ' +
          'Mock data will be used to display products list.'
        );
        const productsMock = {};
        const prices = [ 0.99, 7.99, 5.60 ];
        products.forEach((value, index) => {
          productsMock[ value ] = {
            identifier: value,
            price: prices[ index ],
            currencySymbol: '$',
            currencyCode: 'USD',
            priceString: '$' + prices[ index ],
            downloadable: false,
            description: 'Description for ' + value,
            title: 'Title for ' + value
          }
        });
        this.setState({
          loadedProducts: productsMock
        });
        return;
      } // if (error)

      const loadedProducts = {};
      products.forEach(value => {
        loadedProducts[ value.identifier ] = value;
      });
      this.setState({ loadedProducts });
    });
  }

  _onHandlePurchase (productID) {
    InAppUtils.purchaseProduct(productID, (error, response) => {
      if ( error ) {
        AlertIOS.alert('Error', 'Failed to purchase. Please contact Application Developer.');
        return;
      }
      if ( response && response.productIdentifier ) {
        alert('addCredit', JSON.stringify(response));
      }
    });
  }

  render () {

    const { navigator } = this.props;

    return (
      <ScrollView>
        <View style={ styles.container }>
          <Text style={ styles.noteText }>
            Subscribe for the most efficient mentoring:
            get more advices, more topic slots,
            premium content, detailed progress state.
          </Text>
          <View style={ styles.subscriptionsContainer }>
            <TouchableOpacity
              {...ActiveOpacity}
              style={ styles.subscription }
              onPress={() => this._onHandlePurchase(PRODUCT_3_PREMIUM_TOPICS)}
            >
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
            <TouchableOpacity {...ActiveOpacity}
              style={ styles.subscription }
              onPress={() => this._onHandlePurchase(PRODUCT_FULL_ACCESS_MONTHLY)}
            >
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
            <TouchableOpacity
              {...ActiveOpacity}
              style={styles.subscription}
              onPress={() => this._onHandlePurchase(PRODUCT_FULL_ACCESS_YEARLY)}
            >
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

          <TouchableOpacity
            { ...ActiveOpacity }
            style={ styles.denyControl }
            onPress={() => navigator.pop()}>
            <Text style={ styles.denyControlText}>Sorry, not now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
}

export default Relay.createContainer(Subscription, {
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
