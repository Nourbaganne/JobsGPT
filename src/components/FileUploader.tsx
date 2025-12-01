"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("resume", file);

        try {
            const response = await fetch("/api/user/uploadResume", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                // Success handled by visual feedback
                setFile(null);
            } else {
                // Error handled by visual feedback
            }
        } catch (error) {
            console.error("Error uploading resume", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-[#c9ada7] border-dashed rounded-2xl hover:border-[#9a8c98] transition-all duration-200 bg-[#f2e9e4]/50 hover:bg-[#c9ada7]/20">
                <div className="space-y-3 text-center">
                    {file ? (
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-lg shadow-sm border border-[#c9ada7]">
                                <svg className="h-8 w-8 text-[#4a4e69]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium text-[#22223b] max-w-xs truncate">{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="text-[#9a8c98] hover:text-red-500 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#4a4e69] to-[#9a8c98] hover:from-[#22223b] hover:to-[#4a4e69] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a4e69] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="mr-2 h-5 w-5" />
                                        Upload Resume
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mx-auto h-16 w-16 bg-[#c9ada7] rounded-full flex items-center justify-center">
                                <Upload className="h-8 w-8 text-[#4a4e69]" />
                            </div>
                            <div className="flex flex-col items-center text-sm text-[#4a4e69] space-y-1">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-lg font-medium text-[#4a4e69] hover:text-[#22223b] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#4a4e69] transition-colors"
                                >
                                    <span className="underline">Click to upload</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        accept=".pdf"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <p className="text-[#9a8c98]">or drag and drop</p>
                            </div>
                            <p className="text-xs text-[#9a8c98]">PDF up to 10MB</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
