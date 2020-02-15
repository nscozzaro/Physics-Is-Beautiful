import React from 'react'

import { ThemeProvider } from 'styled-components'
import { Provider as ActualOvermindProvider } from 'overmind-react'
import { Provider as OvermindProvider } from '../app/overmind/Provider'
import theme from '../common/src/theme'

import Editor from './editor'
import PropTypes from 'prop-types'
import { initialize } from './init'

let Index = class Index extends React.Component {
  render () {
    return (
      <ActualOvermindProvider value={this.props.overmind}>
        <OvermindProvider value={this.props.overmind}>
          {/* <HooksProvider client={client}> */}
          <ThemeProvider theme={theme}>
            <Editor {...this.props}>
              {/* {this.props.children} */}
            </Editor>
          </ThemeProvider>
          {/* </HooksProvider> */}
        </OvermindProvider>
      </ActualOvermindProvider>
    )
  }
}

export default async (props) => {
  const x = await new Promise((resolve, reject) => {
    initialize(Index, (Component, overmind) => {
      resolve(<Component overmind={overmind} {...props}/>)
    })
  })
  return x
}
