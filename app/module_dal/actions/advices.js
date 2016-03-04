import { USER_MARK_ADVICE_NEGATIVE } from "./actions";


export const markPositive = () => dispatch => {

}

export const markNegative = (id) => dispatch => {
  dispatch({ type: USER_MARK_ADVICE_NEGATIVE, id })
}

