import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUploader.css';

interface FileUploaderProps {
    width?: string;
    height?: string;
    label: string;
    multiple?: boolean;
    onFilesChange: (files: File[]) => void;
    showFileList?: boolean;
    accept?: Record<string, string[]>;
    circular?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    width = '100%',
    height = 'auto',
    label,
    multiple = false,
    onFilesChange,
    showFileList = true,
    accept = { 'image/*': [] },
    circular = false
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = multiple ? acceptedFiles : [acceptedFiles[0]];
        setSelectedFiles(newFiles);
        onFilesChange(newFiles);
    }, [multiple, onFilesChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
        maxFiles: multiple ? undefined : 1,
        maxSize: 10485760, // 10MB in bytes
        onDropRejected: (fileRejections) => {
            fileRejections.forEach(({ file, errors }) => {
                if (errors[0]?.code === 'file-too-large') {
                    console.error(`File ${file.name} is too large. Max size is 10MB`);
                }
            });
        }
    });

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        onFilesChange(newFiles);
    };

    const style = {
        width,
        height: height === 'auto' ? 'auto' : height
    };

    return (
        <div className="file-uploader" style={style}>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${circular ? 'circular' : ''}`}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop {multiple ? 'files' : 'file'} here ...</p>
                ) : (
                    <p>{label}</p>
                )}
            </div>
            {showFileList && selectedFiles.length > 0 && (
                <div className="selected-files">
                    <h3>Selected {multiple ? 'Files' : 'File'} ({selectedFiles.length})</h3>
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>
                                {file.name} ({Math.round(file.size / 1024)} KB)
                                <button
                                    className="remove-file"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
