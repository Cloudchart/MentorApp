import Relay from 'react-relay'

class UpdateUserMutation extends Relay.Mutation {

  getMutation () {
    return Relay.QL`mutation { updateUser }`
  }

  getVariables () {
    const { user } = this.props;
    return {
      email: user.email,
      name: user.name
    }
  }

  getFatQuery () {
    return Relay.QL`
        fragment on UpdateUserPayload {
            user {
                email,
                name
            }
        }
    `
  }

  getConfigs () {
    const { user } = this.props;
    return [ {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: user.id
      }
    } ]
  }

}


export default UpdateUserMutation;

