import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { links } from '../data'
import './navbar.css'

const Navbar = () => {
const [showMenu, setShowMenu] = useState(false);

//scroll to component
function movePosi(val) {
  var element = document.getElementById(`${val}`);
  element.scrollIntoView({behavior: 'smooth'});
}

function blinkJob () {
  // function body
  
}
Window.onload = blinkJob();

  return (
    <nav className="nav">
      <div className={`${showMenu ? 'nav__menu show-menu' : 'nav__menu'}`}>
        <ul className="nav__list">
            {links.map(({name, icon, path, id}, index) =>{
              return(
                // <li className="nav__item" key={index}>
                //   <NavLink to={path} className={({isActive}) => isActive ? 'nav__link active-nav' : 'nav__link'}
                  
                //   onClick={() => setShowMenu(!showMenu)}
                //   >
                //     {icon}
                //     <h3 className="nav__name">{name}</h3>
                //   </NavLink>
                // </li>
                <li className="nav__item" key={index}>
                  <button to={path} onClick={() => (movePosi(id), setShowMenu(!showMenu))}  className=' nav__link'
                  
                  // onClick={() => setShowMenu(!showMenu)}
                  >
                    {icon}
                    <h3 className="nav__name">{name}</h3>
                  </button>
                </li>
              )
            })}
        </ul>
      </div>

      <div className={`${showMenu ? 'nav__toggle animate-toggle' : 'nav__toggle'}`} onClick={() => setShowMenu(!showMenu)}>
          <span></span>
          <span></span>
          <span></span>
      </div>


    </nav>

  )
}

export default Navbar