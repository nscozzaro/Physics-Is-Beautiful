import * as React from 'react'
import SplitPane from 'react-split-pane'
// import { connect } from 'react-redux'

import { Skeleton } from '../app/components/Skeleton'

import store from '../../../../../../../store/store'

import { inject, observer } from '../app/componentConnectors'
import styled, { ThemeProvider } from 'styled-components'
import { templateColor } from '../app/utils/template-color'
import Fullscreen from '../common/src/components/flex/Fullscreen'
import getTemplateDefinition from '../common/src/templates'
import codesandbox from '../common/src/themes/codesandbox.json'

import { MenuBar } from './MenuBar'

// import ForkFrozenSandboxModal from './ForkFrozenSandboxModal'
import { Container } from './elements'
import { HeaderContainer, HeaderLeft } from './elements'
import { Workspace } from './Workspace'
import Content from './Content'
// import { Header } from './Header'
// import { Navigation } from './Navigation'

import getVSCodeTheme from './utils/get-vscode-theme'

import * as fs from 'fs'

const STATUS_BAR_SIZE = 22

const StatusBar = styled.div`
  a {
    color: inherit;
  }
`

class ContentSplit extends React.Component {
  state = {
    theme: {
      colors: {},
      vscodeTheme: codesandbox
    },
    customVSCodeTheme: this.props.store.preferences.settings.customVSCodeTheme,
    currentMaterialProblemType: {id: 'new'}
  };

  getMaterialProblemTypeFromReduxStore (state) {
    if (state.studio.currentMaterial &&
      state.studio.currentMaterial.material_problem_type) {
      return state.studio.currentMaterial.material_problem_type
    } else {
      return null
    }
  }

  constructor (props) {
    super(props)
    this.setState({ currentMaterialProblemType: null })
    // subscribe for material changed
    this.unSubscribeStore = store.subscribe(() => {
      const newSandbox = this.getMaterialProblemTypeFromReduxStore(store.getState())
      if (newSandbox && this.state.currentMaterialProblemType.id !== newSandbox.id) {
        this.setState({
          currentMaterialProblemType: newSandbox
        }, this.fetchReactSandbox)
      }
    })
  }

  componentWillUnmount () {
    this.unSubscribeStore()
  }

  componentWillMount () {
    this.fetchReactSandbox()
  }

  componentDidMount () {
    this.loadTheme()
  }

  fetchReactSandbox = () => {
    // console.log(this.state.currentMaterialProblemType)

    this.props.signals.editor.sandboxChanged(this.state.currentMaterialProblemType)

    // const { id } = this.props.match.params;
    // load custom sanbox if we have problem_type_uuid in param
    // let id
    // if (this.props.hasOwnProperty('problem_type_uuid') &&
    //    this.props.problem_type_uuid) {
    //   id = this.props.problem_type_uuid
    // } else {
    //   // th default react template of sandbox
    //   id = 'new'
    // }
    // this.props.signals.editor.sandboxChanged({ id })
  }

  componentDidUpdate (prevProps) {
    if (
      this.props.store.preferences.settings.customVSCodeTheme !==
      this.state.customVSCodeTheme
    ) {
      this.loadTheme()
    }

    // if (prevProps.problem_type_uuid !== this.props.problem_type_uuid) {
    //   this.fetchSandbox();
    // }
  }

  loadTheme = async () => {
    const { customVSCodeTheme } = this.props.store.preferences.settings

    try {
      const theme = await getVSCodeTheme('', customVSCodeTheme)
      this.setState({ theme, customVSCodeTheme })
    } catch (e) {
      console.error(e)
    }
  };

