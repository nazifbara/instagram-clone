import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useCallback } from 'react'
import { Hub } from 'aws-amplify'
import { useDispatch } from 'react-redux'

import { checkAuth } from './slices/auth'
import { AppBar, ContentBox, PrivateRoute } from './components'
import routes from './routes'

const App = (): JSX.Element => {
  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _checkAuth = useCallback(() => dispatch(checkAuth()), [dispatch])

  const handleDatastoreReady = useCallback(
    (data: any) => {
      const { event } = data.payload
      console.log({ data })

      if (event === 'ready') {
        _checkAuth()
      }
    },
    [_checkAuth]
  )

  useEffect(() => {
    _checkAuth()

    Hub.listen('auth', _checkAuth)
    Hub.listen('datastore', handleDatastoreReady)
    return () => {
      Hub.remove('auth', _checkAuth)
      Hub.remove('datastore', handleDatastoreReady)
    }
  }, [_checkAuth, handleDatastoreReady])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" />} />

      <Route path="app">
        {routes.privateRoutes.map((r) => (
          <Route
            key={r.name}
            path={r.props.path}
            element={
              <PrivateRoute
                component={() => (
                  <>
                    <AppBar />

                    <ContentBox>{r.props.element}</ContentBox>
                  </>
                )}
              />
            }
          />
        ))}
      </Route>
      {routes.publicRoutes.map((r) => (
        <Route key={r.name} {...r.props} />
      ))}
      <Route path="*" element={<h1>There's nothing here!</h1>} />
    </Routes>
  )
}

export default App
