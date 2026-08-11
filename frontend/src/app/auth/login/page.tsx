"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

/* The four capability lines, as a mono ledger rather than icon tiles — the
   aside is a statement of what the account does, not a feature grid. */
const CAPABILITIES = [
  { label: "MATCHING", text: "Every opening scored against your resume." },
  { label: "ALERTS", text: "New roles surfaced as they post." },
  { label: "INTEL", text: "Recruiter and hiring-manager contacts." },
  { label: "TRACKING", text: "Every application in one record." },
];

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, error: authError, clearError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        clearError();

        const success = await login(email, password);

        if (success) {
            router.push("/dashboard");
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen bg-canvas">
            {/* Left — aside. bg-surface + blueprint grid, no blobs, no card. */}
            <aside className="auth-aside hidden lg:flex lg:w-1/2">
                <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />

                <div className="relative z-10 flex w-full flex-col justify-between p-10">
                    <Link href="/" className="display text-h3 text-ink">
                        Lynceus
                    </Link>

                    <div className="max-w-[46ch]">
                        <p className="eyebrow">SIGN IN</p>
                        <h1 className="display text-h2 mt-4 text-ink">
                            Welcome back
                            <br />
                            to Lynceus.
                        </h1>
                        <p className="text-lead mt-6 text-muted">
                            The search kept running while you were away.
                        </p>

                        <ul className="mt-10 border-t border-line">
                            {CAPABILITIES.map((item) => (
                                <li
                                    key={item.label}
                                    className="grid grid-cols-[112px_minmax(0,1fr)] items-baseline gap-4 border-b border-line py-4"
                                >
                                    <span className="eyebrow text-dim">{item.label}</span>
                                    <span className="text-body-sm text-muted">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="postscript">
                        RESCANNED CONTINUOUSLY · YOU REVIEW BEFORE ANYTHING SENDS
                    </p>
                </div>
            </aside>

            {/* Right — form */}
            <div className="flex w-full items-center justify-center bg-canvas p-6 sm:p-10 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="mb-6 flex justify-center lg:hidden">
                        <Link href="/" className="display text-h3 text-ink">
                            Lynceus
                        </Link>
                    </div>

                    <div className="panel overflow-hidden">
                        <div className="panel__header">
                            <span>SIGN IN</span>
                            <span className="text-dim">ACCOUNT ACCESS</span>
                        </div>

                        <form onSubmit={handleSubmit} className="panel__body space-y-6">
                            {/* Email */}
                            <div className="field">
                                <label className="label" htmlFor="email">
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

                            {/* Password */}
                            <div className="field">
                                <label className="label" htmlFor="password">
                                    Password
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
                                        placeholder="Enter your password"
                                        className="input input--has-icon input--has-action"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="field__affix field__affix--action"
                                    >
                                        {showPassword ? (
                                            <EyeOff strokeWidth={1.5} className="h-4 w-4" />
                                        ) : (
                                            <Eye strokeWidth={1.5} className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="checkbox"
                                    />
                                    <label htmlFor="remember" className="text-body-sm text-muted">
                                        Remember me
                                    </label>
                                </div>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-body-sm text-azure"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Error */}
                            {authError && (
                                <div className="alert alert--error" role="alert">
                                    {authError}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn--primary btn--block"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner" aria-hidden="true" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <span className="font-mono" aria-hidden="true">
                                            →
                                        </span>
                                    </>
                                )}
                            </button>

                            <p className="text-body-sm text-muted">
                                Don&apos;t have an account?{" "}
                                <Link href="/auth/register" className="text-azure">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
