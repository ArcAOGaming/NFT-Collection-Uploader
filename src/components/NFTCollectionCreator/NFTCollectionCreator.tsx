import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { FileUploader } from '../FileUploader';
import { NFTCollectionForm } from '../NFTCollectionForm';
import { NFTCollectionPreview } from '../NFTCollectionPreview';
import { NFTCollectionUploader } from '../NFTCollectionUploader';
import './NFTCollectionCreator.css';

interface CollectionData {
    title: string;
    description: string;
    bannerImage: File | null;
    thumbnailImage: File | null;
}

export const NFTCollectionCreator: React.FC = () => {
    const { walletAddress } = useWallet();
    const [step, setStep] = useState<'upload' | 'form' | 'preview' | 'uploading'>('upload');
    const [collectionImages, setCollectionImages] = useState<File[]>([]);
    const [collectionData, setCollectionData] = useState<CollectionData>({
        title: '',
        description: '',
        bannerImage: null,
        thumbnailImage: null
    });

    const handleFilesChange = (files: File[]) => {
        setCollectionImages(files);
    };

    const handleNext = () => {
        if (collectionImages.length > 0) {
            setStep('form');
        }
    };

    const handlePrevious = () => {
        if (step === 'form') {
            setStep('upload');
        } else if (step === 'preview') {
            setStep('form');
        }
    };

    const handleFormComplete = (data: CollectionData) => {
        setCollectionData(data);
        setStep('preview');
    };

    const handleCreateCollection = () => {
        setStep('uploading');
    };

    const handleUploadComplete = () => {
        // Handle completion, e.g., redirect or show success message
        console.log('Upload complete');
    };

    return (
        <div className="nft-collection-creator">
            <h1 className="creator-title">
                {step === 'upload' ? 'Upload Collection Images' :
                    step === 'form' ? 'Collection Details' :
                        step === 'preview' ? 'Preview Collection' :
                            'Creating Collection'}
            </h1>
            {step === 'upload' ? (
                <div className="creator-section">
                    <div className={`upload-area ${collectionImages.length > 0 ? 'minimized' : ''}`}>
                        {!collectionImages.length && (
                            <p className="creator-description">
                                Upload the NFT images for your collection. These will be the individual NFTs that make up your collection.
                                You can upload multiple images at once.
                            </p>
                        )}
                        <FileUploader
                            label="Drag & drop PNG/JPG images here, or click to select files"
                            onFilesChange={handleFilesChange}
                            multiple={true}
                            width="100%"
                            height={collectionImages.length > 0 ? "80px" : "auto"}
                            showFileList={false}
                        />
                    </div>

                    <div className={`selected-files-area ${collectionImages.length > 0 ? 'visible' : ''}`}>
                        <div className="selected-files-content">
                            <div className="selected-files">
                                <h3>Selected Images ({collectionImages.length})</h3>
                                <ul>
                                    {collectionImages.map((file, index) => (
                                        <li key={index}>
                                            {file.name} ({Math.round(file.size / 1024)} KB)
                                            <button
                                                className="remove-file"
                                                onClick={() => {
                                                    const newFiles = collectionImages.filter((_, i) => i !== index);
                                                    setCollectionImages(newFiles);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="navigation-wrapper">
                            <button
                                className="navigation-button"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            ) : step === 'form' ? (
                <NFTCollectionForm
                    onPrevious={handlePrevious}
                    onComplete={handleFormComplete}
                />
            ) : step === 'preview' ? (
                <NFTCollectionPreview
                    bannerImage={collectionData.bannerImage}
                    thumbnailImage={collectionData.thumbnailImage}
                    title={collectionData.title}
                    description={collectionData.description}
                    collectionImages={collectionImages}
                    onPrevious={handlePrevious}
                    onComplete={handleCreateCollection}
                />
            ) : (
                <NFTCollectionUploader
                    title={collectionData.title}
                    description={collectionData.description}
                    collectionImages={collectionImages}
                    walletAddress={walletAddress || ''}
                    onComplete={handleUploadComplete}
                />
            )}
        </div>
    );
};
