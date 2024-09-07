import { Route, Link, BrowserRouter, Routes } from 'react-router-dom'

import SearchPage from './pages/searchPage'
import UserPage from './pages/userPage'
import FollowersList from './pages/friendsList'

import { UserProvider } from './contexts/userContext'
import { ReposProvider } from './contexts/reposContext'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          <Link to="/">Home</Link>
        </nav>
        <UserProvider>
          <ReposProvider>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/user/:username" element={<UserPage />} />
              <Route path="/user/:username/followers" element={<FollowersList />} />
            </Routes>
          </ReposProvider>
        </UserProvider >
      </div>
    </BrowserRouter>
  )
}