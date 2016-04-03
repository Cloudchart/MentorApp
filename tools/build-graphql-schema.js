const introspectionQuery = require('graphql/utilities').introspectionQuery;
const request = require('sync-request');
const fs = require('fs');
const path = require('path');
const packageInfo = require('../package.json');

const endpointURL = packageInfo['graphql-endpoint'];
console.log('%s Submit request to [%s]...', (new Date()).toISOString(), endpointURL);
const response = request('POST', endpointURL, {
  'qs': {
    'query': introspectionQuery
  }
});

const schema = response.body.toString('utf-8');
console.log('%s Introspection Schema is received successfully.', (new Date()).toISOString());

try {
  fs.mkdirSync(path.join(__dirname, '..', 'data'));
} catch (e) {
  // nothing
}

const filename = path.join(__dirname, '..', 'data', 'schema.json');
fs.writeFileSync(filename, schema, 'utf8');
console.log('%s Saved to [%s].', (new Date()).toISOString(), filename);
