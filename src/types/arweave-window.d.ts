/// <reference types="vite/client" />

declare global {
    var arweaveWallet: {
        connect(permissions: string[]): Promise<void>;
        disconnect(): Promise<void>;
        getActiveAddress(): Promise<string>;
    } | undefined;
}

declare interface Window {
    arweaveWallet: typeof globalThis.arweaveWallet;
}
