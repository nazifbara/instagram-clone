import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { reset } from 'stitches-reset'
import { Amplify, AuthModeStrategyType } from 'aws-amplify'
import { Provider } from 'react-redux'
import createSagaMiddleware from '@redux-saga/core'
import { configureStore } from '@reduxjs/toolkit'

import App from './App'
import { rootSaga } from './sagas'
import rootReducer from './slices'
import reportWebVitals from './reportWebVitals'
import { globalCss } from './stitches.config'
import awsExports from './aws-exports'

Amplify.configure({
  ...awsExports,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
})

const sagaMiddleware = createSagaMiddleware()
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
})

sagaMiddleware.run(rootSaga)

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
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  )
}

const container = document.getElementById('app')
const root = createRoot(container!)

root.render(<Root />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
