import { render as rtlRender } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'
import { Provider } from 'react-redux'

import reducer from '../slices'

function render(
  ui: JSX.Element,
  { saga, preloadedState, ...renderOptions }: { saga?: any; preloadedState?: any } = {}
) {
  const sagaMiddleware = createSagaMiddleware()
  const store = configureStore({
    reducer: reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  })

  sagaMiddleware.run(saga ?? function* () {})

  function Wrapper({ children }: { children: any }): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { render }
