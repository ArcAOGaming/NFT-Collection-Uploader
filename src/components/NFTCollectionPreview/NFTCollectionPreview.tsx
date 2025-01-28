import React from 'react';
import './NFTCollectionPreview.css';

interface NFTCollectionPreviewProps {
    bannerImage: File | null;
    thumbnailImage: File | null;
    title: string;
    description: string;
    collectionImages: File[];
    onPrevious: () => void;
    onComplete: () => void;
}

export const NFTCollectionPreview: React.FC<NFTCollectionPreviewProps> = ({
    bannerImage,
    thumbnailImage,
    title,
    description,
    collectionImages,
    onPrevious,
    onComplete
}) => {
    return (
        <div className="nft-collection-preview">
            <div className="preview-banner-section">
                <div className="preview-banner">
                    {bannerImage && (
                        <img
                            src={URL.createObjectURL(bannerImage)}
                            alt="Collection Banner"
                            className="banner-image"
                        />
                    )}
                    <div className="preview-thumbnail">
                        {thumbnailImage && (
                            <img
                                src={URL.createObjectURL(thumbnailImage)}
                                alt="Collection Thumbnail"
                                className="thumbnail-image"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="preview-content">
                <div className="preview-details">
                    <h2 className="preview-title">{title}</h2>
                    <p className="preview-description">{description}</p>
                </div>

                <div className="preview-assets">
                    <h3>Collection Assets ({collectionImages.length})</h3>
                    <ul className="assets-list">
                        {collectionImages.map((file, index) => (
                            <li key={index} className="asset-item">
                                <span className="asset-name">{file.name}</span>
                                <span className="asset-size">
                                    {Math.round(file.size / 1024)} KB
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="navigation-buttons">
                <button className="navigation-button" onClick={onPrevious}>
                    Previous
                </button>
                <button
                    className="navigation-button"
                    onClick={onComplete}
                >
                    Create Collection
                </button>
            </div>
        </div>
    );
};
