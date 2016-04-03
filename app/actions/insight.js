import Relay from 'react-relay';
import {
  LikeInsightInTopicMutation,
  DislikeInsightInTopicMutation
} from "../mutations";

/**
 *
 * @param insight
 * @returns {Promise}
 */
export function likeInsightInTopic (insight) {
  return new Promise((resolve, reject)=> {
    Relay.Store.commitUpdate(
      new LikeInsightInTopicMutation({ insight, topic: insight.relationTopic }), {
        onSuccess: (transaction) => {
          console.log('LikeInsightInTopicMutation', transaction);
          resolve(transaction)
        },
        onFailure: (transaction) => {
          let error = transaction.getError()
          reject(error.source)
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
          console.log('DislikeInsightInTopicMutation', transaction);
          resolve(transaction)
        },
        onFailure: (transaction) => {
          let error = transaction.getError()
          reject(error.source)
        }
      }
    );
  })
}

