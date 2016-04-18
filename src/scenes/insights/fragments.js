import Relay from 'react-relay';


const originFragment = Relay.QL`
    fragment on InsightOrigin {
        author
        url
        title
        duration
    }
`;

const reactionFragment = Relay.QL`
    fragment on BotReaction {
        id
        mood
        content
    }
`;

const insightFragment = Relay.QL`
    fragment on Insight {
        id
        content
        origin {
            ${originFragment}
        }
        likeReaction {
            ${reactionFragment} 
        }
        dislikeReaction {
            ${reactionFragment} 
        }
    }
`;

const topicFragment = Relay.QL`
    fragment on  Topic {
        id
        name
        isDefault
        isPaid
        isSubscribedByViewer
        insights (first: 1) {
            ratedCount
            unratedCount
        }
    }
`;


export const nodeQueryTopic = Relay.QL`
    fragment on Topic {
        id
        name
        isSubscribedByViewer
        isPaid
        insights (first: $countInsights, filter : $filter) {
            edges {
                node {
                    ${insightFragment}
                }
            }
        }
    }
`;


export const collectionInsightFragment = Relay.QL`
    fragment on  User {
        insights(first: $countInsights, filter: $filterInsights ) {
            edges {
                node {
                    ${insightFragment}
                }
                topic {
                    ${topicFragment}
                }
            }
        }
        collections(first: $countInsights) {
            edges {
                node {
                    insights(first : $countInsights, filter : $filterInsightsInCollection) {
                        count
                        edges {
                            node {
                                id
                            }
                        }
                    }
                }
            }
        }
    }
`;

