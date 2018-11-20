import React from 'react'
import PropTypes from 'prop-types'

import {Row, Col, Grid, Image} from 'react-bootstrap'

export class TeacherStudentCard extends React.Component {
  // Card to show user in classroom students list
  // Card to swon user inside assignment view
  render () {
    var className = 'student-card pointer vcenter'

    return (
      <Grid fluid style={{float: 'left', padding: '0'}}>
        <Row className={className} onClick={() => this.props.onStudentClick()}>
          <Col sm={2} md={2}>
            {this.props.student.avatar_url
              ? <Image
                responsive
                src={this.props.student.avatar_url}
                circle />
              : null}
          </Col>
          <Col sm={4} md={4}>
            <span className={'title'}>{this.props.student.display_name}</span>
          </Col>
          <Col sm={6} md={6}>
            <div className={'gray-text'}>
              <span className={'green-completed-box'}>
                <span title={'Completed'} className='glyphicon glyphicon-ok' />&nbsp;{this.props.student.counts.num_completed_assignments}
              </span>
              <span className={'yellow-delayed-box'}>
                <span title={'Completed late'} className='glyphicon glyphicon-time' />&nbsp;{this.props.student.counts.num_delayed_assignments}
              </span>
              <span className={'red-missed-box'}>
                <span title={'Missed'} className='glyphicon glyphicon-remove' />&nbsp;{this.props.student.counts.num_missed_assignments}
              </span>
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

TeacherStudentCard.propTypes = {
  student: PropTypes.object,
  onStudentClick: PropTypes.func.isRequired
}
