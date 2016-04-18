import Relay from 'react-relay'

class AnswerTheQuestionMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { answerTheQuestion }`
  }

  getVariables () {
    const { questionID, answerID } = this.props;
    return { questionID, answerID };
  }

  getFatQuery () {
    return Relay.QL`
        fragment on AnswerTheQuestionPayload {
            question
            answerEdge
        }
    `
  }

  getConfigs () {
    const { questionID, answerID } = this.props;
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          question: questionID
        }
      }
    ]
  }
}

export default AnswerTheQuestionMutation;

