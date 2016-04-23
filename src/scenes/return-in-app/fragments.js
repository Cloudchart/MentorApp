import Relay from 'react-relay';


const reactionFragment = Relay.QL`
    fragment on BotReaction {
        id
        mood
        content
    }
`;

var answerFragment = Relay.QL`
    fragment on Answer {
        id
        content
        position
        reaction {
            ${reactionFragment}        
        }
    }
`;

var questionFragment = Relay.QL`
    fragment on Question {
        id
        content
        reaction {
            ${reactionFragment}
        }
        answers(first: 10) {
            edges {
                node {
                    ${answerFragment}
                }
            }
        }

    }
`;

var insightFragment = Relay.QL`
    fragment on Insight {
        id
        content
        origin {
            author
            url
            title
            duration
        }
    }
`;

export const fragments = Relay.QL`
    fragment on  User {
        reactions(first: 1, scope: "greetings") {
            edges {
                node {
                    ${reactionFragment}
                }
            }
        }
        questions(first: 1) {
            edges {
                node {
                    ${questionFragment}
                }
            }
        }
        insights(first : $countInsights, filter: FOLLOWUPS) {
            edges {
                node {
                    ${insightFragment}
                }
            }
        }
    }
`;

