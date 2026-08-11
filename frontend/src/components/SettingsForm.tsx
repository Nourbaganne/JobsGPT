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
            <div className="flex items-center justify-center gap-2 py-10">
                <span className="spinner text-dim" aria-hidden="true" />
                <span className="eyebrow">LOADING SETTINGS</span>
            </div>
        );
    }

    return (
        <>
            {notification && (
                <div
                    role="status"
                    className={`alert mb-6 ${
                        notification.type === 'success' ? 'alert--ok' : 'alert--error'
                    }`}
                >
                    {notification.type === 'success' ? (
                        <CheckCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                        <X className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    )}
                    <p className="min-w-0 flex-1">{notification.message}</p>
                    <button
                        onClick={() => setNotification(null)}
                        className="btn btn--ghost shrink-0 p-0 text-current"
                        aria-label="Dismiss"
                    >
                        <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                </div>
            )}

            <div className="space-y-6">
                {/* Resume — the record everything else is scored against. */}
                <section className="panel overflow-hidden">
                    <div className="panel__header">
                        <span>RESUME</span>
                    </div>
                    <div className="panel__body">
                        <p className="text-body-sm max-w-[64ch] text-muted">
                            Every opening is scored against this file. Replace it whenever it changes.
                        </p>
                        <div className="mt-6">
                            <FileUploader />
                        </div>
                    </div>
                </section>

                {/* Search preferences — the only hue here is azure, on submit. */}
                <section className="panel overflow-hidden">
                    <div className="panel__header">
                        <span>SEARCH PREFERENCES</span>
                    </div>
                    <form onSubmit={handleSave}>
                        <div className="panel__body">
                            <p className="text-body-sm max-w-[64ch] text-muted">
                                Keywords narrow what the scan brings back.
                            </p>

                            <div className="field mt-6">
                                <label htmlFor="keywords" className="label">
                                    Keywords (comma separated)
                                </label>
                                <textarea
                                    id="keywords"
                                    name="keywords"
                                    rows={5}
                                    className="input resize-none"
                                    placeholder="react, next.js, typescript, node.js, python"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                />
                                <p className="text-body-sm text-dim">
                                    Separate multiple keywords with commas. These will be used to find relevant job postings.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-line px-6 py-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn--primary"
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner" aria-hidden="true" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Settings"
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </>
    );
}
