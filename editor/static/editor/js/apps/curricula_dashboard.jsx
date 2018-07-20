import React from 'react'
import { connect } from 'react-redux'
import { changeSelectedTab } from './../actions'
import { Tabs, TabLink, TabContent } from 'react-tabs-redux'
import { CurriculaApp } from './curricula'
import { MyCurriculaApp } from './my_curricula'

import { Sheet } from './sheet'

class CurriculaDashboard extends React.Component {

  render() {

    return (<Sheet>
       <Tabs
            name="tab"
            className="tabs"
            handleSelect={this.props.onTabChanged}
            selectedTab={this.props.tab}
        >
          <div className="tab-links">
                <TabLink to="my">My Curricula</TabLink>
                <TabLink to="studio">Curriculum studio</TabLink>
                <TabLink to="browse">Browse curricula</TabLink>
            </div>

            <div className="content">
                <TabContent for="my">
                    <MyCurriculaApp></MyCurriculaApp>
                </TabContent>
                <TabContent for="studio">
                    <CurriculaApp></CurriculaApp>
                </TabContent>
                <TabContent for="browse">
                    TODO: Browse app
                </TabContent>
            </div>
        </Tabs>
    </Sheet>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    tab: store.curriculaDashboard.tab
  };
}

export let CurriculaDashboardApp = connect(
  mapStateToProps,
  dispatch => {
    return {
      onTabChanged: (selectedTab, tabNamespace) => dispatch(changeSelectedTab(selectedTab, tabNamespace))
    }
  })(CurriculaDashboard);
