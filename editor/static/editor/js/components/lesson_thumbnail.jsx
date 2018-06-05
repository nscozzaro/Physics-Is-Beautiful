import React from 'react';

import {Thumbnail} from './thumbnail';

import { DragSource } from 'react-dnd';

import {DragItemTypes} from '../dnd';

export const lessonDragSource = {
  beginDrag(props) {
    return {uuid:props.uuid};
  }
}


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview : connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}


class LessonThumbnail extends React.Component {
  render() {
    return this.props.connectDragPreview(
      <div className="col-md-1 module-accessible-block" onClick={this.props.onClick}>
        {this.props.connectDragSource(<span className="drag-handle glyphicon glyphicon-option-vertical"/>)}
        <div className="thumbnail section-thumbnail"><Thumbnail image={this.props.image}/></div>
        <div>{this.props.name}</div>
      </div>)    
  }
}

LessonThumbnail = DragSource(DragItemTypes.LESSON, lessonDragSource, collect)(LessonThumbnail)

export {LessonThumbnail}
