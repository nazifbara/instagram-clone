import { Routes, Route } from 'react-router-dom'

import { AppBar, ContentBox } from './components'
import routes from './routes'

const App = (): JSX.Element => {
  return (
    <>
      <AppBar />

      <ContentBox>
        <Routes>
          {routes.map((r) => (
            <Route key={r.name} {...r.props} />
          ))}
          <Route path="*" element={<h1>There's nothing here!</h1>} />
        </Routes>
      </ContentBox>
    </>
  )
}

export default App
