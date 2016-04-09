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
    Relay.Store.commitUpdate(
      new LikeInsightInTopicMutation({
        insight,
        topic: insight.relationTopic,
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
  })
}

/**
 *
 * @param insight
 * @returns {Promise}
 */
export function dislikeInsightInTopic (insight) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new DislikeInsightInTopicMutation({ insight, topic: insight.relationTopic }), {
        onSuccess: (transaction) => {
          resolve(transaction)
        },
        onFailure: (transaction) => {
          reject(getErrors(transaction))
        }
      }
    );
  })
}

