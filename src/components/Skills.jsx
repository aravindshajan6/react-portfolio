import React from 'react'
import { skills } from '../data'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import VisibilitySensor from "react-visibility-sensor";
//d3-ease
// import { render } from "react-dom";
// import { easeQuadInOut } from "d3-ease";
// import AnimatedProgressProvider from "./AnimatedProgressProvider.jsx";
// import ChangingProgressProvider from "./ChangingProgressProvider.jsx";


const Skills = () => {
  return (
    <> 
    {
    skills.map(({title, percentage}, index) => {
        return(
            <div className="progress__box" key={index}>
                <div className="progress__circle">
                <VisibilitySensor>
    

                    {({ isVisible }) => {
                        const percentage1 = isVisible ? percentage : 0;
                    return (
                <       CircularProgressbar strokeWidth={5.5}          text={percentage1+'%'} value={percentage1} />);
            }}


          </VisibilitySensor>
                    
                </div>

                <h3 className="skills__title">{title}</h3>
            </div>
            )
    })
    }
    </>
  )
}

export default Skills