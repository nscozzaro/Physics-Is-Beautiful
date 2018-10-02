import React from 'react'
import Moment from 'react-moment'
import ReactCrop from 'react-image-crop'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Clipboard from 'react-clipboard.js'
import { history }from '../../history'
import { Image as ImageBs, Grid, Row, Col, Glyphicon, Tooltip, InputGroup, FormControl, Modal } from 'react-bootstrap'
import { Tabs, TabLink, TabContent } from 'react-tabs-redux'

import { changeCurriculumCoverPhoto, changeCurriculumImage, loadCurriculumIfNeeded, renameCurriculum } from '../../actions'

import { EditableExternalEventLabel } from '../../components/label'

function makeblob (dataURL, filename) {
  var BASE64_MARKER = ';base64,'
  var parts
  var contentType
  var raw
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    parts = dataURL.split(',')
    contentType = parts[0].split(':')[1]
    raw = decodeURIComponent(parts[1])
    return new Blob([raw], { type: contentType })
  }
  parts = dataURL.split(BASE64_MARKER)
  contentType = parts[0].split(':')[1]
  raw = window.atob(parts[1])
  var rawLength = raw.length

  var uInt8Array = new Uint8Array(rawLength)

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  var blobdata = new Blob([uInt8Array], { type: contentType })

  blobdata.filename = filename

  return  blobdata
}

/**
 * @param {File} image - Image File Object
 * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
 */
function getCroppedImg (image, pixelCrop) {
  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // As Base64 string
  const base64Image = canvas.toDataURL('image/jpeg');
  return base64Image
}

class PencilImageUpload extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e) {
    this.props.onFileSelect(e.target.files[0])
  }

  render () {
    return <div className={'selectable-image'} style={{height: '100%'}}>
      <Glyphicon
        glyph={'pencil'}
        // onClick={this.imageUpload}
        style={{fontSize: '2rem', top: '1rem'}} />
      <input
        type='file' name='image' accept='image/*'
        onChange={this.handleChange}
        style={{fontSize: '0px'}} />
    </div>
  }
}

class EditCurriculumProfileView extends React.Component {
  constructor (props) {
    super(props)

    this.handleSelectTab = this.handleSelectTab.bind(this)
    this.startCurriculum = this.startCurriculum.bind(this)
    this.imageUpload = this.imageUpload.bind(this)
    this.coverPhotoSelected = this.coverPhotoSelected.bind(this)
    this.editNameClick = this.editNameClick.bind(this)
    this.onNameChanged = this.onNameChanged.bind(this)
    this.onCropChange = this.onCropChange.bind(this)
    this.onCropComplete = this.onCropComplete.bind(this)
    this.saveCroppedPhoto = this.saveCroppedPhoto.bind(this)

    this.state = {
      selectedTab: 'profile',
      croppingCoverPhotoMode: false,
      imgToCrop: false,
      imgToCropBlob: null,
      cropInfo: null,
      crop: {
        aspect: 2.7 / 1,
        x: 10,
        y: 10,
        width: 80
      }
    }
  }

  componentWillMount () {
    this.props.loadCurriculum(this.props.match.params.uuid)
  }

  // hideCopiedToolTip () {
  //   if (this.refs.overlay1) { this.refs.overlay1.hide() }
  //   if (this.refs.overlay2) { this.refs.overlay2.hide() }
  // }

  handleSelectTab (tabname, tabspace) {
    if (tabname === 'edit') {
      history.push('/editor/curricula/' + this.props.match.params.uuid + '/')
    }
    if (tabname !== this.state.tabname) {
      this.setState({selectedTab: tabname})
    }
  }

  startCurriculum () {
    window.open('/curriculum/' + this.props.match.params.uuid + '/', '_blank')
  }

  imageUpload (image) {
    if (image) {
      this.props.changeCurriculumImage(this.props.match.params.uuid, image)
    }
  }

  editNameClick () {
    this.setState({nameEditMode: true})
  }

  onCropChange (crop) {
    this.setState({ crop })
  }

  onNameChanged (name) {
    this.props.onNameChange(this.props.match.params.uuid, name)
    this.setState({nameEditMode: false})
  }

  coverPhotoSelected (image) {
    if (image) {
      this.setState({
        imgToCropBlob: URL.createObjectURL(image),
        imgToCrop: image,
        croppingCoverPhotoMode: true
      })
    }
  }

  saveCroppedPhoto () {
    if (this.state.cropInfo) {

      var img = new Image()
      img.src = this.state.imgToCropBlob

      this.props.changeCurriculumCoverPhoto(
        this.props.match.params.uuid,
        (makeblob(
          getCroppedImg(img, this.state.cropInfo),
          this.state.imgToCrop.name
        ))
      )
      this.setState({croppingCoverPhotoMode: false})
    }
  }

  onCropComplete (crop, pixelCrop) {
    if (crop.width !== 0) {
      this.setState({
        'cropInfo': pixelCrop
      })
    } else {
      this.setState({
        'cropInfo': null
      })
    }
  }

