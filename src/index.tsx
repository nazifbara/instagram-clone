import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { reset } from 'stitches-reset'
import { Amplify } from 'aws-amplify'

import App from './App'
import reportWebVitals from './reportWebVitals'
import { globalCss } from './stitches.config'
import awsExports from './aws-exports'

Amplify.configure(awsExports)

const globalStyles = globalCss({
  ...reset,
  body: {
    ...reset.body,
    fontFamily: '-apple-system,Roboto,sans-serif',
    fontSize: '$2',
    backgroundColor: '$accentBase',
    color: '$textBase',
  },
  '::placeholder': {
    color: '$grayPlaceholderText',
  },
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  img: {
    width: '100%',
  },
  textarea: {
    fontFamily: '-apple-system,Roboto,sans-serif',
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

const container = document.getElementById('app')
const root = createRoot(container!)

root.render(<Root />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
