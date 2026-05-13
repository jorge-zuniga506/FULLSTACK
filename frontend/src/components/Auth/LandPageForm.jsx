import React from 'react';
import LandPageNavbar from '../landpage/LandPageNavbar';
import LandPageHero from '../landpage/LandPageHero';
import LandPageBenefits from '../landpage/LandPageBenefits';
import LandPageCTA from '../landpage/LandPageCTA';
import LandPageFooter from '../landpage/LandPageFooter';
import '../../styles/LandPage.css';

function LandPageForm() {
  return (
    <div className="startup-theme">
      <LandPageNavbar />
      <LandPageHero />
      <LandPageBenefits />
      <LandPageCTA />
      <LandPageFooter />
    </div>
  );
}

export default LandPageForm;



