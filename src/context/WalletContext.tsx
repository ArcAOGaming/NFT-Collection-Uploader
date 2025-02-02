import React, { createContext, useContext, useState, useEffect } from 'react';

interface WalletContextType {
  walletAddress: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  connecting: false,
  connect: async () => { },
  disconnect: () => { },
  isConnected: false,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.arweaveWallet) {
        try {
          const address = await window.arweaveWallet.getActiveAddress();
          if (address) {
            setWalletAddress(address);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  const connect = async () => {
    if (!window.arweaveWallet) {
      alert('Please install ArConnect to use this feature');
      return;
    }

    try {
      setConnecting(true);
      await window.arweaveWallet.connect([
        'ACCESS_ADDRESS',
        'SIGN_TRANSACTION',
        'DISPATCH'
      ]);
      const address = await window.arweaveWallet.getActiveAddress();
      setWalletAddress(address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (window.arweaveWallet) {
      try {
        await window.arweaveWallet.disconnect();
        setWalletAddress(null);
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        connecting,
        connect,
        disconnect,
        isConnected: !!walletAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
