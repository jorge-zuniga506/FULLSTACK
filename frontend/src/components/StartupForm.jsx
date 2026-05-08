import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PersonalInfo from './PersonalInfo';
import InvestmentThesis from './InvestmentThesis';
import Sectors from './Sectors';
import Portfolio from './Portfolio';
import "../styles/StartupForm.css";

function StartupForm() {
    return (
        <div className="dashboard-container">
            <Sidebar />

            <main className="main-content">
                <Header />

                <div className="profile-section">
                    <PersonalInfo />
                    <InvestmentThesis />
                    <Sectors />
                    <Portfolio />
                </div>
            </main>
        </div>
    );
}

export default StartupForm;
