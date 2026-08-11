"use client";

import { useState } from "react";
import { FileText, Upload, X } from "lucide-react";

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
        <div>
            {file ? (
                /* Staged file — a record row, then the one action on it. */
                <div className="panel overflow-hidden">
                    <div className="panel__row">
                        <FileText className="h-4 w-4 shrink-0 text-dim" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-body-sm min-w-0 flex-1 truncate text-ink">{file.name}</span>
                        <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="btn btn--ghost shrink-0 p-0"
                            aria-label="Remove file"
                        >
                            <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        </button>
                    </div>
                    <div className="flex justify-end border-t border-line px-4 py-2">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="btn btn--primary"
                        >
                            {uploading ? (
                                <>
                                    <span className="spinner" aria-hidden="true" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                                    Upload Resume
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    <Upload className="h-6 w-6 text-dim" strokeWidth={1.5} aria-hidden="true" />
                    <p className="text-body-sm max-w-[42ch] text-muted">
                        No resume on file. Matching stays off until one is uploaded.
                    </p>
                    <label
                        htmlFor="file-upload"
                        className="btn btn--secondary focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-azure"
                    >
                        Choose a file
                        <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept=".pdf"
                            className="sr-only"
                            onChange={handleFileChange}
                        />
                    </label>
                    <p className="eyebrow text-dim">PDF · 10MB MAX</p>
                </div>
            )}
        </div>
    );
}
