import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import './App.css'

import Navbar from './components/Navbar'
import Themes from './components/Themes'
import Home from './pages/home/Home'
import About from './pages/about/About'
import Portfolio from './pages/portfolio/Portfolio'
import Contact from './pages/contact/Contact'


function App() {
  

  return (
   <BrowserRouter >
   <div id='app' >
   {/* common */}
   <Navbar /> 
   <Themes />
      <Routes>
        {/* <Route  element={<Home />} />
        <Route path='about' element={<About />}/>
        <Route path='portfolio' element={<Portfolio />}/>
        <Route path='contact' element={<Contact />}/> */}
      </Routes>
      <Home index />
      <About />
      <Portfolio />
      <Contact />
      {/* <div id="circle" class="circle"></div> */}
   </div>
   

      
      
      
   </BrowserRouter>
  )
}

export default App
