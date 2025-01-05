import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
   <div>
    <Navbar/>
   <Routes>
    <Route path="/" element = {<Home/>}/>
    <Route path="/signup" element = {<SignupPage/>}/>
    <Route path="/login" element = {<LoginPage/>}/>
    <Route path="/setting" element = {<SettingPage/>}/>
    <Route path="/profile" element = {<ProfilePage/>}/>
   </Routes>
   </div>
  )
}

export default App
