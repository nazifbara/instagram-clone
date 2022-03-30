import { Routes, Route } from 'react-router-dom'

import { AppBar } from './components'
import routes from './routes'

const App = (): JSX.Element => {
  return (
    <>
      <AppBar />

      <Routes>
        {routes.map((r) => (
          <Route key={r.name} {...r.props} />
        ))}
        <Route path="*" element={<h1>There's nothing here!</h1>} />
      </Routes>
    </>
  )
}

export default App
