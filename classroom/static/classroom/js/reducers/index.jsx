import { combineReducers } from 'redux'

import dataReducer from './data'
import tabReducer from './tab'
import classroomReducer from './classroom'
import curriculaReducer from './curricula'
import assignmentReducer from './assignment'
import studentReducer from './student'

export default combineReducers({
  data: dataReducer,
  tab: tabReducer,
  classroom: classroomReducer,
  curricula: curriculaReducer,
  assignment: assignmentReducer,
  student: studentReducer
})
