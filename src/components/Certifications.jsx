import React, { useState } from 'react';
import nsdcMern from "../assets/nsdcMern.png";
import entriInternship from "../assets/entriInternship.png";
import entriCourse from "../assets/entriCourse.png";
import './Certifications.css';

const Certifications = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleCardClick = (index) => {
        // Toggle active card; close if the same card is clicked
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="certifications">
            {[ 
                { src: nsdcMern, title: "NSDC Full Stack Developer" }, 
                { src: entriCourse, title: "MERN Stack Developer" }, 
                { src: entriInternship, title: "Entri Internship" }
            ].map((cert, index) => (
                <div 
                    key={index} 
                    className={`certificate-card ${activeIndex === index ? 'active' : ''}`} 
                    onClick={() => handleCardClick(index)} 
                >
                    <img
                        src={cert.src}
                        alt={cert.title}
                        className="certificate-image"
                    />
                    <h5 className="certificate-title">{cert.title}</h5>
                </div>
            ))}
        </div>
    );
};

export default Certifications;
