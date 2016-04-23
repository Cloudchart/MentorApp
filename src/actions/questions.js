import Relay from 'react-relay';
import { getErrors } from '../utils/get-errors-actions';
import { AnswerTheQuestionMutation } from '../mutations';

/**
 *
 * @param insight
 * @returns {Promise}
 */
export function answerTheQuestion (data) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new AnswerTheQuestionMutation(data), {
        onSuccess: (transact) => {
          resolve(transact)
        },
        onFailure: (transact) => {
          reject(getErrors(transact))
        }
      }
    )

    transaction.commit();
  })
}
