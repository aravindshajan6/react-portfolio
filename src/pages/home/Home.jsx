import React from 'react'
import Profile from '../../assets/home.jpg'
import {Link} from 'react-router-dom'
import  { FaArrowRight } from 'react-icons/fa' //from react-icons
import './home.css'


const Home = () => {
  
  
  return (
    <section className="home section grid" id='hom'>
      
      <img src={Profile} alt="" className="home__img" />

      <div className="home__content">
        <div className="home__data">
          <h1 className="home__title typewriter ">I'm Aravind Shajan 
          </h1><span className='job job-span '>Web Develeoper</span>

          <p className="home__description ">I'm a MERN stack developer focused on crafting clean and user friendly experiences, I am passionate about building excellent and creative content for the WEB.</p>

          <Link to={'https://github.com/aravindshajan6'} target='_blank' className='button' > {' '} Github <span className="button__icon"> <FaArrowRight/> </span>
          </Link>
        </div>
      </div>
      {/* <div id="particles-js"></div> */}
      <div className="color__block"></div>
      <div className="color__block2">
      <script src="../home/home.js"></script>

        
      </div>
    </section>
  )
}

export default Home ;