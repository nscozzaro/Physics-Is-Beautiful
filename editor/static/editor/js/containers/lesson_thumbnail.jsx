import React from 'react';
import { connect } from 'react-redux'

import { history } from '../history';

import {renameLesson, changeLessonImage} from '../actions';

import {LessonThumbnail} from '../components/lesson_thumbnail';

const mapStateToProps = (state, ownProps) => {
  var les = state.lessons[ownProps.uuid];
  return {
    name : les.name,
    image : les.image,
//    onClick : () => { history.push('/lessons/'+ownProps.uuid+'/') }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onNameChange : newName => dispatch(renameLesson(ownProps.uuid, newName)),
    onImageChange : newImage => dispatch(changeLessonImage(ownProps.uuid, newImage)),
  }
}

 
export const LessonThumbnailContainer = connect(
  mapStateToProps, mapDispatchToProps)(LessonThumbnail);
