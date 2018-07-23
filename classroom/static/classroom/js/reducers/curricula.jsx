import { CURRICULA_RECEIVE_CURRICULA_LIST, CURRICULA_RECEIVE_OTHER_CURRICULA_LIST } from '../constants'

const initialState = {
  curriculaList: null,
  curriculaOtherList: null
}

export default function curriculaReducer (state = initialState, action) {
  switch (action.type) {
    case CURRICULA_RECEIVE_CURRICULA_LIST:
      return Object.assign({}, state, {
        curriculaList: action.payload.curriculaList
      })
    case CURRICULA_RECEIVE_OTHER_CURRICULA_LIST:
      return Object.assign({}, state, {
        curriculaOtherList: action.payload.curriculaOtherList
      })
    default:
      return state
  }
}
