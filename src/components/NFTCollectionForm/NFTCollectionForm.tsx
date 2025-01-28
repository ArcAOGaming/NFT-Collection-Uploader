import React, { useState } from 'react';
import { TextInput } from '../TextInput';
import { FileUploader } from '../FileUploader';
import { NFTCollectionFormData } from './types';
import './NFTCollectionForm.css';

interface NFTCollectionFormProps {
    onPrevious: () => void;
    onComplete: (data: {
        title: string;
        description: string;
        bannerImage: File | null;
        thumbnailImage: File | null;
    }) => void;
}

export const NFTCollectionForm: React.FC<NFTCollectionFormProps> = ({ onPrevious, onComplete }) => {
    const [formData, setFormData] = useState<NFTCollectionFormData>({
        title: '',
        description: '',
        bannerImage: null,
        thumbnailImage: null
    });

    const handleBannerChange = (files: File[]) => {
        setFormData(prev => ({
            ...prev,
            bannerImage: files[0] || null
        }));
    };

    const handleThumbnailChange = (files: File[]) => {
        setFormData(prev => ({
            ...prev,
            thumbnailImage: files[0] || null
        }));
    };

    return (
        <div className="nft-collection-form">
            <div className="form-content">
                <div className="form-section">
                    <div className="banner-section">
                        {formData.bannerImage ? (
                            <div
                                className="banner-preview"
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, bannerImage: null }));
                                }}
                            >
                                <img
                                    src={URL.createObjectURL(formData.bannerImage)}
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
                            {formData.thumbnailImage ? (
                                <div
                                    className="thumbnail-preview"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, thumbnailImage: null }));
                                    }}
                                >
                                    <img
                                        src={URL.createObjectURL(formData.thumbnailImage)}
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
                        value={formData.title}
                        onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                        required
                        placeholder="Enter collection title"
                    />
                    <TextInput
                        label="Description"
                        value={formData.description}
                        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
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
                        onClick={() => onComplete(formData)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
