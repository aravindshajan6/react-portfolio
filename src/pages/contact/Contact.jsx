import React from 'react'
import {
  FaEnvelopeOpen,
  FaPhoneSquareAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaGithub
} from 'react-icons/fa';

import  { FiSend } from 'react-icons/fi'

import './contact.css'

const Contact = () => {
  return (
    <section className="contact section" id='con'>
      <h2 className="section__title">
        Contact <span>Me</span>
      </h2>

      <div className="contact__container container grid">
        <div className="contact__data">
          <h3 className="contact__title">Contact Me Here</h3>

          <p className="contact__description">Feel free to get in touch with me on any one of my socials. I am always open to new ideas and opportunities.</p>

          <div className="contact__info">
            <div className="info__item">
              <FaEnvelopeOpen className='info__icon' />

              <div>
                <span className="info__title">Mail Me</span>
                <h4 className="info__desc">aravindshajan6@gmail.com</h4>
              </div>
            </div>
          </div>

          <div className="contact__info">
            <div className="info__item">
              <FaPhoneSquareAlt className='info__icon' />

              <div>
                <span className="info__title">Call Me</span>
                <h4 className="info__desc">+91 9072016134</h4>
              </div>
            </div>
          </div>

          <div className="contact__socials">
          <a href="https://www.linkedin.com/in/aravindshajan/" className="contact__social-link"><FaLinkedinIn /></a>
            <a href="https://github.com/aravindshajan6" className="contact__social-link"><FaGithub /></a>
            {/* <a href="https://twitter.com" className="contact__social-link"><FaTwitter /></a> */}
            <a href="https://wa.me/919072016134" className="contact__social-link"><FaWhatsapp /></a>
            
            
            

          </div>
        <div>
        

        </div>
        </div>

        <form action="" className="contact__form">
          <div className="form__input-group">
            <div className="form__input-div">
              <input type="text" 
              placeholder='Your Name' className="form__control" />
            </div>
          

          <div className="form__input-div">
              <input type="email" 
              placeholder='Your email' className="form__control" />
            </div>

            <div className="form__input-div">
              <input type="text" 
              placeholder='Subject' className="form__control" />
            </div>
            </div>
          
            <div className="form__input-div">
              <textarea placeholder='Your Message' name="" id="" className='form__control textarea'></textarea>
            </div>

            <button className="button">Send Message
            <span className='button__icon contact__button-icon'><FiSend /></span></button>
        </form>

      </div>
    </section>
  )
} 

export default Contact