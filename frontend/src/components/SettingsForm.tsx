"use client";

import ResumeUploader from "./ResumeUploader";

export default function SettingsForm() {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-[#b8c5d6]/30 overflow-hidden">
            <div className="px-6 py-10 sm:px-8">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#22223b]">
                        Resume Upload
                    </h3>
                    <p className="mt-2 text-base text-[#4a4e69]">
                        Upload your resume to help us match you with relevant job opportunities.
                    </p>
                </div>
                <ResumeUploader />
            </div>
        </div>
    );
}
