import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Grid, Row, Col, Table, Button, Glyphicon, Modal, Dropdown, MenuItem } from 'react-bootstrap'
import AdSense from 'react-adsense'
import history from '../../history'
import { Sheet } from '../../components/Sheet'
import * as resourcesCreators from '../../actions/resources'
import { BASE_URL } from '../../utils/config'

import {
  handleFileChange,
  onChangeExternalUrl
} from '../AddTextBookResourceSteps/lib'

import { EditableExternalEventLabel, EditableLabel } from '../../utils/editableLabel'
import * as googleCreators from '../../actions/google'
import * as profileCreators from '../../actions/profile'

class HorizontalOptionToggle extends React.Component {
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
      <span onClick={this.handleClick}>
        <Glyphicon
          glyph='option-horizontal'
          style={{cursor: 'pointer'}}
        />
      </span>
    )
  }
}

class TextBookProblemView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showPostSolutionModal: false,
      ordering: 'Top',
      solutionEditModeUuid: null
    }
    this.onPostSolutionClick = this.onPostSolutionClick.bind(this)
    this.handleClosePostSolutionModal = this.handleClosePostSolutionModal.bind(this)
    this.addSolution = this.addSolution.bind(this)
    this.handleOrderSelect = this.handleOrderSelect.bind(this)
    this.onChangeSolutionTitle = this.onChangeSolutionTitle.bind(this)
  }

  componentDidMount () {
    if (this.props.match.params && this.props.match.params['uuid']) {
      this.props.resourcesActions.fetchProblem(this.props.match.params['uuid'])
    }
    if (!this.props.resource && this.props.match.params && this.props.match.params['resource_uuid']) {
      this.props.resourcesActions.fetchResource(this.props.match.params['resource_uuid'])
    }
    this.props.googleActions.gapiInitialize()
    this.props.profileActions.fetchProfileMe()
  }

  onPostSolutionClick () {
    if (this.props.profile.is_anonymous === true) {
      let url = '/accounts/login/?next=' + window.location.pathname
      window.location.replace(url)
      throw new Error('redirecting...')
    } else {
      this.setState({showPostSolutionModal: !this.state.showPostSolutionModal})
    }
  }

  onClickSolution (uuid) {
    if (this.state.solutionEditModeUuid === uuid) { return } // do not redirect while edit mode
    history.push(BASE_URL + this.props.resource.uuid + '/problems/' + this.props.problem.uuid + '/solutions/' + uuid)
  }

  handleClosePostSolutionModal () {
    this.setState({ showPostSolutionModal: !this.state.showPostSolutionModal })
  }

  // Vote solution click
  upDownSolutionClick (solutionUuid, val) {
    this.props.resourcesActions.solutionVoteAndRefreshList(solutionUuid, val, this.props.problem.uuid)
  }

  addSolution (chapter, problem, file) {
    // save new solution for the problem
    this.props.resourcesActions.addSolution(file, problem)
    this.setState({ showPostSolutionModal: false })
  }

  handleOrderSelect (val) {
    this.setState({'ordering': val})
    if (this.props.match.params && this.props.match.params['uuid']) {
      if (val === 'Top') {
        this.props.resourcesActions.fetchProblem(this.props.match.params['uuid'])
      } else if (val === 'New') {
        this.props.resourcesActions.fetchProblem(this.props.match.params['uuid'], '-solutions__created_on')
      }
    }
  }

  handleSolutionMenuClick (val, solution) {
    if (val === 'Edit') {
      this.setState({solutionEditModeUuid: solution.uuid})
    } else if (val === 'Delete') {
      if (confirm('Are you sure you want to delete this solution?')) {
        this.props.resourcesActions.removeSolutionReloadProblem({uuid: solution.uuid}, this.props.problem)
      }
    }
  }

  onChangeSolutionTitle (value, solution) {
    if (!value) return
    let newSolution = {uuid: solution.uuid, title: value}
    this.props.resourcesActions.updateSolutionReloadProblem(newSolution, this.props.problem)
    this.setState({solutionEditModeUuid: null})
  }

  render () {
    var self = this
    let getHaveSolutionEditAccess = function (solution) {
      if (self.props.profile &&
          self.props.profile.is_anonymous !== true &&
         (self.props.profile.is_staff === true || self.props.profile.id === solution.posted_by.id)) {
        return true
      }
      return false
    }

    return (
      <Sheet>
        <Grid fluid>
          <Row>
            <Col sm={12} md={12}>
              <a className={'back-button'} onClick={() => { history.push(BASE_URL + this.props.match.params['resource_uuid']) }} >
                <span className='glyphicon glyphicon-menu-left' style={{fontSize: 16}} />
                All problems
              </a>
            </Col>
          </Row>
        </Grid>
        { this.props.problem
          ? <Grid fluid>
            <Row>
              <Col sm={12} md={12}>
                <div className={'text-align-center blue-title'}>{this.props.resource && this.props.resource.metadata
                  ? this.props.resource.metadata.data.volumeInfo.title
                  : 'Unknown resource'}
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12}>
                <h1 style={{fontSize: '3rem'}} className={'text-align-center gray-text'}>{this.props.problem.title}</h1>
              </Col>
            </Row>
            <Row>
              <Col sm={1} md={1}>
                <Dropdown onSelect={this.handleOrderSelect} id={'dropdown-settings'}>
                  <Dropdown.Toggle className={'common-button'} style={{padding: '1rem'}}>
                    {this.state.ordering}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <MenuItem eventKey='Top'>Top</MenuItem>
                    <MenuItem eventKey='New'>New</MenuItem>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col sm={9} md={9} />
              <Col sm={2} md={2}>
                <Button onClick={() => { this.onPostSolutionClick() }} className={'common-button'}>
                  <Glyphicon glyph='plus' /> Post solution
                </Button>
              </Col>
              <Modal
                show={this.state.showPostSolutionModal}
                onHide={this.handleClosePostSolutionModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Post solution</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <span
                      className={'blue-text selectable-file'}
                      style={{ paddingLeft: '2rem', position: 'relative' }}
                    >
                      <input
                        type='file'
                        name='pdf'
                        id={'solution-input-' + this.props.problem.uuid}
                        accept='application/pdf'
                        // onChange={(file) => this.handleFileChange(file, chapter, problem, (...args) => { this.addSolution(...args) })}
                        onChange={(file) =>
                          handleFileChange(file, null, this.props.problem, null, (...args) => { this.addSolution(...args) })}
                        style={{fontSize: '1px'}} />
                      <label htmlFor={'solution-input-' + this.props.problem.uuid} style={{cursor: 'pointer'}}>
                        upload pdf file...
                      </label>
                    </span>
                  </div>
                  <div>
                    <span
                      style={{paddingLeft: '2rem', cursor: 'pointer'}}
                      className={'blue-text'}
                    >
                      <b>
                        <EditableLabel
                          value={'external link'}
                          onChange={(url) => {
                            if (this.props.gapiInitState) {
                              onChangeExternalUrl(url, null, this.props.problem, (...args) => { this.addSolution(...args) })
                            }
                          }
                          }
                          defaultValue={'external link'} />
                      </b>
                    </span>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.handleClosePostSolutionModal}>Close</Button>
                </Modal.Footer>
              </Modal>
            </Row>
            <Row>
              <Col sm={12} md={12}>
                <Table striped bordered condensed hover responsive>
                  <tbody>
                    { this.props.problem
                      ? this.props.problem.solutions.map(function (solution, i) { // ============ chapters
                        return <tr key={solution.uuid}>
                          <td>
                            <Glyphicon
                              glyph='arrow-down'
                              style={{cursor: 'pointer'}}
                              onClick={() => this.upDownSolutionClick(solution.uuid, -1)} />
                            &nbsp;{solution.vote_score}&nbsp;
                            <Glyphicon
                              glyph='arrow-up'
                              style={{cursor: 'pointer'}}
                              onClick={() => this.upDownSolutionClick(solution.uuid, 1)} />
                          </td>
                          <td>{solution.pdf ? <div className={'pdf-ico'} /> : null}</td>
                          <td>
                            {/* Solution title */}
                            <div
                              className={'title blue-text'}
                              style={{cursor: 'pointer'}}
                              onClick={() => this.onClickSolution(solution.uuid)}>
                              <EditableExternalEventLabel
                                value={solution.title}
                                onChange={(value) => { this.onChangeSolutionTitle(value, solution) }}
                                editMode={this.state.solutionEditModeUuid === solution.uuid}
                              />
                              {/*{solution.title}*/}
                            </div>
                            <div className={'small-text gray-text'}>
                              Posted by <a href={solution.posted_by.get_absolute_url} target={'_blank'}>
                                {solution.posted_by.display_name}
                              </a>&nbsp;-&nbsp;
                              <Moment fromNow>{solution.created_on}</Moment></div>
                          </td>
                          <td style={{textAlign: 'center'}}><Glyphicon glyph='comment' />&nbsp;{solution.count_comments}</td>
                          { getHaveSolutionEditAccess(solution)
                            ? <td className={'solution-dropdown-menu'}>
                              <Dropdown
                                onSelect={(val) => { this.handleSolutionMenuClick(val, solution) }}
                                id={'dropdown-settings' + solution.uuid}
                              >
                                <HorizontalOptionToggle bsRole='toggle' data-boundary='body' />
                                <Dropdown.Menu>
                                  <MenuItem eventKey='Edit'>Edit</MenuItem>
                                  <MenuItem eventKey='Delete'>Delete</MenuItem>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td> : null }
                        </tr>
                      }, this) : null }
                  </tbody>
                </Table>
                <div style={{marginTop: 20, marginBottom: 20}}>
                  <AdSense.Google
                    client='ca-pub-1780955227395785'
                    slot='4334626488'
                  />
                </div>
              </Col>
            </Row>
          </Grid>
          : null }
      </Sheet>
    )
  }
}

TextBookProblemView.propTypes = {
  // actions
  resourcesActions: PropTypes.shape({
    fetchProblem: PropTypes.func.isRequired,
    fetchResource: PropTypes.func.isRequired,
    solutionVoteAndRefreshList: PropTypes.func.isRequired,
    addSolution: PropTypes.func.isRequired,
    updateSolutionReloadProblem: PropTypes.func.isRequired,
    removeSolutionReloadProblem: PropTypes.func.isRequired,
  }),
  googleActions: PropTypes.shape({
    gapiInitialize: PropTypes.func.isRequired
  }).isRequired,
  profileActions: PropTypes.shape({
    fetchProfileMe: PropTypes.func.isRequired
  }),
  // data
  problem: PropTypes.object,
  profile: PropTypes.object,
  resource: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    problem: state.resources.problem,
    resource: state.resources.resource,
    gapiInitState: state.google.gapiInitState,
    profile: state.profile.me
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    googleActions: bindActionCreators(googleCreators, dispatch),
    resourcesActions: bindActionCreators(resourcesCreators, dispatch),
    profileActions: bindActionCreators(profileCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextBookProblemView)
export { TextBookProblemView as TextBookProblemViewNotConnected }
