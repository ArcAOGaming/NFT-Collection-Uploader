import React, { createContext, useContext, useState } from 'react';

interface CollectionData {
    title: string;
    description: string;
    bannerImage: File | null;
    thumbnailImage: File | null;
    collectionImages: File[];
}

interface CollectionContextType {
    collectionData: CollectionData;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setBannerImage: (image: File | null) => void;
    setThumbnailImage: (image: File | null) => void;
    setCollectionImages: (images: File[]) => void;
    addCollectionImages: (images: File[]) => void;
    removeCollectionImage: (index: number) => void;
    resetCollection: () => void;
}

const initialState: CollectionData = {
    title: '',
    description: '',
    bannerImage: null,
    thumbnailImage: null,
    collectionImages: []
};

const CollectionContext = createContext<CollectionContextType>({
    collectionData: initialState,
    setTitle: () => { },
    setDescription: () => { },
    setBannerImage: () => { },
    setThumbnailImage: () => { },
    setCollectionImages: () => { },
    addCollectionImages: () => { },
    removeCollectionImage: () => { },
    resetCollection: () => { }
});

export const useCollection = () => useContext(CollectionContext);

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [collectionData, setCollectionData] = useState<CollectionData>(initialState);

    const setTitle = (title: string) => {
        setCollectionData(prev => ({ ...prev, title }));
    };

    const setDescription = (description: string) => {
        setCollectionData(prev => ({ ...prev, description }));
    };

    const setBannerImage = (bannerImage: File | null) => {
        setCollectionData(prev => ({ ...prev, bannerImage }));
    };

    const setThumbnailImage = (thumbnailImage: File | null) => {
        setCollectionData(prev => ({ ...prev, thumbnailImage }));
    };

    const setCollectionImages = (collectionImages: File[]) => {
        setCollectionData(prev => ({ ...prev, collectionImages }));
    };

    const addCollectionImages = (newImages: File[]) => {
        setCollectionData(prev => ({
            ...prev,
            collectionImages: [...prev.collectionImages, ...newImages]
        }));
    };

    const removeCollectionImage = (index: number) => {
        setCollectionData(prev => ({
            ...prev,
            collectionImages: prev.collectionImages.filter((_, i) => i !== index)
        }));
    };

    const resetCollection = () => {
        setCollectionData(initialState);
    };

    return (
        <CollectionContext.Provider
            value={{
                collectionData,
                setTitle,
                setDescription,
                setBannerImage,
                setThumbnailImage,
                setCollectionImages,
                addCollectionImages,
                removeCollectionImage,
                resetCollection
            }}
        >
            {children}
        </CollectionContext.Provider>
    );
};
