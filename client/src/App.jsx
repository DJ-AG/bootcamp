import { useAppContext } from './Redux/appContext'
import { useState } from 'react'
import HamburgerMenu from './components/HamburgerMenu/HamburgerMenu'
import "./App.css"
import Login from './components/Login/Login'
import BootcampFilters from './components/Bootcamps/Bootcamps'

function App() {
  
  return (
    <div className="landing">
    <HamburgerMenu />
    <Login/>
    <BootcampFilters/>
    </div>
  )
}

export default App
