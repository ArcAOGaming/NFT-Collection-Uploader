import React, { useState, useEffect } from 'react';
import Arweave from 'arweave';
import { connect, createDataItemSigner } from '@permaweb/aoconnect';
import Permaweb from "@permaweb/libs";
import { LoadingSpinner } from '../LoadingSpinner';
import './NFTCollectionUploader.css';

interface NFTCollectionUploaderProps {
    title: string;
    description: string;
    collectionImages: File[];
    walletAddress: string;
    onComplete: () => void;
}

type UploadStep = 'profile' | 'collection' | 'assets' | 'update' | 'complete';

export const NFTCollectionUploader: React.FC<NFTCollectionUploaderProps> = ({
    title,
    description,
    collectionImages,
    walletAddress,
    onComplete
}) => {
    const [currentStep, setCurrentStep] = useState<UploadStep>('profile');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Store IDs for final collection update
    const [collectionId, setCollectionId] = useState<string>('');
    const [assetIds, setAssetIds] = useState<string[]>([]);

    useEffect(() => {
        const uploadCollection = async () => {
            try {
                // Initialize Permaweb
                const wallet = window.arweaveWallet;
                const permaweb = new Permaweb.init({
                    ao: connect(),
                    arweave: Arweave.init(),
                    signer: createDataItemSigner(wallet),
                });

                // Step 1: Get Profile
                setCurrentStep('profile');
                const profile = await permaweb.getProfileByWalletAddress(walletAddress);

                // Step 2: Create Collection
                setCurrentStep('collection');
                const newCollectionId = await permaweb.createCollection({
                    title,
                    description,
                    creator: profile.id,
                });
                setCollectionId(newCollectionId);

                // Step 3: Create NFTs
                setCurrentStep('assets');
                const newAssetIds: string[] = [];
                for (let i = 0; i < collectionImages.length; i++) {
                    const file = collectionImages[i];
                    const assetId = await permaweb.createAtomicAsset({
                        name: file.name,
                        description: `${title} - ${file.name}`,
                        topics: ['NFT', 'Collection'],
                        creator: walletAddress,
                        data: await file.arrayBuffer(),
                        contentType: file.type,
                        assetType: 'NFT',
                        metadata: {
                            status: 'Initial',
                        },
                    });
                    newAssetIds.push(assetId);
                    setProgress((i + 1) / collectionImages.length * 100);
                }
                setAssetIds(newAssetIds);

                // Step 4: Update Collection with Assets
                setCurrentStep('update');
                await permaweb.updateCollectionAssets({
                    collectionId: newCollectionId,
                    assetIds: newAssetIds,
                    creator: walletAddress,
                    updateType: 'Add',
                });

                // Complete
                setCurrentStep('complete');
                onComplete();

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        };

        uploadCollection();
    }, [title, description, collectionImages, walletAddress, onComplete]);

    const getStepText = () => {
        switch (currentStep) {
            case 'profile':
                return 'Getting Profile...';
            case 'collection':
                return 'Creating Collection...';
            case 'assets':
                return `Uploading Assets... ${Math.round(progress)}%`;
            case 'update':
                return 'Finalizing Collection...';
            case 'complete':
                return 'Upload Complete!';
            default:
                return '';
        }
    };

    return (
        <div className="nft-collection-uploader">
            <div className="upload-status">
                <LoadingSpinner size={60} />
                <h2>{getStepText()}</h2>
                {error && <div className="upload-error">{error}</div>}
            </div>
        </div>
    );
};
