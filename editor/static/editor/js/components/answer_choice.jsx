import React from 'react'

import PropTypes from 'prop-types'
import { FaTimes, FaTrashAlt } from 'react-icons/fa'

import {EditableThumbnail} from './thumbnail'
import {EditableLabel} from './label'

import Card from 'react-bootstrap/Card'

export class AnswerChoice extends React.Component {
  constructor (props) {
    super(props)
    this.onHoverToggle = this.onHoverToggle.bind(this)
    this.onDeleteChoiceClick = this.onDeleteChoiceClick.bind(this)
    this.state = {
      hover: false
    }
  }

  onHoverToggle (e) {
    // state for hover and show delete button + img
    this.setState({hover: !this.state.hover})
  }

  onDeleteChoiceClick (e) {
  }

  render () {
    var thumb = <EditableThumbnail
      image={this.props.image}
      onChange={this.props.onImageChange}
      asFragment={Boolean(true)}
      iconWidth = '3rem'
    />
    // <input id="radioz2frwygcXwhAg7d5nGmpNC" name="radio" type="radio" value="6" style="visibility: hidden;">

    var selectionControl = <input
      id={this.props.uuid}
      type={this.props.exclusive ? 'radio' : 'checkbox'}
      onChange={this.props.onSelectChange}
      value={this.props.text}
      checked={this.props.is_correct}/>
    var label = <EditableLabel value={this.props.text} defaultValue='New answer' onChange={this.props.onTextChange}/>
    // TODO we have no deleteClick function
    var deleteImgIcon = <FaTimes onClick={this.onDeleteImgClick} />

    // if (this.props.withThumbnail) {
    //   return (
    //     <div className='answer-choice editor-col-md-1 module-accessible-block with-image'>
    //       <div className='thumbnail'>{thumb}</div>
    //       <div>
    //         {selectionControl} {label} {deleteIcon}
    //       </div>
    //     </div>)
    // } else {
    //   return (
    //     <div className='answer-choice answer-button without-image'>
    //       {selectionControl} {label} {thumb} {deleteIcon}
    //     </div>)
    // }

    var indexStyle = {position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)'}

    if (this.props.withThumbnail) {
      return (<Card style={{ width: '13rem', boxShadow: '0 0 10px #bbb' }} className={'mx-2 mb-3'}>
        <Card.Body>
          <div className='thumbnail'>{thumb}</div>
          {selectionControl}
          {label}
          {deleteImgIcon}
        </Card.Body>
      </Card>
      )
    } else {
      return (
        // answer-choice without-image
        <div
          className='answer-button pure-radiobutton'
          onMouseEnter={this.onHoverToggle}
          onMouseLeave={this.onHoverToggle}>
          <span style={indexStyle}>
            {this.state.hover
              ? <FaTrashAlt onClick={this.onDeleteChoiceClick} />
              : this.props.index}
          </span>
          {/* thumb pull right + hover */}
          {/* {selectionControl} {label} {thumb} {deleteImgIcon} */}
          {selectionControl}
          <label
            style={{marginBottom: '0.025rem', paddingRight: this.state.hover ? '10%' : '5px'}}
            htmlFor={this.props.uuid}>
            {label}
          </label>
          {this.state.hover &&
          <span
            style={{position: 'absolute', top: '50%', right: '0%', transform: 'translate(-50%,-50%)'}}
            className={'selectable-image'}>{thumb}
          </span> }
        </div>)
    }
  }
}

AnswerChoice.propTypes = {
  index: PropTypes.number,
  onSelectChange: PropTypes.func,
  onImageChange: PropTypes.func,
  onTextChange: PropTypes.func,
  is_correct: PropTypes.bool,
  exclusive: PropTypes.bool,
  withThumbnail: PropTypes.bool,
  uuid: PropTypes.string,
  text: PropTypes.string,
  image: PropTypes.string
}
