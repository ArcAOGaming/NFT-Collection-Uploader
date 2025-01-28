import React from 'react';
import './App.css';
import { WalletProvider } from './context/WalletContext';
import ConnectWalletButton from './components/ConnectWalletButton/ConnectWalletButton';
import { Topbar } from './components/Topbar';
import { SocialLinks } from './components/SocialLinks';
import { useWallet } from './context/WalletContext';
import { NFTCollectionCreator } from './components/NFTCollectionCreator';

const AppContent: React.FC = () => {
  const { walletAddress } = useWallet();

  return (
    <div className="app-container">
      <Topbar />
      <main className="content-container">
        {!walletAddress ? (
          <div className="connect-wallet-container">
            <ConnectWalletButton />
          </div>
        ) : (
          <div className="connected-content">
            <NFTCollectionCreator />
          </div>
        )}
      </main>
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
