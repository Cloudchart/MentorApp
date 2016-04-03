const BabelRelayPlugin = require('babel-relay-plugin')
const Schema = require('../data/schema.json')

module.exports = BabelRelayPlugin(Schema['data'])
