import React, { useState } from 'react';
import OutlinedButton from '../OutlinedButton';
import './ConnectWalletButton.css';
import { useWallet } from '../../context/WalletContext';

const ConnectWalletButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { walletAddress, connecting, connect, disconnect } = useWallet();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Address copied to clipboard');
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleClick = async () => {
    if (walletAddress) {
      await disconnect();
    } else {
      setIsLoading(true);
      try {
        await connect();
      } catch (error) {
        console.error('Connection error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (walletAddress) {
    return (
      <OutlinedButton
        text={shortenAddress(walletAddress)}
        onClick={() => copyToClipboard(walletAddress)}
      />
    );
  }

  return (
    <OutlinedButton
      text={connecting || isLoading ? "Connecting..." : "Connect Wallet"}
      onClick={handleClick}
      disabled={connecting || isLoading}
    />
  );
};

export default ConnectWalletButton;
