import React from 'react'

import { Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs, TabLink, TabContent } from 'react-tabs-redux'
import { Grid, Row, Col, Button, Glyphicon, FormGroup, InputGroup, FormControl } from 'react-bootstrap'

import history from '../../history'
import { Sheet } from '../../components/Sheet'
import * as profileCreators from '../../actions/profile'
import * as tabsCreators from '../../actions/tab'

import ProfileTabView from './profileTab'
import NotificationsTabView from './notificationsTab'
import SettingsTabView from './settingsTab'

// import ResourceThumbnail from '../../components/resourceThumbnail'

class IndexView extends React.Component {
  componentWillMount () {
    if (!this.props.profile && !this.props.profile_fetching) {
      this.props.profileActions.fetchProfile(this.props.match.params.id)
    }
  }

  render () {
    // var baseUrl = this.props.match.url.replace(/\/$/, '')
    // var addResourceUrl = baseUrl + '/add/'
    // // var editUrl = baseUrl + '/:uuid/edit/'
    //
    // var displyDashboard = 'block'
    // if (this.state.searchEnabeled) {
    //   displyDashboard = 'none'
    // }

    var profileSettingsUrl = '/:id/settings/'
    var profileNotificationsUrl = '/:id/notifications/'

    return (
      <Sheet type={'problem'}>
        <Tabs name='profileTab'
          className='tabs'
          handleSelect={
            (selectedTab, tabNamespace) => {
              this.props.tabActions.changeSelectedTab(selectedTab, tabNamespace, this.props.match.params.id)
            }
          }
          selectedTab={this.props.tab}
        >
          <div className='tab-links'>
            <TabLink to='profile'>Profile</TabLink>
            {this.props.profile && this.props.profile.is_current_user_profile
              ? <TabLink to='settings'>Settings</TabLink> : null }
            {this.props.profile && this.props.profile.is_current_user_profile
              ? <TabLink to='notifications'>Notifications</TabLink>
              : null }
          </div>
          <div className='content'>
            <TabContent for='profile'>
              <ProfileTabView profileId={this.props.match.params.id}/>
            </TabContent>
            {this.props.profile && this.props.profile.is_current_user_profile
              ? <TabContent for='settings'>
                <Route exact path={profileSettingsUrl} component={SettingsTabView} />
              </TabContent> : null }
            {this.props.profile && this.props.profile.is_current_user_profile
              ? <TabContent for='notifications'>
                <Route exact path={profileNotificationsUrl} component={NotificationsTabView} />
              </TabContent> : null }
          </div>
        </Tabs>
      </Sheet>
    )
  }
}

IndexView.propTypes = {
  // actions
  tabActions: PropTypes.shape({
    changeSelectedTab: PropTypes.func.isRequired
  }).isRequired,
  profileActions: PropTypes.shape({
    fetchProfile: PropTypes.func.isRequired,
  }).isRequired,
  // data
  tab: PropTypes.string,
  profile: PropTypes.object,
  profile_fetching: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    tab: state.tabs.profileTab,
    profile: state.profile.profile,
    profile_fetching: state.profile.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    // profileActions: bindActionCreators(profileCreators, dispatch)
    tabActions: bindActionCreators(tabsCreators, dispatch),
    profileActions: bindActionCreators(profileCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexView)
export { IndexView as IndexViewNotConnected }
