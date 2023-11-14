import React, { useEffect, useState } from 'react'
import { themes } from '../data'
import ThemeItem from './ThemeItem'
import { FaPaintBrush } from 'react-icons/fa'
import {BsSun, BsMoon} from 'react-icons/bs'
import './themes.css'

//remembering color
const getStorageColor = () => {
    let color = 'hsl(252, 46.666666666666664%, 29.411764705882355%)';
    if(localStorage.getItem('color')) {
         color = localStorage.getItem('color')
    }

    return color;
}

//remembering theme
const getStorageTheme = () => {
    let theme = 'light-theme';
    if(localStorage.getItem('theme')) {
        theme = localStorage.getItem('theme')
    }

    return theme;
}


//color swithcer
const Themes = () => {
    //show switcher state
    const [showSwitcher, setShowSwitcher] = useState(false);
    //color state and get saved color from local storge
    const [color, setColor] = useState(getStorageColor);
    //dark & light modes
    const [theme, setTheme] = useState(getStorageTheme);

    const changeColor = (color) => {
        setColor(color);
    }

//theme toggler
    const toggleTheme = () => {
        if(theme === 'light-theme'){
            setTheme('dark-theme')
        }else{
            setTheme('light-theme')
        }
    }

//change theme color in css variable
    useEffect(() => {
        document.documentElement.style.setProperty('--first-color', color);
        //save color in local storage
        localStorage.setItem('color', color);
        }, [color])

 //change theme type 
    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);
     //save theme in local storage
     localStorage.setItem('theme', theme);


  return (
    <div>
        <div className={`${showSwitcher ? 'show-switcher' : ''} style__switcher `}>
            <div style={{display:'none'}} className="style__switcher-toggler" onClick={() => setShowSwitcher(!showSwitcher)}>
                <FaPaintBrush />
            </div>
            <div className="theme__toggler" onClick={toggleTheme}>
                {theme === 'light-theme' ? <BsMoon /> : <BsSun /> }
            </div>

            <h3 className="style__switcher-title">Style Switcher</h3>
            <div className="style__switcher-items">
                {themes.map((theme, index) => {
                    return(
                        <ThemeItem key={index} {...theme} changeColor={changeColor}/>

                    )
                })}

                <div className="style__switcher-close" onClick={() => setShowSwitcher(!showSwitcher)}>
                    &times;
                </div>
            </div>
        </div>

    </div>
  )
}

export default Themes