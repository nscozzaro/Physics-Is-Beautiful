import React, { useEffect, useRef } from 'react'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Edit from '@material-ui/icons/Edit'
import Slideshow from '@material-ui/icons/Slideshow'

import { FaTimes, FaPlusCircle } from 'react-icons/fa'

import {
  renameLesson,
  changeLessonImage,
  loadLessonIfNeeded,
  deleteLesson,
  addMaterial,
  moveMaterial,
  updateMaterialImage
} from '../../../../../actions/studio'

import {
  updateProblemTypeImage
} from '../../../../../actions/problemType'

import { DockableDropTarget, DragItemTypes } from '../../../../../dnd'

import { EditableThumbnail } from '../../../../../components/thumbnail'
import { EditableLabel } from '../../../../../components/label'

import MaterialThumbnail from './MaterialThumbnail'
// import MaterialContainer from '../../containers/material'

import ToolBar from './Menu/ToolBar'
import WorkspaceMenu from './Menu/Menu'

import Search from './Codesandbox/Search/index'
import asyncEditor from './Codesandbox/Editor/index'

import { StyledIframe } from './Styles'

import {
  useCurrentMaterialHasType, useMaterialTypePropIsInMaterial, useHandleMaterialDroppedBefore
} from './Hooks/materials'
import { useHandleDeleteLessonClick } from './Hooks/lesson'
import { useLayoutMode } from './Hooks/menu'
import { useIframeLoaded } from './Hooks/eval'

const Lesson = props => {
  const {
    // lesson data + actions
    uuid, name, image, loading, loadLessonIfNeeded, onImageChange, onDeleteClick,
    onNameChange,
    // materials
    materials, materialUrlUuid, moveMaterial, currentMaterial, onAddMaterialClick,
    onUpdateMaterialImage,
    // material problem type
    onUpdateProblemTypeImage
  } = props

  // eval iframe
  let executionFrameRef = useRef(null)
  const onLoadIframe = useIframeLoaded() // TODO move setFrameRef to Hook
  const setFrameRef = node =>
    (executionFrameRef =
        ((!node || !node.contentWindow) && null) ||
         node // we want a reference to an iframe
    )

  // materials
  const currentMaterialHasType = useCurrentMaterialHasType(currentMaterial)
  const materialTypePropIsInMaterial = useMaterialTypePropIsInMaterial(currentMaterial)

  // lesson
  let handleDeleteLessonClick = (e) => { useHandleDeleteLessonClick(e, onDeleteClick, name) }

  // menu
  const [layoutMode, setLayoutMode] = useLayoutMode('present')

  // fixme: decompose into multiple state variables based on which values tend to change together.
  const [state, setState] = React.useState({
    editor: <div></div>
  })

  useEffect(() => {
    // async load editor after Lesson component did mount
    async function asyncEditorStartUp () {
      let editor = await asyncEditor()
      setState({ ...state, editor: editor })
    }
    asyncEditorStartUp()
  }, [])

  useEffect(() => {
    console.log(materialUrlUuid);
    loadLessonIfNeeded(materialUrlUuid)
  }, [materialUrlUuid])

  // materials list
  let navMaterials = []

  if (materials) {
    navMaterials = materials.map((materialUuid) => {
      return (
        <Grid item alignContent={'center'}>
          <DockableDropTarget
            key={materialUuid}
            onDrop={dropSource =>
              useHandleMaterialDroppedBefore(dropSource.uuid, materialUuid, moveMaterial)
            }
            itemType={DragItemTypes.MATERIAL}
            selfUuid={materialUuid}
          >
            <MaterialThumbnail
              key={materialUuid}
              uuid={materialUuid}
              lessonUuid={uuid}
              selected={
                currentMaterial &&
                  currentMaterial.uuid === materialUuid
              }
            />
          </DockableDropTarget>
        </Grid>
      )
    })
  }

  const onMenuLayoutChange = (e, menuId) => {
    // main menu click
    if (menuId === 'view.present') { setLayoutMode('present') }
    if (menuId === 'view.edit') { setLayoutMode('edit') }
  }

  // TODO make it reusable
  const mptEvalUrl = (mpt) => {
    if (mpt && mpt.hasOwnProperty('id')) {
      // TODO add material id to work with data
      return `${window.location.origin}/evaluation/${mpt.id}/`
    } else { return '' }
  }

  // render component
  if (loading) {
    return <div>Loading...</div>
  }

  const addMaterialButton = (
    <Grid item>
      <DockableDropTarget
        onDrop={dropSource =>
          useHandleMaterialDroppedBefore(dropSource.uuid, null, moveMaterial)
        }
        itemType={DragItemTypes.MATERIAL}
      >
        <Paper elevation={3} className={'material-thumbnail draggable'}>
          <div
            onClick={onAddMaterialClick}
            // className='btn btn-light btn-add'
          >
            <FaPlusCircle />
            <br />
          Add material
          </div>
        </Paper>
      </DockableDropTarget>
    </Grid>
  )

  const editorComponent = state.editor

  return (
    <Grid container>
      <Grid container item xs={12}>
        <Grid item xs={1}>
          <EditableThumbnail
            image={image}
            onChange={onImageChange}
          />
        </Grid>
        <Grid item xs={8}>
          <div>
            <h1>
              <EditableLabel
                value={name}
                onChange={onNameChange}
                defaultValue='New lesson'
              />
              <FaTimes onClick={handleDeleteLessonClick} />
            </h1>
          </div>
          <div>
            <WorkspaceMenu onChange={onMenuLayoutChange} />
          </div>
        </Grid>
        <Grid item xs={3}>
          <FormControl variant='outlined'>
            <Select
              value={layoutMode}
              onChange={e => { setLayoutMode(e.target.value) }}
            >
              <MenuItem value={'present'}>
                <Slideshow /> Present
              </MenuItem>
              <MenuItem value={'edit'}>
                <Edit /> Edit mode
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          borderTop: '1px solid #dadce0',
          borderBottom: '1px solid #dadce0'
        }}
      >
        <ToolBar />
      </Grid>
      {/* Present mode on */}
      <Grid container item xs={12} spacing={4}>
        {/* Materials list */}
        {layoutMode === 'present' ? (
          <Grid item xs={2}>
            <Grid
              container
              direction='column'
              justify='center'
              alignItems='stretch'
              spacing={3}
              className={'lesson-nav-materials'}
              style={{paddingTop: '1rem'}}
            >
              {addMaterialButton}
              {navMaterials}
            </Grid>
          </Grid>
        ) : null}
        <Grid item xs={layoutMode === 'present' ? 10 : 12}>
          {/* Search if sanbox does not exist in curent Material */}
          {!loading && // loading lesson
          materialTypePropIsInMaterial && // loading material
          !currentMaterialHasType ? ( //
              <Search />
            ) : null}
          {/* Present Mode */}
          <div
            style={{
              display:
                layoutMode === 'present' &&
                materialTypePropIsInMaterial &&
                currentMaterialHasType
                  ? 'flex'
                  : 'none', // display only if material problem type is set
              height: '100vh'
            }}
          >
            {currentMaterialHasType &&
             <StyledIframe
               ref={setFrameRef}
               onLoad={e => onLoadIframe(e,
                 currentMaterial.material_problem_type,
                 currentMaterial,
                 onUpdateProblemTypeImage,
                 onUpdateMaterialImage,
                 executionFrameRef
               )}
               src={mptEvalUrl(currentMaterial.material_problem_type)}/>
            }
          </div>
          {/* Editor Mode */}
          <div
            style={{
              display:
                layoutMode !== 'present' &&
                materialTypePropIsInMaterial &&
                currentMaterialHasType
                  ? 'flex'
                  : 'none', // display only if material problem type is set
              height: '100vh'
            }}
          >
            {editorComponent}
          </div>
        </Grid>
      </Grid>
    </Grid>
  )
}

