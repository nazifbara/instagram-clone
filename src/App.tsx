import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useCallback } from 'react'
import { Hub } from 'aws-amplify'
import { useDispatch } from 'react-redux'

import { checkAuth } from './slices/auth'
import { AppBar, ContentBox, PrivateRoute, Box } from './components'
import routes from './routes'

const App = (): JSX.Element => {
  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _checkAuth = useCallback(() => dispatch(checkAuth()), [dispatch])

  useEffect(() => {
    _checkAuth()
    Hub.listen('auth', _checkAuth)
    return () => Hub.remove('auth', _checkAuth)
  }, [_checkAuth])

  return (
    <>
      <Box
        css={{
          display: 'none !important',
          '@desktop': {
            display: 'initial !important',
          },
        }}
      >
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
      </Box>

      <Box
        as="h1"
        css={{
          display: 'none',
          '@unsupported': {
            display: 'block',
            position: 'fixed',
            fontSize: '20px',
            color: '$dangerSolid',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
          },
        }}
      >
        This app is destop-only for the moment
      </Box>
    </>
  )
}

export default App
