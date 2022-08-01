import { render as rtlRender } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'
import { all } from 'redux-saga/effects'
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

export const getSaga = (effects: unknown[]) =>
  function* () {
    yield all(effects)
  }

export * from '@testing-library/react'
export { render }

export function setupIntersectionObserverMock({
  root = null,
  rootMargin = '',
  thresholds = [],
  disconnect = () => null,
  observe = () => null,
  takeRecords = () => [],
  unobserve = () => null,
} = {}): void {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = root
    readonly rootMargin: string = rootMargin
    readonly thresholds: ReadonlyArray<number> = thresholds
    disconnect: () => void = disconnect
    observe: (target: Element) => void = observe
    takeRecords: () => IntersectionObserverEntry[] = takeRecords
    unobserve: (target: Element) => void = unobserve
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })
}
