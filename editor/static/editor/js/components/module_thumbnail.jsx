import React from 'react';

import {Thumbnail} from './thumbnail'
import { DragSource } from 'react-dnd';

import {DragItemTypes} from '../dnd';

export const moduleDragSource = {
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


class ModuleThumbnail extends React.Component {
  render () {
    const { connectDragSource, connectDragPreview, isDragging, connectDropTarget } = this.props;
    return connectDropTarget(connectDragPreview(
      <div className="col-md-1 module-accessible-block" onClick={this.props.onClick} style={{opacity:isDragging?0.5:1}}>
        {connectDragSource(<span className="drag-handle glyphicon glyphicon-option-vertical"/>)}
        <div className="thumbnail section-thumbnail"><Thumbnail image={this.props.image}/></div>
        <div>{this.props.name}</div>
      </div>
    ))
  } 
}
ModuleThumbnail = DragSource(DragItemTypes.MODULE, moduleDragSource, collect)(ModuleThumbnail);
export {ModuleThumbnail};
