import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from 'sonner'
import Home from './components/Home/Home'
import ClubProfile from './components/ClubProfile/ClubProfile'
import AdminRoute from './components/AdminRoute/AdminRoute'
import AdminInterface from './components/AdminRoute/AdminInterface/AdminInterface'
import LoginAdmin from './components/LoginAdmin/LoginAdmin'

function App() {
  return (
    <>
      <BrowserRouter>
        <main>
          <Toaster richColors />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/c/:clubId' element={<ClubProfile />} />
            <Route path='/admin'
              element={
                <AdminRoute>
                  <AdminInterface />
                </AdminRoute>
              }
            />
            <Route path='/login-admin' element={<LoginAdmin />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
