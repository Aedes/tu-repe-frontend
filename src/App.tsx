import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import Home from './components/Home/Home'
import ClubProfile from './components/ClubProfile/ClubProfile'
import AdminRoute from './components/AdminRoute/AdminRoute'
import AdminInterface from './components/AdminRoute/AdminInterface/AdminInterface'
import LoginAdmin from './components/LoginAdmin/LoginAdmin'
import UserRoute from './components/UserRoute/UserRoute'
import UserInterface from './components/UserRoute/UserInterface/UserInterface'

function App() {
  return (
    <>
      <BrowserRouter>
        <main>
          <Toaster richColors />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/c/:clubUrlId' element={<ClubProfile />} />
            <Route path='/admin'
              element={
                <AdminRoute>
                  <AdminInterface />
                </AdminRoute>
              }
            />
            <Route path='/login-admin' element={<LoginAdmin baseUrl='admin' />} />
            <Route path='/user'
              element={
                <UserRoute >
                  <UserInterface />
                </UserRoute>
              }
            />
            <Route path='/login-user' element={<LoginAdmin baseUrl='user' />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
