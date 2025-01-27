import React from 'react';
import './App.css';
import { WalletProvider } from './context/WalletContext';
import ConnectWalletButton from './components/ConnectWalletButton';
import { Topbar } from './components/Topbar';
import { SocialLinks } from './components/SocialLinks';
import { useWallet } from './context/WalletContext';
import { FileUploader } from './components/FileUploader';

const AppContent: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="app-container">
      <Topbar />
      <div className="content-container">
        {!isConnected ? (
          <ConnectWalletButton />
        ) : (
          <div className="connected-content">
            <FileUploader />
          </div>
        )}
      </div>
      <SocialLinks />
    </div>
  );
};

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;
