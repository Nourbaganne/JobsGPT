"use client";

import { useState, useCallback } from "react";
import { Upload, X, CheckCircle, FileText } from "lucide-react";

interface NotificationState {
    type: 'success' | 'error';
    message: string;
}

export default function ResumeUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState<NotificationState | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setNotification(null);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
                setNotification(null);
            } else {
                setNotification({ type: 'error', message: 'Please upload a PDF file.' });
            }
        }
    }, []);

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setNotification(null);

        const formData = new FormData();
        formData.append("resume", file);

        try {
            // TODO: Update endpoint when backend route is implemented
            const response = await fetch("/api/user/resume", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setNotification({ type: 'success', message: 'Resume uploaded successfully!' });
                setFile(null);
            } else {
                setNotification({ type: 'error', message: 'Failed to upload resume. Please try again.' });
            }
        } catch (error) {
            console.error("Error uploading resume", error);
            setNotification({ type: 'error', message: 'Error uploading resume. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setNotification(null);
    };

    return (
        <div className="space-y-4">
            {notification && (
                <Notification 
                    notification={notification} 
                    onClose={() => setNotification(null)} 
                />
            )}
            
            <div 
                className={`mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-dashed rounded-2xl transition-all duration-200 ${
                    isDragging 
                        ? 'border-[#5b6fa3] bg-[#b8c5d6]/30' 
                        : 'border-[#b8c5d6] hover:border-[#5b6fa3] bg-[#e8eef5]/50 hover:bg-[#b8c5d6]/20'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="space-y-3 text-center">
                    {file ? (
                        <SelectedFile 
                            fileName={file.name} 
                            onClear={clearFile} 
                            onUpload={handleUpload} 
                            uploading={uploading} 
                        />
                    ) : (
                        <DropZoneContent onFileChange={handleFileChange} />
                    )}
                </div>
            </div>
        </div>
    );
}

interface NotificationProps {
    notification: NotificationState;
    onClose: () => void;
}

function Notification({ notification, onClose }: NotificationProps) {
    return (
        <div className={`rounded-xl p-4 border-2 animate-slide-in ${
            notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
        }`}>
            <div className="flex items-center">
                {notification.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-3 shrink-0" />
                ) : (
                    <X className="h-5 w-5 mr-3 shrink-0" />
                )}
                <p className="font-semibold text-sm">{notification.message}</p>
                <button
                    onClick={onClose}
                    className="ml-auto text-gray-400 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

interface SelectedFileProps {
    fileName: string;
    onClear: () => void;
    onUpload: () => void;
    uploading: boolean;
}

function SelectedFile({ fileName, onClear, onUpload, uploading }: SelectedFileProps) {
    return (
        <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-lg shadow-sm border border-[#b8c5d6]">
                <FileText className="h-8 w-8 text-[#5b6fa3]" />
                <span className="text-sm font-medium text-[#22223b] max-w-xs truncate">
                    {fileName}
                </span>
                <button
                    type="button"
                    onClick={onClear}
                    className="text-[#5b6fa3] hover:text-red-500 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            <UploadButton onClick={onUpload} uploading={uploading} />
        </div>
    );
}

interface UploadButtonProps {
    onClick: () => void;
    uploading: boolean;
}

function UploadButton({ onClick, uploading }: UploadButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={uploading}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[#22223b] hover:bg-[#2d3047] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5b6fa3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
            {uploading ? (
                <>
                    <LoadingSpinner />
                    Uploading...
                </>
            ) : (
                <>
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Resume
                </>
            )}
        </button>
    );
}

function LoadingSpinner() {
    return (
        <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
        >
            <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
            />
            <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

interface DropZoneContentProps {
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DropZoneContent({ onFileChange }: DropZoneContentProps) {
    return (
        <>
            <div className="mx-auto h-16 w-16 bg-[#b8c5d6] rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-[#22223b]" />
            </div>
            <div className="flex flex-col items-center text-sm text-[#4a4e69] space-y-1">
                <label
                    htmlFor="resume-upload"
                    className="relative cursor-pointer rounded-lg font-medium text-[#5b6fa3] hover:text-[#22223b] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#5b6fa3] transition-colors"
                >
                    <span className="underline">Click to upload</span>
                    <input
                        id="resume-upload"
                        name="resume-upload"
                        type="file"
                        accept=".pdf"
                        className="sr-only"
                        onChange={onFileChange}
                    />
                </label>
                <p className="text-[#5b6fa3]/70">or drag and drop</p>
            </div>
            <p className="text-xs text-[#5b6fa3]/70">PDF up to 10MB</p>
        </>
    );
}
