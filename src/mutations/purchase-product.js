import Relay from 'react-relay'

export default class PurchaseProductMutation extends Relay.Mutation {
  getMutation () {
    return Relay.QL`mutation { purchaseProduct }`
  }

  getVariables () {
    const { productID, transactionID } = this.props;
    return { productID, transactionID };
  }
}

