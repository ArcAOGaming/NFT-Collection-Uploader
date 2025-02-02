import React from 'react';
import { TextInput } from '../TextInput';
import { FileUploader } from '../FileUploader';
import { useCollection } from '../../context/CollectionContext';
import './NFTCollectionForm.css';

interface NFTCollectionFormProps {
    onPrevious: () => void;
    onComplete: () => void;
}

export const NFTCollectionForm: React.FC<NFTCollectionFormProps> = ({ onPrevious, onComplete }) => {
    const {
        collectionData,
        setTitle,
        setDescription,
        setBannerImage,
        setThumbnailImage
    } = useCollection();

    const handleBannerChange = (files: File[]) => {
        setBannerImage(files[0] || null);
    };

    const handleThumbnailChange = (files: File[]) => {
        setThumbnailImage(files[0] || null);
    };

    return (
        <div className="nft-collection-form">
            <div className="form-content">
                <div className="form-section">
                    <div className="banner-section">
                        {collectionData.bannerImage ? (
                            <div
                                className="banner-preview"
                                onClick={() => setBannerImage(null)}
                            >
                                <img
                                    src={URL.createObjectURL(collectionData.bannerImage)}
                                    alt="Banner Preview"
                                    className="banner-preview-image"
                                />
                                <div className="preview-overlay">
                                    <span>Click to replace</span>
                                </div>
                            </div>
                        ) : (
                            <FileUploader
                                label="Banner"
                                onFilesChange={handleBannerChange}
                                multiple={false}
                                width="100%"
                                height="300px"
                            />
                        )}
                        <div className="thumbnail-overlay">
                            {collectionData.thumbnailImage ? (
                                <div
                                    className="thumbnail-preview"
                                    onClick={() => setThumbnailImage(null)}
                                >
                                    <img
                                        src={URL.createObjectURL(collectionData.thumbnailImage)}
                                        alt="Thumbnail Preview"
                                        className="thumbnail-preview-image"
                                    />
                                    <div className="preview-overlay">
                                        <span>Click to replace</span>
                                    </div>
                                </div>
                            ) : (
                                <FileUploader
                                    label="Thumbnail"
                                    onFilesChange={handleThumbnailChange}
                                    multiple={false}
                                    width="100px"
                                    height="100px"
                                    circular={true}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <TextInput
                        label="Collection Title"
                        value={collectionData.title}
                        onChange={setTitle}
                        required
                        placeholder="Enter collection title"
                    />
                    <TextInput
                        label="Description"
                        value={collectionData.description}
                        onChange={setDescription}
                        multiline
                        placeholder="Enter collection description"
                    />
                </div>

                <div className="navigation-buttons">
                    <button className="navigation-button" onClick={onPrevious}>
                        Previous
                    </button>
                    <button
                        className="navigation-button"
                        onClick={onComplete}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
