import React, { useState } from 'react'

// import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
// import Button from '@material-ui/core/Button'

interface ILogInProps {
  // open: boolean
  onDataChange(email: string, password: string): void
}

export default function LogIn(props: ILogInProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onChangeEmail = e => {
    setEmail(e.target.value)
    props.onDataChange(e.target.value, password)
  }

  const onChangePassword = e => {
    setPassword(e.target.value)
    props.onDataChange(email, e.target.value)
  }

  return (
    <div>
      {/*<DialogContentText>*/}
      {/*      To subscribe to this website, please enter your email address here. We will send updates*/}
      {/*      occasionally.*/}
      {/*</DialogContentText>*/}
      <TextField
        autoFocus
        margin="dense"
        name="login"
        autoComplete="login"
        value={email}
        id="id_login"
        label="Email Address"
        placeholder={'email'}
        type="email"
        onChange={onChangeEmail}
        fullWidth
      />
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}></Box>
        <Box>
          <a href={''}>
            {/* TODO send email */}
            Forgot password?
          </a>
        </Box>
      </Box>
      <TextField
        value={password}
        onChange={onChangePassword}
        autoFocus
        margin="dense"
        autoComplete="password"
        name="passowrd"
        id="id_password"
        label="Password"
        placeholder={'password'}
        type="password"
        fullWidth
      />
    </div>
  )
}