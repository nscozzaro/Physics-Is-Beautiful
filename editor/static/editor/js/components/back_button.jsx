import React from 'react'

import { FaChevronLeft } from 'react-icons/fa'

import { history } from '../history'
import {DragHoverable, DragItemTypes} from '../dnd'

export class BackButton extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleDragHover = this.handleDragHover.bind(this)
  }
  handleClick (e) {
    e.preventDefault()
    history.push(this.props.link)
  }
  handleDragHover (e) {
    history.push(this.props.link)
  }
  render () {
    return (
      <DragHoverable onDragHover={this.handleDragHover} itemType={DragItemTypes.LESSON}>
        <a href={history.createHref({pathname: this.props.link})} onClick={this.handleClick} className='btn btn-light btn-back'>
          {/*<span className='glyphicon glyphicon-chevron-left' />*/}
          <FaChevronLeft size={'2rem'} />
        </a>

      </DragHoverable>
    )
  }
}
