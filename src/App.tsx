import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Auth, Hub } from 'aws-amplify'

import { AppBar, ContentBox, PrivateRoute } from './components'
import routes from './routes'

const App = (): JSX.Element => {
  const [isAuthenicated, setIsAuthenicated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const updateUser = async () => {
      try {
        await Auth.currentAuthenticatedUser()
        setIsAuthenicated(true)
      } catch {
        setIsAuthenicated(false)
      }
      setLoading(false)
    }
    updateUser()
    Hub.listen('auth', updateUser)
    return () => Hub.remove('auth', updateUser)
  })
  return (
    <>
      {!loading && (
        <Routes>
          <Route path="/" element={<Navigate to="/app" />} />

          <Route path="app">
            {routes.privateRoutes.map((r) => (
              <Route
                key={r.name}
                path={r.props.path}
                element={
                  <PrivateRoute
                    isAuthenticated={isAuthenicated}
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
      )}
    </>
  )
}

export default App
