import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Sheet } from '../../components/Sheet'

import Swiper from 'react-id-swiper'
import { Grid, Row, Col, Button, Glyphicon, FormGroup, InputGroup, FormControl } from 'react-bootstrap'

import { BASE_URL } from '../../utils/config'

import {
  getParams,
  alreadyInSlides,
  getPrefixFromSlidesName,
  updateSliderNavigation,
  updateSlidersNavigation
} from './sliderHelpers'

import SearchRowView from './searchRow'

import history from '../../history'
import * as resourcesCreators from '../../actions/resources'
import ResourceThumbnail from '../../components/resourceThumbnail'

const slidesNames = ['newSlides', 'popularSlides', 'recentSlides']

class IndexView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchString: '',
      searchEnabeled: false,
      recentSlides: [],
      recentNextPageUrl: null,
      popularSlides: [],
      popularNextPageUrl: null,
      newSlides: [],
      newNextPageUrl: null
    }
  }

  componentDidMount () {
    this.props.resourcesActions.loadPopularResourcesList()
    this.props.resourcesActions.loadRecentResourcesList()
    this.props.resourcesActions.loadNewResourcesList()
  }

  populateSlides (slidesListName, props) {
    var slides = []
    var resourcesList = props.popularResourcesList

    if (slidesListName === 'recentSlides') {
      resourcesList = props.recentResourcesList
    }
    if (slidesListName === 'newSlides') {
      resourcesList = props.newResourcesList
    }
    if (!resourcesList) return []
    if (this.state[slidesListName] && this.state[slidesListName].length > 0) {
      slides = this.state[slidesListName]
    }

    for (var index in resourcesList.results) {
      slides.push(<ResourceThumbnail
        key={resourcesList.results[index].uuid}
        resource={resourcesList.results[index]}
        onTitleClick={() => this.onResourceClick(resourcesList.results[index].uuid)}
      />)
      // if (!this.alreadyInSlides(slides, resourcesList.results[index].uuid)) {
      //   slides.push(<span>I will be slide</span>)
      // }
    }
    return slides
  }

  componentWillReceiveProps (props) {
    // if (this.props.tab !== props.tab) {
    this.updateSlidersNavigation()
    // }
    for (var i = 0, len = slidesNames.length; i < len; i++) {
      var prefix = this.getPrefixFromSlidesName(slidesNames[i])

      if (props[prefix + 'ResourcesList'] && props[prefix + 'ResourcesList'] !== this.props[prefix + 'ResourcesList']) {
        var slides = this.populateSlides(slidesNames[i], props)
        var newState = {}
        newState[prefix + 'NextPageUrl'] = props[prefix + 'ResourcesList'].next
        newState[slidesNames[i]] = slides
        this.setState(newState)
      }
    }
  }

  onAddResourceClick (addResourceUrl) {
    history.push(addResourceUrl)
  }

  onResourceClick (resourceUuid) {
    history.push(BASE_URL + resourceUuid)
  }

  getParams (slidesListName) {
    var self = this

    var reachEndFunc = function () {
      if (self.state.recentNextPageUrl && slidesListName === 'recentSlides') {
        self.props.resourcesActions.loadRecentResourcesList(self.state.recentNextPageUrl)
      }
      if (self.state.popularNextPageUrl && slidesListName === 'popularSlides') {
        self.props.resourcesActions.loadPopularResourcesList(self.state.popularNextPageUrl)
      }
      if (self.state.newNextPageUrl && slidesListName === 'newSlides') {
        self.props.resourcesActions.loadNewResourcesList(self.state.newNextPageUrl)
      }
    }

    return getParams(slidesListName, this, reachEndFunc)
  }

  alreadyInSlides (slides, uuid) {
    return alreadyInSlides(slides, uuid)
  }

  updateSlidersNavigation () {
    return updateSlidersNavigation(slidesNames, this)
  }

  updateSliderNavigation (slidesListName) {
    return updateSliderNavigation(slidesListName, this)
  }

  getPrefixFromSlidesName (slidesName) {
    return getPrefixFromSlidesName(slidesName)
  }

  render () {
    var baseUrl = this.props.match.url.replace(/\/$/, '')
    var addResourceUrl = baseUrl + '/add/'
    // var editUrl = baseUrl + '/:uuid/edit/'

    var displyDashboard = 'block'
    if (this.state.searchEnabeled) {
      displyDashboard = 'none'
    }

    return (
      <Sheet>
        <Grid fluid>
          <Row>
            <Col sm={10} md={10}>
              <div className={'blue-title'} style={{lineHeight: '7rem'}}>
                Resources
              </div>
            </Col>
            <Col sm={2} md={2}>
              <Button onClick={() => { this.onAddResourceClick(addResourceUrl) }} className={'common-button'}>
                <Glyphicon glyph='plus' /> Add resource
              </Button>
            </Col>
          </Row>
          {/*<SearchRowView*/}
            {/*searchButtonClick={this.searchButtonClick}*/}
            {/*handleSearchString={this.handleSearchString}*/}
            {/*handleSearchInputKeyUp={this.handleSearchInputKeyUp}*/}
            {/*clearSearchButtonClick={this.clearSearchButtonClick}*/}
            {/*searchString={this.state.searchString}*/}
          {/*/>*/}
        </Grid>
        {/*{ this.state.searchEnabeled*/}
            {/*? <CurriculaSearchView*/}
              {/*ref={(node) => { if (node) this.searchView = node }}*/}
              {/*curriculaSearchString={this.state.searchString} /> : null*/}
          {/*}*/}
        <div style={{ 'display': displyDashboard }}>
          <Grid fluid>
            <Row>
              <Col sm={12} md={12}>
                <div className={'blue-text'} style={{lineHeight: '3rem', fontSize: '2rem'}}>
                      My recently viewed
                </div>
                <Swiper {...this.getParams('recentSlides')} ref={(node) => { if (node) this.recentSlidesSwiper = node.swiper }}>
                  {this.state.recentSlides}
                </Swiper>
                <div className={'blue-text'} style={{lineHeight: '3rem', fontSize: '2rem'}}>
                    Popular
                </div>
                <Swiper {...this.getParams('popularSlides')} ref={(node) => { if (node) this.popularSlidesSwiper = node.swiper }}>
                  {this.state.popularSlides}
                </Swiper>
                <div className={'blue-text'} style={{lineHeight: '3rem', fontSize: '2rem'}}>
                    New
                </div>
                <Swiper {...this.getParams('newSlides')} ref={(node) => { if (node) this.newSlidesSwiper = node.swiper }}>
                  {this.state.newSlides}
                </Swiper>
              </Col>
            </Row>
          </Grid>
        </div>
      </Sheet>
    )
  }
}

IndexView.propTypes = {
  // actions
  resourcesActions: PropTypes.shape({
    loadPopularResourcesList: PropTypes.func.isRequired,
    loadRecentResourcesList: PropTypes.func.isRequired,
    loadNewResourcesList: PropTypes.func.isRequired
  }),
  // data
  popularResourcesList: PropTypes.object,
  recentResourcesList: PropTypes.object,
  newResourcesList: PropTypes.object,
  // dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    popularResourcesList: state.resources.popularResourcesList,
    recentResourcesList: state.resources.recentResourcesList,
    newResourcesList: state.resources.newResourcesList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    resourcesActions: bindActionCreators(resourcesCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexView)
export { IndexView as IndexViewNotConnected }
