import React from 'react'
import PropTypes from 'prop-types'

import { Row, Col, Image} from 'react-bootstrap'

export class TeacherStudentAssignmentRow extends React.Component {
  render () {
    var className = 'student-classroom-row'

    var textColorClassName = 'green-text'

    // var dueDateTime = null
    // var startDateOn = null
    var assingmentDate = null
    var completedOnTime = null

    if (!this.props.assignment.completed_on && !this.props.assignment.delayed_on) {
      if (new Date(this.props.assignment.due_on) < new Date()) {
        textColorClassName = 'red-text'
      } else {
        textColorClassName = 'gray-text'
      }
    } else if (this.props.assignment.delayed_on) {
      textColorClassName = 'yellow-text'
    }

    // dueDateTime = new Date(this.props.assignment.due_on).toLocaleDateString() + ' ' +
    //   new Date(this.props.assignment.due_on).toLocaleTimeString()

    if (this.props.assignment.assigned_on) {
      assingmentDate = new Date(this.props.assignment.assigned_on).toLocaleDateString() + ' ' +
        new Date(this.props.assignment.assigned_on).toLocaleTimeString()
    }
    if (this.props.assignment.completed_on) {
      completedOnTime = new Date(this.props.assignment.completed_on).toLocaleDateString() + ' ' +
        new Date(this.props.assignment.completed_on).toLocaleTimeString()
    }
    // if (this.props.assignment.start_on) {
    //   startDateOn = new Date(this.props.assignment.start_on).toLocaleDateString() + ' ' +
    //     new Date(this.props.assignment.start_on).toLocaleTimeString()
    // }


    // console.log(this.props.assignment);

    return (
      <Row className={className}>
        <Col sm={1} md={1}>
          <div className={'gray-text small-text'}>
          {/*image*/}
          </div>
        </Col>
        <Col sm={5} md={5}>
          { !this.props.isTeacher && textColorClassName !== 'gray-text' // TODO check start date
            ? <div className={'blue-title'}>{this.props.assignment.name}</div>
            : <div className={'blue-title pointer'} onClick={this.props.onTitleClick}>{this.props.assignment.name}</div>
          }
          <div className={'gray-text small-text'}>{this.props.assignment.count_lessons} lesson{this.props.assignment.count_lessons > 1 ? 's' : null}</div>
        </Col>
        <Col sm={2} md={2} className={'vcenter'}>
          { assingmentDate ? <div> { assingmentDate } </div> : null }
        </Col>
        <Col sm={2} md={2} className={'vcenter'}>
          { this.props.assignment.completed_on && new Date(this.props.assignment.due_on) > new Date(this.props.assignment.completed_on)
            ? <div className={textColorClassName}>
              <span className={'green-completed-box'}>
                <span className='glyphicon glyphicon-ok-sign' style={{color: 'green'}} />&nbsp;Completed
              </span>
            </div> : null }
          { this.props.assignment.delayed_on
            ? <div className={textColorClassName}>
              <span className={'yellow-delayed-box'}>
                <span className='glyphicon glyphicon-time yellow-text' />&nbsp;Completed late
              </span>
            </div> : null }
          { !this.props.assignment.completed_on && new Date(this.props.assignment.due_on) < new Date()
            ? <div className={textColorClassName}>
              <span className={'red-missed-box'}>
                <span className='glyphicon glyphicon-remove' style={{color: 'red'}} />&nbsp;Missed
              </span>
            </div> : null }
          { !this.props.assignment.completed_on && new Date(this.props.assignment.due_on) > new Date()
            ? <span>{this.props.assignment.assigned_on ? <span>Started</span> : <span>Not started</span>}</span> : null}
        </Col>
        <Col sm={2} md={2} className={'vcenter'}>
          { completedOnTime ? <div> { completedOnTime } </div> : null }
        </Col>
      </Row>
    )
  }
}

TeacherStudentAssignmentRow.propTypes = {
  assignment: PropTypes.object.isRequired,
  onTitleClick: PropTypes.func,
  isTeacher: PropTypes.bool.isRequired
}
