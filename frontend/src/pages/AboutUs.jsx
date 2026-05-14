import React from 'react'
import LandPageNavbar from '../components/landpage/LandPageNavbar'
import LandPageAboutUs from '../components/landpage/LandPageAboutUs'
import LandPageFooter from '../components/landpage/LandPageFooter'
import '../styles/LandPage.css'

function AboutUs() {
  return (
    <div className="startup-theme">
      <LandPageNavbar />
      <LandPageAboutUs />
      <LandPageFooter />
    </div>
  )
}

export default AboutUs