Lesson.propTypes = {
  uuid: PropTypes.string.isRequired,
  currentMaterial: PropTypes.object,
  materialUrlUuid: PropTypes.string,
  loadLessonIfNeeded: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onAddMaterialClick: PropTypes.func.isRequired,
  moveMaterial: PropTypes.func.isRequired,
  onUpdateProblemTypeImage: PropTypes.func.isRequired,
  onUpdateMaterialImage: PropTypes.func.isRequired,
  image: PropTypes.string,
  name: PropTypes.string,
  materials: PropTypes.array,
  loading: PropTypes.bool // this is lesson loading mark
}

const mapStateToProps = (state, ownProps) => {
  const uuid = ownProps.uuid || ownProps.match.params.uuid
  let materialUuid = null

  if (ownProps.match.params.hasOwnProperty('material_uuid')) {
    materialUuid = ownProps.match.params.material_uuid
  }

  const lesson = state.studio.lessons[uuid]
  if (lesson) {
    // let previousMaterial, nextMaterial
    const currentMaterial = state.studio.currentMaterial

    // set material nexp/prev buttons
    // if (currentMaterial && lesson.materials) {
    //   const idx = lesson.materials.indexOf(currentMaterial.uuid)
    //   if (idx > 0) {
    //     previousMaterial = lesson.materials[idx - 1]
    //   }
    //   if (idx < lesson.materials.length - 1) {
    //     nextMaterial = lesson.materials[idx + 1]
    //   }
    // }

    return {
      uuid: uuid,
      materialUrlUuid: materialUuid,
      loading: false,
      name: lesson.name,
      image: lesson.image,
      module: lesson.module, // fixme do we need this?
      materials: lesson.materials, // this is uuids list
      materialsDict: state.studio.materials, // this is {'uuid': obj} dict with all materials ever loaded o_0
      // previousMaterial: previousMaterial,
      // nextMaterial: nextMaterial,
      currentMaterial: currentMaterial
    }
  } else {
    return {
      uuid: uuid,
      materialUrlUuid: materialUuid,
      loading: true
    }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const uuid = ownProps.uuid || ownProps.match.params.uuid
  return {
    onUpdateProblemTypeImage: (canvas, pt) =>
      dispatch(updateProblemTypeImage(pt, canvas)),
    onUpdateMaterialImage: (canvas, material) =>
      dispatch(updateMaterialImage(material, canvas)),
    onImageChange: image => dispatch(changeLessonImage(uuid, image)),
    onNameChange: name => dispatch(renameLesson(uuid, name)),
    onDeleteClick: () => dispatch(deleteLesson(uuid)),
    loadLessonIfNeeded: materialUuid =>
      dispatch(loadLessonIfNeeded(uuid, materialUuid)),
    onAddMaterialClick: () => dispatch(addMaterial(uuid)),
    moveMaterial: (materialUuid, materialBeforeUuid) =>
      dispatch(moveMaterial(materialUuid, materialBeforeUuid))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lesson)
