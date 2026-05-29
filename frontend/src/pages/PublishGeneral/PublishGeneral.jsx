import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PublishStartup from '../../components/PublishStartup/PublishStartup';
import PublishFounders from '../../components/PublishFounders/PublishFounders';
import PublishInvestors from '../../components/PublishInvestors/PublishInvestors';
import NavbarPublish from '../../components/Navbar/NavbarPublish';  
import Publication from '../../components/Publication/Publication';
import Footer from '../../components/Footer/Footer';
import '../../styles/PublishGeneral.css';

const PublishGeneral = () => {
  const location = useLocation();
  const initialTab = location.state?.activeTab || null;
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync state if navigation changes while component is mounted
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  return (
    <>
      <NavbarPublish />
      {/* Overrides root constraints to render the layout beautifully across screens */}
      <style>{`#root{width:100%!important;max-width:100%!important;margin:0!important;border:none!important;display:block!important;}`}</style>

      {!activeTab ? (
        <div className="publish-select-screen">
          <Publication onSelectCard={setActiveTab} />
        </div>
      ) : (
        <div className="publish-startup-page">
          <div className="publish-startup-container">
            {/* Header wrapper with back button and active tabs */}
            <div className="ps-header-wrapper">
              <button 
                type="button" 
                className="ps-back-btn"
                onClick={() => setActiveTab(null)}
              >
                &larr; Volver
              </button>
              <div className="ps-tabs">
                <button
                  type="button"
                  className={`ps-tab ${activeTab === 'startup' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab('startup')}
                >
                  Registro Startup
                </button>
                <button
                  type="button"
                  className={`ps-tab ${activeTab === 'founder' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab('founder')}
                >
                  Registro Founder
                </button>
                <button
                  type="button"
                  className={`ps-tab ${activeTab === 'investor' ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab('investor')}
                >
                  Registro Inversionista
                </button>
              </div>
            </div>

            {/* ─── FORMULARIO SELECCIONADO (RENDER MODULAR) ─── */}
            {activeTab === 'startup' && (
              <PublishStartup isSubcomponent={true} />
            )}

            {activeTab === 'founder' && (
              <PublishFounders activeTab={null} onTabChange={null} />
            )}

            {activeTab === 'investor' && (
              <PublishInvestors activeTab={null} onTabChange={null} />
            )}
          </div>
        </div>
      )}
      
      {/* Universal Footer */}
      <Footer />
    </>
  );
};

export default PublishGeneral;
