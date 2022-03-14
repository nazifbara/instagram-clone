import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { reset } from 'stitches-reset'

import App from './App'
import reportWebVitals from './reportWebVitals'
import { globalCss } from './stitches.config'

const globalStyles = globalCss({
  ...reset,
  body: {
    ...reset.body,
    fontFamily: '-apple-system,Roboto,sans-serif',
    fontSize: '$2',
    backgroundColor: '$blue1',
    color: '$blue12',
  },
  '::placeholder': {
    color: '$blue12',
  },
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
})

const Root = (): JSX.Element => {
  globalStyles()

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
