import React from 'react';
import PublishStartup from '../../components/PublishStartup/PublishStartup';

const PublishStartupPage = () => {
  return (
    <>
      {/* Overrides root constraints to render the publish startup layout beautifully */}
      <style>{`#root{width:100%!important;max-width:100%!important;margin:0!important;border:none!important;display:block!important;}`}</style>
      <PublishStartup />
    </>
  );
};

export default PublishStartupPage;
