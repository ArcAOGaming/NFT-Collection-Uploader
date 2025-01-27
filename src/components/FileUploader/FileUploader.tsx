import { useState } from 'react';
import './FileUploader.css';
import OutlinedButton from '../OutlinedButton';

export const FileUploader = () => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const handleFolderSelect = async () => {
        try {
            // Open file picker with directory selection enabled
            const dirHandle = await window.showDirectoryPicker();
            const files: File[] = [];

            // Recursively get all files from the directory
            async function getFilesRecursively(handle: FileSystemDirectoryHandle) {
                for await (const entry of handle.values()) {
                    if (entry.kind === 'file' && entry instanceof FileSystemFileHandle) {
                        // Only process image files
                        const file = await entry.getFile();
                        if (file.type.startsWith('image/')) {
                            files.push(file);
                        }
                    } else if (entry.kind === 'directory' && entry instanceof FileSystemDirectoryHandle) {
                        await getFilesRecursively(entry);
                    }
                }
            }

            await getFilesRecursively(dirHandle);

            // Convert array to FileList-like object
            const dataTransfer = new DataTransfer();
            files.forEach(file => dataTransfer.items.add(file));
            setSelectedFiles(dataTransfer.files);

        } catch (err) {
            console.error('Error selecting folder:', err);
        }
    };

    return (
        <div className="file-uploader">
            <OutlinedButton
                text="Select Image Folder"
                onClick={handleFolderSelect}
            />
            {selectedFiles && (
                <div className="selected-files">
                    <h3>Selected Images ({selectedFiles.length})</h3>
                    <ul>
                        {Array.from(selectedFiles).map((file, index) => (
                            <li key={index}>
                                {file.name} ({Math.round(file.size / 1024)} KB)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
