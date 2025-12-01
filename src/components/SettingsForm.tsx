"use client";

import { useState, useEffect } from "react";
import FileUploader from "./FileUploader";
import { CheckCircle, X } from "lucide-react";

export default function SettingsForm() {
    const [keywords, setKeywords] = useState("");
    const [refreshHours, setRefreshHours] = useState(24);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        const fetchPreferences = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/user/getPreferences");
                if (response.ok) {
                    const data = await response.json();
                    setKeywords(data.keywords || "");
                    setRefreshHours(data.refreshHours || 24);
                }
            } catch (error) {
                console.error("Error fetching preferences", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setNotification(null);
        try {
            const response = await fetch("/api/user/updateKeywords", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keywords, refreshHours }),
            });

            if (response.ok) {
                setNotification({ type: 'success', message: 'Settings saved successfully!' });
                setTimeout(() => setNotification(null), 3000);
            } else {
                setNotification({ type: 'error', message: 'Failed to save settings. Please try again.' });
            }
        } catch (error) {
            console.error("Error saving settings", error);
            setNotification({ type: 'error', message: 'Error saving settings. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex items-center space-x-3 text-gray-600">
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-base font-medium">Loading settings...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {notification && (
                <div className={`mb-6 rounded-xl p-4 border-2 animate-slide-in ${
                    notification.type === 'success' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    <div className="flex items-center">
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                        ) : (
                            <X className="h-5 w-5 mr-3 flex-shrink-0" />
                        )}
                        <p className="font-semibold text-sm">{notification.message}</p>
                        <button
                            onClick={() => setNotification(null)}
                            className="ml-auto text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
            <div className="bg-white rounded-2xl shadow-lg border border-[#c9ada7]/30 divide-y divide-[#c9ada7]/30 overflow-hidden">
                <div className="px-6 py-10 sm:px-8">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-[#22223b]">
                            Resume Upload
                        </h3>
                        <p className="mt-2 text-base text-[#4a4e69]">
                            Upload your resume to help us match you with relevant job opportunities.
                        </p>
                    </div>
                    <FileUploader />
                </div>

                <div className="px-6 py-10 sm:px-8">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-[#22223b] mb-2">
                                Search Preferences
                            </h3>
                            <p className="text-base text-[#4a4e69] mb-8">
                                Customize your job search by adding keywords that match your skills and interests.
                            </p>
                            <label
                                htmlFor="keywords"
                                className="block text-sm font-semibold text-[#22223b] mb-3"
                            >
                                Keywords (comma separated)
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="keywords"
                                    name="keywords"
                                    rows={5}
                                    className="shadow-sm focus:ring-2 focus:ring-[#4a4e69] focus:border-[#4a4e69] block w-full sm:text-sm border-[#c9ada7] rounded-xl p-4 border bg-[#f2e9e4] focus:bg-white transition-all duration-200 resize-none text-[#22223b]"
                                    placeholder="react, next.js, typescript, node.js, python"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                />
                                <p className="mt-3 text-sm text-[#4a4e69]">
                                    Separate multiple keywords with commas. These will be used to find relevant job postings.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-[#c9ada7]/30">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent shadow-lg text-base font-semibold rounded-xl text-white bg-gradient-to-r from-[#4a4e69] to-[#9a8c98] hover:from-[#22223b] hover:to-[#4a4e69] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a4e69] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Settings"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
