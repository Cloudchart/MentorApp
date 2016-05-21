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
import { Loader } from '../../components'
import styles from './styles'
import Relay from 'react-relay'
import PurchaseProductMutation from '../../mutations/purchase-product'

const PRODUCT_3_PREMIUM_TOPICS = 'PRODUCT_3_PREMIUM_TOPICS'
const PRODUCT_FULL_ACCESS_MONTHLY = 'PRODUCT_FULL_ACCESS_MONTHLY'
const PRODUCT_FULL_ACCESS_YEARLY = 'PRODUCT_FULL_ACCESS_YEARLY'

const activeOpacityProps = {
  activeOpacity: 0.75,
}

export default class SubscriptionScene extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      loadedProducts: {},
      purchasedProducts: null,
      isLoading: true,
      isPurchasing: false,
    }
  }

  componentDidMount() {
    const products = [
      PRODUCT_3_PREMIUM_TOPICS,
      PRODUCT_FULL_ACCESS_MONTHLY,
      PRODUCT_FULL_ACCESS_YEARLY,
    ]
    InAppUtils.loadProducts(products, (error, products) => {
      if (this._isUnmounted) {
        return
      }
      const loadedProducts = {}
      if (error !== null) {
        AlertIOS.alert(
          'iTunes error',
          'Failed to load products. It\'s OK if you run the app in Simulator. ' +
          'Mock data will be used to display products list.'
        )
        const prices = [0.99, 7.99, 5.60]
        products.forEach((value, index) => {
          loadedProducts[value] = {
            identifier: value,
            price: prices[index],
            currencySymbol: '$',
            currencyCode: 'USD',
            priceString: '$' + prices[index],
            downloadable: false,
            description: 'Description for ' + value,
            title: 'Title for ' + value
          }
        })
      } else {
        products.forEach(value => {
          loadedProducts[value.identifier] = value
        })
      }
      this.setState({
        loadedProducts,
        isLoading: false,
        isRestoring: true,
      })
      InAppUtils.restorePurchases((error, products) => {
        if (this._isUnmounted) {
          return
        }
        if (error) {
          AlertIOS.alert(
            'In-App Purchases',
            'Could not connect to iTunes store to restore your purchases.'
          )
          this.setState({
            isRestoring: false,
          })
        } else {
          this.setState({
            purchasedProducts: products,
            isRestoring: false,
          })
        }
      })
    })
  }

  componentWillUnmount() {
    this._isUnmounted = true
  }

  _handlePurchaseComplete({ productIdentifier }) {
    const { loadedProducts, purchasedProducts } = this.state
    const product = loadedProducts && loadedProducts[productIdentifier]
    if (product) {
      const purchasedProducts = purchasedProducts || []
      const newPurchasedProducts = purchasedProducts.concat([ product ])
      this.setState({
        purchasedProducts: newPurchasedProducts,
      })
    }
  }

    //const mutation = new PurchaseProductMutation({
    //  productID: productIdentifier,
    //  transactionID: transactionIdentifier,
    //})
    //Relay.Store.commitUpate(mutation, {
    //  onSuccess: () => {
    //    AlertIOS.alert(
    //      'Purchase Complete',
    //      'Thank you.'
    //    )
    //    navigator.pop()
    //  },
    //  onFailure: () => {
    //    AlertIOS.alert(
    //      'In-App Purchases',
    //      'Failed to register your purchase. Please contact Application Developer.'
    //    )
    //  }
    //})

  _handlePurchase(productID) {
    const { loadedProducts } = this.state
    if (Object.keys(loadedProducts).length > 0) {
      this.setState({
        isPurchasing: true,
      })
      InAppUtils.purchaseProduct(productID, (error, response) => {
        this.setState({
          isPurchasing: false,
        })
        if (error) {
          if (error.code !== 'ESKERRORDOMAIN2') { // SKErrorPaymentCancelled
            AlertIOS.alert(
              'In-App Purchases',
              'Failed to purchase item. Please contact Application Developer. ' +
              'Code: ' + error.code
            )
          }
          return
        }
        this._handlePurchaseComplete(response);
      })
    }
  }

  renderBuyScreen() {
    const { navigator } = this.props
    const { isPurchasing } = this.state
    return (
      <View style={ styles.container }>
        <Text style={ styles.noteText }>
          Subscribe for the most efficient mentoring
          get more advices, more topic slots,
          premium content, detailed progress state.
        </Text>
        <View style={styles.subscriptionsContainer}>
          <TouchableOpacity
            {...activeOpacityProps}
            style={isPurchasing ? styles.disabledSubscription : styles.subscription}
            disabled={isPurchasing}
            onPress={() => this._handlePurchase(PRODUCT_3_PREMIUM_TOPICS)}
            >
            <View style={styles.subscriptionTitle}>
              <Text style={styles.subscriptionTitleText}>
                3 premium topics
              </Text>
              <Text style={styles.subscriptionTitleNote}>
                incl. this one
              </Text>
            </View>
            <View style={styles.subscriptionPrice}>
              <Text style={styles.subscriptionPriceText}>
                <Text style={styles.subscriptionPriceTextNote}>just</Text>
                <Text>&nbsp;</Text>
                $0.99
                <Text style={[styles.subscriptionPriceTextNote, styles.transparentText]}>/mo</Text>
              </Text>
              <Text style={styles.subscriptionTitleNote}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            {...activeOpacityProps}
            style={isPurchasing ? styles.disabledSubscription : styles.subscription}
            disabled={isPurchasing}
            onPress={() => this._handlePurchase(PRODUCT_FULL_ACCESS_MONTHLY)}
            >
            <View style={styles.subscriptionTitle}>
              <Text style={styles.subscriptionTitleText}>
                Full access
              </Text>
              <Text style={styles.subscriptionTitleNote}>
                (billed monthly)
              </Text>
            </View>
            <View style={styles.subscriptionPrice}>
              <Text style={styles.subscriptionPriceText}>
                $7.99
                <Text style={styles.subscriptionPriceTextNote}>/mo</Text>
              </Text>
              <Text style={styles.subscriptionTitleNote}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            {...activeOpacityProps}
            style={isPurchasing ? styles.disabledSubscription : styles.subscription}
            disabled={isPurchasing}
            onPress={() => this._handlePurchase(PRODUCT_FULL_ACCESS_YEARLY)}
            >
            <View style={styles.subscriptionTitle}>
              <Text style={styles.subscriptionTitleText}>
                Full access
              </Text>
              <Text style={styles.subscriptionTitleNote}>
                (billed annually*)
              </Text>
            </View>
            <View style={styles.subscriptionPrice}>
              <Text style={[styles.subscriptionPriceText, styles.subscriptionDisabledText]}>
                $7.99
              </Text>
              <Text style={styles.subscriptionTitleNote}/>
              <View style={styles.deleted}/>
            </View>
            <View style={styles.subscriptionPrice}>
              <Text style={styles.subscriptionPriceText}>
                $5.60
                <Text style={styles.subscriptionPriceTextNote}>/mo</Text>
              </Text>
              <Text style={styles.subscriptionTitleNote}/>
            </View>
          </TouchableOpacity>

          <View style={styles.subscriptionsFootnote}>
            <Text style={styles.subscriptionsFootnoteText}>
              * 30% off! That's mentoring for just 18 cents
            </Text>
            <Text style={styles.subscriptionsFootnoteText}>
              a day or the price of 1 coffee in 3 weeks
            </Text>
          </View>
        </View>

        <TouchableOpacity
          {...activeOpacityProps}
          style={styles.denyControl}
          onPress={() => navigator.pop()}
          >
          <Text style={styles.denyControlText}>
            Sorry, not now
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderYourPlan() {
    const { purchasedProducts } = this.state
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.yourPlanHeader}>{`Your plan`}</Text>
          {purchasedProducts && purchasedProducts.map((product, index) => (
            <Text key={index} style={styles.yourPlanProduct}>
              {product.title}
            </Text>
          ))}
        </View>
      </View>
    )
  }

  render() {
    const { isLoading, isRestoring, purchasedProducts } = this.state
    if (isLoading || isRestoring) {
      return (
        <Loader />
      )
    }
    const hasPurchasedProducts = purchasedProducts && (purchasedProducts.length > 0)
    return (
      <ScrollView>
        {hasPurchasedProducts ?
          this.renderYourPlan() :
          this.renderBuyScreen()
        }
      </ScrollView>
    )
  }
}

