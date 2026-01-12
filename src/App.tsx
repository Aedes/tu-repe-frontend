import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/Home/Home'

function App() {
  return (
    <>
      <BrowserRouter>
      <main>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/club' element={<h1>Clubs.</h1>}/>
        </Routes>
      </main>
      </BrowserRouter>
    </>
  )
}

export default App