  render () {
    const { signals, store, match } = this.props

    const sandbox = store.editor.currentSandbox

    if (!sandbox || store.editor.isLoading) {
      return (<div>Loading problem type...</div>)
      // return (<Skeleton
      //   titles={[
      //     {
      //       content: 'Loading Sandbox',
      //       delay: 0.6
      //     }]}
      // />)
    }

    // Force MobX to update this component by observing the following value
    this.props.store.preferences.settings.customVSCodeTheme; // eslint-disable-line

    // const vscode = this.props.store.preferences.settings.experimentVSCode
    const vscode = true

    // const hideNavigation =
    //   store.preferences.settings.zenMode && store.workspace.workspaceHidden

    const { statusBar } = store.editor

    const templateDef = sandbox && getTemplateDefinition(sandbox.template)

    const topOffset = store.preferences.settings.zenMode ? 0 : 3 * 16
    // const bottomOffset = vscode ? STATUS_BAR_SIZE : 0
    const bottomOffset = 0

    return (
      <ThemeProvider
        theme={{
          templateColor: templateColor(sandbox, templateDef),
          templateBackgroundColor: templateDef && templateDef.backgroundColor,
          ...this.state.theme
        }}
      >
        <Container
          style={{ lineHeight: 'initial' }}
          className='monaco-workbench'
        >
          {/* <HeaderContainer> */}
          {/* <HeaderLeft> */}
          <div>
            <MenuBar/>
          </div>
          {/* </HeaderLeft> */}
          {/* </HeaderContainer> */}
          {/* <div><MenuBar/></div> */}
          {/* <Header zenMode={store.preferences.settings.zenMode} /> */}
          <Fullscreen style={{ width: 'initial' }}>
            {/* {!hideNavigation && ( */}
            {/* <Navigation topOffset={topOffset} bottomOffset={bottomOffset} /> */}
            {/* )} */}
            <div
              style={{
                // position: 'fixed',
                // left: hideNavigation ? 0 : 'calc(3.5rem + 1px)',
                // top: topOffset,
                // right: 0,
                // bottom: bottomOffset,
                height: statusBar ? 'auto' : 'calc(100% - 3.5rem)'
              }}
            >
              <SplitPane
                split='vertical'
                defaultSize={17 * 16}
                minSize={0}
                onDragStarted={() => signals.editor.resizingStarted()}
                onDragFinished={() => signals.editor.resizingStopped()}
                // onChange={size => {
                //   if (size > 0 && store.workspace.workspaceHidden) {
                //     signals.workspace.setWorkspaceHidden({ hidden: false })
                //   } else if (size === 0 && !store.workspace.workspaceHidden) {
                //     signals.workspace.setWorkspaceHidden({ hidden: true })
                //   }
                // }}
                pane1Style={{
                  visibility: store.workspace.workspaceHidden
                    ? 'hidden'
                    : 'visible',
                  maxWidth: store.workspace.workspaceHidden ? 0 : 'inherit'
                }}
                pane2Style={{
                  height: '100%'
                }}
                style={{
                  overflow: 'visible' // For VSCode Context Menu
                }}
              >
                {store.workspace.workspaceHidden
                  ? <div />
                  : <Workspace />
                }
                {sandbox ? <Content match={match} /> : <div></div>}
              </SplitPane>

              {vscode && (
                <StatusBar
                  style={{
                    position: 'fixed',
                    display: statusBar ? 'block' : 'none',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: STATUS_BAR_SIZE
                  }}
                  className='monaco-workbench mac nopanel'
                >
                  <div
                    className='part statusbar'
                    id='workbench.parts.statusbar'
                  />
                </StatusBar>
              )}
            </div>
          </Fullscreen>
          {/* <ForkFrozenSandboxModal /> */}
        </Container>
      </ThemeProvider>
    )
  }
}

// const mapStateToProps = (state, ownProps) => {
//     return {}
// }
//
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {}
// }
//
//
// // Connect PIB store
// const contentSplit = connect(mapStateToProps, mapDispatchToProps)(ContentSplit)
// export default inject('signals', 'store')(observer(contentSplit))

export default inject('signals', 'store')(observer(ContentSplit))