  render () {
    // var assignmentUrl = BASE_URL + 'teacher/:uuid/assignments/:assigmentUuid'
    // var studentsListUrl = this.props.match.path + 'students/'
    // var isExactUrl = this.props.match.isExact // exact url for teacher view

    // var studentsS = ''
    // if (this.props.classroomTeacher && this.props.classroomTeacher.count_students > 1) {
    //   studentsS = 's'
    // }
    var copiedTooltip = (
      <Tooltip id='copiedTooltip'>
        Copied!
      </Tooltip>
    )

    var selectedCurriculum = this.props.curricula[this.props.match.params.uuid]

    if (!selectedCurriculum) return null

    return (
      <div className={'pop-up-window'}>
        <Tabs name='editCurriculumProfileTabs'
          className='tabs'
          handleSelect={this.handleSelectTab}
          selectedTab={this.state.selectedTab}
        >
          <div className='tab-links'>
            <TabLink to='profile'>Curriculum profile</TabLink>
            <TabLink to='settings'>Curriculum settings</TabLink>
            <TabLink to='edit'>Edit content</TabLink>
          </div>
          <div className='content'>
            <TabContent for='profile'>
              <Grid fluid>
                <Row style={{padding: 0}}>
                  <Col sm={12} md={12}
                    style={{
                      padding: 0,
                      paddingTop: '37%',
                      width: '100%',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#12adf4'}} >
                    <div
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        bottom: '0',
                        right: '0'}}
                    >
                      <div style={{position: selectedCurriculum.cover_photo ? 'relative' : ''}}>
                        {this.state.croppingCoverPhotoMode
                          ? <div>
                            <ReactCrop
                              src={this.state.imgToCropBlob}
                              crop={this.state.crop}
                              onImageLoaded={this.onImageLoaded}
                              onComplete={this.onCropComplete}
                              onChange={this.onCropChange} />
                            { this.state.cropInfo
                              ? <button
                                className={'editor-common-button'}
                                style={{position: 'absolute', top: '85%', left: '2rem'}}
                                onClick={this.saveCroppedPhoto}>Save photo</button>
                              : null }
                          </div>
                          : <div>{ selectedCurriculum.cover_photo
                            ? <ImageBs src={selectedCurriculum.cover_photo} responsive />
                            : <div style={{ height: '100%', width: '100%' }} /> }
                          </div>
                        }
                        {/* TODO add default background */}
                        <div title={'Change cover photo'} className={'base-circle-edit bottom-circle-edit right-circle-edit'}>
                          <PencilImageUpload onFileSelect={this.coverPhotoSelected} />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <br />
                <Row style={{padding: 0}}>
                  <Col sm={2} md={2} style={{padding: 0}}>
                    <div style={{minHeight: '10rem'}}>
                      { selectedCurriculum.image ? <ImageBs
                        src={selectedCurriculum.image}
                        responsive
                      /> : null }
                    </div>
                    <div
                      className={'base-circle-edit bottom-circle-edit right-circle-edit'}
                      title={'Change image'}
                    ><PencilImageUpload onFileSelect={this.imageUpload} />
                    </div>
                  </Col>
                  <Col sm={7} md={7}>
                    <Row style={{padding: 0}}>
                      <Col sm={12} md={12}>
                        <div className={'blue-title'}>
                          {/*{selectedCurriculum.name}*/}
                          <EditableExternalEventLabel
                            value={selectedCurriculum.name}
                            onChange={this.onNameChanged}
                            editMode={this.state.nameEditMode}
                          />
                          <span style={{position: 'relative', paddingLeft: '1rem'}}>
                            <span className={'base-circle-edit'}>
                              <Glyphicon
                                glyph={'pencil'}
                                onClick={this.editNameClick}
                                style={{fontSize: '2rem'}} />
                            </span>
                          </span>
                        </div>
                      </Col>
                    </Row>
                    <Row style={{padding: 0}}>
                      <Col sm={12} md={12}>
                        <div style={{fontSize: '2rem'}}>
                          { selectedCurriculum.author.display_name }
                          ∙ { selectedCurriculum.count_lessons } lessons
                          ∙ { selectedCurriculum.count_lessons } learners
                        </div>
                      </Col>
                    </Row>
                    <Row style={{padding: 0}}>
                      <Col sm={12} md={12}>
                        <div style={{color: 'gray'}}>
                          Created <Moment fromNow>{selectedCurriculum.created_on}</Moment>
                          ∙ Last updated <Moment fromNow>{selectedCurriculum.updated_on}</Moment>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={3} md={3}>
                    <button className={'editor-common-button'} onClick={this.startCurriculum}>Start Curriculum</button>
                  </Col>
                </Row>
              </Grid>
            </TabContent>
            <TabContent for='settings'>
              settings tab
            </TabContent>
            <TabContent for='edit'>
              edit tab
            </TabContent>
          </div>
        </Tabs>
      </div>)
  }
}

EditCurriculumProfileView.propTypes = {
  // actions
  loadCurriculum: PropTypes.func.isRequired,
  changeCurriculumImage: PropTypes.func.isRequired,
  changeCurriculumCoverPhoto: PropTypes.func.isRequired,
  // data
  curricula: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    curricula: state.curricula
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    loadCurriculum: (uuid) => dispatch(loadCurriculumIfNeeded(uuid)),
    changeCurriculumImage: (uuid, image) => dispatch(changeCurriculumImage(uuid, image)),
    onNameChange: (uuid, name) => dispatch(renameCurriculum(uuid, name)),
    changeCurriculumCoverPhoto: (uuid, image) => dispatch(changeCurriculumCoverPhoto(uuid, image))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCurriculumProfileView)
export { EditCurriculumProfileView as EditCurriculumProfileViewNotConnected }
