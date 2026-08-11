"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";
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

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError("Invalid reset link");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        setError("");

        const response = await api.resetPassword(token, password);

        if (response.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        } else {
            setError(response.error || "Something went wrong");
        }

        setLoading(false);
    };

    /* Hue: mint reports the completed reset. The only other tinted thing on the
       screen is nothing — the exit link reads ghost. */
    if (success) {
        return (
            <AuthShell>
                <div className="panel overflow-hidden">
                    <div className="panel__header">
                        <span>PASSWORD RESET</span>
                        <span className="chip chip--live">COMPLETE</span>
                    </div>

                    <div className="panel__body">
                        <h1 className="display text-h3 text-ink">Password reset</h1>

                        <div className="alert alert--ok mt-4" role="status">
                            <span>
                                Your password has been successfully reset. Redirecting to login...
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-line bg-panel-2 px-6 py-4">
                        <Link href="/auth/login" className="cta cta--ghost">
                            Go to login
                            <span className="font-mono" aria-hidden="true">
                                →
                            </span>
                        </Link>
                    </div>
                </div>
            </AuthShell>
        );
    }

    if (!token) {
        return (
            <AuthShell>
                <div className="panel overflow-hidden">
                    <div className="panel__header">
                        <span>PASSWORD RESET</span>
                    </div>

                    <div className="panel__body">
                        <h1 className="display text-h3 text-ink">Invalid link</h1>

                        <div className="alert alert--error mt-4" role="alert">
                            <span>This password reset link is invalid or has expired.</span>
                        </div>

                        <div className="mt-6">
                            <Link href="/auth/forgot-password" className="cta cta--secondary">
                                Request new link
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthShell>
        );
    }

    /* Hue: azure only — the submit is the single action on the screen. */
    return (
        <AuthShell>
            <div className="panel overflow-hidden">
                <div className="panel__header">
                    <span>PASSWORD RESET</span>
                </div>

                <div className="panel__body">
                    <h1 className="display text-h3 text-ink">Set a new password</h1>
                    <p className="text-body-sm mt-2 text-muted">At least 6 characters.</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="field">
                            <label htmlFor="password" className="label">
                                New password
                            </label>
                            <div className="relative">
                                <Lock
                                    aria-hidden="true"
                                    strokeWidth={1.5}
                                    className="field__affix field__affix--left h-4 w-4"
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="input input--has-icon input--has-action"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="field__affix field__affix--action"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff strokeWidth={1.5} className="h-4 w-4" />
                                    ) : (
                                        <Eye strokeWidth={1.5} className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="confirmPassword" className="label">
                                Confirm password
                            </label>
                            <div className="relative">
                                <Lock
                                    aria-hidden="true"
                                    strokeWidth={1.5}
                                    className="field__affix field__affix--left h-4 w-4"
                                />
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="input input--has-icon input--has-action"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="field__affix field__affix--action"
                                    aria-label={
                                        showConfirmPassword ? "Hide password" : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff strokeWidth={1.5} className="h-4 w-4" />
                                    ) : (
                                        <Eye strokeWidth={1.5} className="h-4 w-4" />
                                    )}
                                </button>
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
                                    Resetting
                                </>
                            ) : (
                                "Reset password"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </AuthShell>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-canvas">
                    <span className="spinner text-muted" aria-hidden="true" />
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}
