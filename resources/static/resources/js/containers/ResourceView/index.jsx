import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'
import { FaChevronLeft } from 'react-icons/fa'

import { ThreadComponent } from '@vermus/django-react-djeddit-client/lib/index.js'

import { Sheet } from '../../components/Sheet'
import history from '../../history'
import { BASE_URL } from '../../utils/config'
import * as resourcesCreators from '../../actions/resources'
import { AdblockDetect } from '../../components/adblockDetect'

import TextBookResourceView from './textBookResourceView'
import StandardizedTestResourceView from './standardizedTestResourceView'

class ResourceView extends React.Component {
  componentDidMount () {
    if (this.props.match.params && this.props.match.params['uuid']) {
      this.props.resourcesActions.fetchResource(this.props.match.params['uuid'])
    }
  }

  render () {
    return (
      <Sheet>
        <AdblockDetect />
        <Container fluid>
          <Row>
            <Col sm={12} md={12}>
              <a className={'back-button'} onClick={() => { history.push(BASE_URL) }} >
                {/* <span className='glyphicon glyphicon-menu-left' style={{fontSize: 16}} /> */}
                <FaChevronLeft />
                All Resources
              </a>
            </Col>
          </Row>
        </Container>
        { this.props.resource && this.props.resource.resource_type === 'TB'
          ? <TextBookResourceView resource={this.props.resource} />
          : null }
        { this.props.resource && this.props.resource.resource_type === 'TS'
          ? <StandardizedTestResourceView resource={this.props.resource} />
          : null }
        <Row>
          <Col sm={12} md={12}>
            {this.props.resource && this.props.resource.thread
              ? <ThreadComponent
                threadId={this.props.resource.thread}
              />
              : null}
          </Col>
        </Row>
      </Sheet>
    )
  }
}

ResourceView.propTypes = {
  // // actions
  resourcesActions: PropTypes.shape({
    fetchResource: PropTypes.func.isRequired
  }),
  // data
  resource: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    resource: state.resources.resource
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    resourcesActions: bindActionCreators(resourcesCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceView)
export { ResourceView as ResourceViewNotConnected }
