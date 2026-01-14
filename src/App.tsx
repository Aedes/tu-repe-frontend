import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/Home/Home'
import ClubProfile from './components/ClubProfile/ClubProfile'

function App() {
  return (
    <>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/c/:clubId' element={<ClubProfile />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
