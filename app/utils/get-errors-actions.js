/**
 *
 * @param transaction
 * @returns {*}
 */
export function getErrors (transaction) {
  let error = transaction.getError();
  let currentError = '';
  if ( error._bodyText ) {
    let { errors } = JSON.parse(error._bodyText);
    let showError = errors[ 0 ].message;
    currentError =  showError;
  }

  if ( error.source ) {
    currentError = error.source;
  } else {
    currentError = error;
  }

  console.log(currentError , 'error transaction');
  return currentError;
}
