interface ArweaveWallet {
    connect: (permissions: string[]) => Promise<void>;
    disconnect: () => Promise<void>;
    getActiveAddress: () => Promise<string>;
}

declare global {
    interface Window {
        arweaveWallet?: ArweaveWallet;
    }
}
