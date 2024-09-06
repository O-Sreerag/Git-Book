import { Route, Link, BrowserRouter, Routes } from 'react-router-dom'

import SearchPage from './pages/searchPage'
import UserPage from './pages/userPage'
import RepoDetails from './pages/repoDetails'
import FollowersList from './pages/friendsList'

import { UserProvider } from './contexts/userContext'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          <Link to="/">Home</Link>
        </nav>
        <UserProvider>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/user/:username" element={<UserPage />} />
            <Route path="/user/:username/repo/:repoName" element={<RepoDetails />} />
            <Route path="/user/:username/followers" element={<FollowersList />} />
          </Routes>
        </UserProvider >
      </div>
    </BrowserRouter>
  )
}