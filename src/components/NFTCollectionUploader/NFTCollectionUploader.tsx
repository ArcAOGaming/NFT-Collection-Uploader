import React, { useState, useEffect } from 'react';
import { NFTCollectionBuilder, Collection, AtomicAsset } from 'arcao-nft-collection-builder';
import { LoadingSpinner } from '../LoadingSpinner';
import './NFTCollectionUploader.css';

interface NFTCollectionUploaderProps {
    title: string;
    description: string;
    collectionImages: File[];
    bannerImage: File | null;
    thumbnailImage: File | null;
    walletAddress: string;
    onComplete: () => void;
}

type UploadStep = 'profile' | 'collection' | 'assets' | 'update' | 'complete';

// Convert ArrayBuffer to base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const convertToBase64DataUrl = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const arrayBuffer = reader.result as ArrayBuffer;
                const base64String = arrayBufferToBase64(arrayBuffer);
                const dataUrl = `data:image/png;base64,${base64String}`;
                resolve(dataUrl);
            } catch (err) {
                reject(new Error('Failed to convert file to base64'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
};

export const NFTCollectionUploader: React.FC<NFTCollectionUploaderProps> = ({
    title,
    description,
    collectionImages,
    bannerImage,
    thumbnailImage,
    walletAddress,
    onComplete
}) => {
    const [currentStep, setCurrentStep] = useState<UploadStep>('profile');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [collectionId, setCollectionId] = useState<string | null>(null);

    useEffect(() => {
        const uploadCollection = async () => {
            try {
                const builder = new NFTCollectionBuilder();

                // Step 1: Set Collection Details
                setCurrentStep('profile');

                // Convert banner and thumbnail to base64
                let banner = '';
                let thumbnail = '';

                try {
                    if (bannerImage) {
                        banner = await convertToBase64DataUrl(bannerImage);
                        console.log('Banner image processed successfully');
                    }

                    if (thumbnailImage) {
                        thumbnail = await convertToBase64DataUrl(thumbnailImage);
                        console.log('Thumbnail image processed successfully');
                    } else if (collectionImages.length > 0) {
                        // Use first collection image as thumbnail if none provided
                        thumbnail = await convertToBase64DataUrl(collectionImages[0]);
                        console.log('Using first collection image as thumbnail');
                    }
                } catch (err) {
                    console.error('Error processing banner/thumbnail:', err);
                    throw new Error('Failed to process banner or thumbnail images');
                }

                const collection: Collection = {
                    title,
                    description,
                    creator: "Z11o-F2kTQ6FBMp2eLdsYLvfhHJUG6_FLOASM_Ek9eQ",
                    thumbnail,
                    banner
                };

                console.log('Setting collection details with:', {
                    title,
                    description,
                    hasBanner: banner,
                    hasThumbnail: thumbnail
                });

                builder.setCollectionDetails(collection);

                // Step 2: Create and Add Assets
                setCurrentStep('assets');
                const assets: AtomicAsset[] = await Promise.all(
                    collectionImages.map(async (file, index) => {
                        try {
                            const dataUrl = await convertToBase64DataUrl(file);
                            const asset: AtomicAsset = {
                                // @ts-ignore
                                name: file.name,
                                description: `${title} - ${file.name}`,
                                topics: ['NFT', 'Collection'],
                                data: dataUrl,
                                contentType: 'image/png',
                                type: 'NFT',
                                creator: "Z11o-F2kTQ6FBMp2eLdsYLvfhHJUG6_FLOASM_Ek9eQ"
                            };
                            setProgress((index + 1) / collectionImages.length * 100);
                            return asset;
                        } catch (err) {
                            console.error(`Error processing asset ${file.name}:`, err);
                            throw new Error(`Failed to process asset: ${file.name}`);
                        }
                    })
                );

                console.log(`Successfully processed ${assets.length} assets`);
                builder.addAtomicAssets(assets);

                // Step 3: Build Collection
                setCurrentStep('update');
                const processId = await builder.build();
                setCollectionId(processId);

                // Complete
                setCurrentStep('complete');
                onComplete();

            } catch (err) {
                console.error('Collection upload error:', err);
                setError(err instanceof Error ? err.message : 'An error occurred during upload');
            }
        };

        uploadCollection();
    }, [title, description, collectionImages, bannerImage, thumbnailImage, walletAddress, onComplete]);

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
                {currentStep !== 'complete' ? (
                    <>
                        <LoadingSpinner size={60} />
                        <h2>{getStepText()}</h2>
                        {error && <div className="upload-error">{error}</div>}
                    </>
                ) : (
                    <div className="upload-complete">
                        <h2>Collection Created Successfully!</h2>
                        <a
                            href={`https://bazar.arweave.net/#/collection/${collectionId}/assets/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="collection-link"
                        >
                            View Collection
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};
