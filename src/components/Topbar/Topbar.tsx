import React from 'react';
import ConnectWalletButton from '../ConnectWalletButton';
import './Topbar.css';

export const Topbar: React.FC = () => {

  return (
    <div className="topbar">
      <div className="logo-link">
        <img src="/arcao.png" alt="ArcAO Logo" className="topbar-logo" />
      </div>
      <div className="walletSection">
        <ConnectWalletButton />
      </div>
    </div>
  );
};
