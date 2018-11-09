import React from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

import { history } from '../../history'

import { Row, Col, Image, Dropdown, Glyphicon, MenuItem } from 'react-bootstrap'

import copy from 'copy-to-clipboard'

import { Thumbnail } from './../thumbnail'

import { store } from '../../app'

class QuestionMenuToggle extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    e.preventDefault()
    this.props.onClick(e)
  }

  render () {
    return (
      <Glyphicon glyph={'option-vertical'} onClick={this.handleClick} style={{fontSize: '2rem'}}>
        {this.props.children}
      </Glyphicon>
    )
  }
}

export class QuestionThumbnailPublic extends React.Component {
  constructor (props, context) {
    super(props, context)
    // this.onTitleClick = this.onTitleClick.bind(this)
    // this.onLearnSelect = this.onLearnSelect.bind(this)
    this.onForkSelect = this.onForkSelect.bind(this)
    // this.onCopyShareableLink = this.onCopyShareableLink.bind(this)
  }

  // onLearnSelect () {
  //   window.open('/curriculum/questions/' + this.props.question.uuid + '/', '_blank')
  // }
  //
  // onTitleClick () {
  //   window.open('/curriculum/questions/' + this.props.question.uuid + '/', '_blank')
  // }

  // onCopyShareableLink (e) {
  //   copy(window.location.origin + '/curriculum/question/' + this.props.question.uuid + '/')
  // }

  onForkSelect (e) {
    // store.dispatch(addQuestion(this.props.question.uuid))
  }

  render () {
    return (
      <Col
        sm={2}
        md={2}
        className={'curriculum-card'}
        style={{'cursor': 'pointer'}}>
        <div style={{paddingBottom: '1rem', overflow: 'hidden', borderRadius: '15px'}}>
          <Thumbnail image={this.props.question.image} />
        </div>
        <div>
          <Dropdown
            style={{float: 'right'}}
            id='dropdown-custom-menu'>
            <QuestionMenuToggle bsRole='toggle' />
            {/*<CustomQuestionMenu bsRole='menu'>*/}
            <Dropdown.Menu bsRole='menu' rootCloseEvent={'click'}>
              {/*<MenuItem onSelect={this.onLearnSelect} eventKey='1'><Glyphicon glyph='education' /> Learn</MenuItem>*/}
              <MenuItem onSelect={this.onForkSelect} eventKey='3'><Glyphicon glyph='export' /> Fork to curriculum studio</MenuItem>
              {/*<MenuItem onSelect={this.onCopyShareableLink} eventKey='4'><Glyphicon glyph='share-alt' /> Copy shareable link</MenuItem>*/}
            </Dropdown.Menu>
            {/*</CustomQuestionMenu>*/}
          </Dropdown>
          <div onClick={this.onTitleClick} className={'blue-text'} style={{fontSize: '2rem'}}>
            {this.props.question.name}
          </div>
          {/*<div style={{fontSize: '1.1rem', paddingTop: '0.5rem', textAlign: 'left', margin: '0 0.5rem 0 0.5rem'}}>*/}
            {/*<a href={this.props.question.author.get_absolute_url} target={'_blank'}>*/}
              {/*{this.props.question.author.display_name}*/}
            {/*</a> ∙ {this.props.question.count_questions } questions ∙ { this.props.question.number_of_learners } learners*/}
          {/*</div>*/}
          <div style={{fontSize: '1.1rem', color: 'gray', textAlign: 'left', margin: '0 0.5rem 0 0.5rem'}}>
            Created <Moment fromNow>
              {this.props.question.created_on}
            </Moment> ∙ Last updated <Moment fromNow>
              {this.props.question.updated_on}
            </Moment>
          </div>
        </div>
      </Col>
    )
  }
}

QuestionThumbnailPublic.propTypes = {
  question: PropTypes.object.isRequired
}
