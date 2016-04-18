import Relay from 'react-relay';
import { getErrors } from '../utils/get-errors-actions';
import {
  LikeInsightInTopicMutation,
  DislikeInsightInTopicMutation
} from "../mutations";

/**
 *
 * @param insight
 * @returns {Promise}
 */
export function likeInsightInTopic (insight, shouldAddToUserCollectionWithTopicName) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new LikeInsightInTopicMutation({
        insight : insight.node,
        topic: insight.topic,
        shouldAddToUserCollectionWithTopicName
      }), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          reject(getErrors(transaction))
        }
      }
    );

    transaction.commit();
  })
}

/**
 *
 * @param insight
 * @returns {Promise}
 */
export function dislikeInsightInTopic (insight) {
  return new Promise((resolve, reject)=> {
    const transaction = Relay.Store.applyUpdate(
      new DislikeInsightInTopicMutation({ insight : insight.node, topic: insight.topic }), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          reject(getErrors(transaction))
        }
      }
    );

    transaction.commit();
  })
}

