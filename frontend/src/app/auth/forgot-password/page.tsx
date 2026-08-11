"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { api } from "@/lib/api";

/* Single-column auth shell — wordmark, then one panel. Same surface ladder as
   the landing page: canvas behind, panel in front, hairlines instead of shadow. */
function AuthShell({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-canvas py-10">
            <div className="container-prose">
                <div className="mx-auto w-full max-w-[440px]">
                    <Link href="/" className="display text-h3 inline-block text-ink">
                        Lynceus
                    </Link>
                    <div className="mt-6">{children}</div>
                </div>
            </div>
        </main>
    );
}

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [resetUrl, setResetUrl] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const response = await api.forgotPassword(email);

        if (response.success && response.data) {
            setSuccess(true);
            // In development, show the reset URL
            if (response.data.resetUrl) {
                setResetUrl(response.data.resetUrl);
            }
        } else {
            setError(response.error || "Something went wrong");
        }

        setLoading(false);
    };

    /* Hues here: mint reports the send, azure carries the one link worth
       clicking. Nothing else is tinted. */
    if (success) {
        return (
            <AuthShell>
                <div className="panel overflow-hidden">
                    <div className="panel__header">
                        <span>PASSWORD RESET</span>
                        <span className="chip chip--live">SENT</span>
                    </div>

                    <div className="panel__body">
                        <h1 className="display text-h3 text-ink">Check your email</h1>

                        <div className="alert alert--ok mt-4" role="status">
                            <span>
                                If an account exists with {email}, you will receive a password reset
                                link.
                            </span>
                        </div>

                        {resetUrl && (
                            <div className="mt-4 rounded-[var(--radius)] border border-line bg-canvas p-4">
                                <p className="eyebrow">DEVELOPMENT MODE · RESET URL</p>
                                <a
                                    href={resetUrl}
                                    className="font-mono text-body-sm mt-2 block break-all text-azure"
                                >
                                    {resetUrl}
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-line bg-panel-2 px-6 py-4">
                        <Link href="/auth/login" className="cta cta--ghost">
                            <span className="font-mono" aria-hidden="true">
                                ←
                            </span>
                            Back to login
                        </Link>
                    </div>
                </div>
            </AuthShell>
        );
    }

    /* Hue: azure only — the submit and the sign-in link are the actions. */
    return (
        <AuthShell>
            <div className="panel overflow-hidden">
                <div className="panel__header">
                    <span>PASSWORD RESET</span>
                </div>

                <div className="panel__body">
                    <h1 className="display text-h3 text-ink">Forgot your password?</h1>
                    <p className="text-body-sm mt-2 text-muted">
                        Enter your email and we&apos;ll send a reset link.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="field">
                            <label htmlFor="email" className="label">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail
                                    aria-hidden="true"
                                    strokeWidth={1.5}
                                    className="field__affix field__affix--left h-4 w-4"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="input input--has-icon"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert--error" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn--primary btn--block"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" aria-hidden="true" />
                                    Sending
                                </>
                            ) : (
                                "Send reset link"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-body-sm border-t border-line bg-panel-2 px-6 py-4 text-muted">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-azure">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthShell>
    );
}
