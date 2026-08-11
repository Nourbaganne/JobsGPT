"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

/* The four capability lines from the old feature list, stripped of their icon
   tiles: a tinted tile with no state behind it is decoration, and this system
   spends colour on information only. */
const CAPABILITIES = [
    { label: "MATCHING", text: "Every opening scored against your resume." },
    { label: "ALERTS", text: "Boards rescanned continuously, not on a schedule you set." },
    { label: "INTEL", text: "The hiring manager, the recruiter, and how to reach them." },
    { label: "TRACKING", text: "Every application in one record." },
];

export default function RegisterPage() {
    const router = useRouter();
    const { register, isAuthenticated, error: authError, clearError } = useAuth();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        clearError();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            setLoading(false);
            return;
        }

        if (!agreedToTerms) {
            setError("Please agree to the terms and conditions");
            setLoading(false);
            return;
        }

        const success = await register(formData.email, formData.password);

        if (success) {
            router.push("/dashboard");
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen bg-canvas">
            {/* Left — aside. Blueprint grid, hairline surfaces, no hue: the only
                action in this viewport is in the form to the right. */}
            <aside className="auth-aside hidden lg:flex lg:w-1/2">
                <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />

                <div className="relative z-10 flex w-full flex-col justify-between p-10">
                    <Link href="/" className="display text-h3 text-ink">
                        Lynceus
                    </Link>

                    <div className="max-w-[46ch]">
                        <h1 className="display text-h2 text-ink">
                            Open an account.
                            <br />
                            The scan starts.
                        </h1>
                        <p className="text-body mt-6 text-muted">
                            Lynceus reads the boards, scores what it finds against your resume, and
                            drafts the outreach. You review before anything sends.
                        </p>

                        <dl className="mt-10 border-t border-line">
                            {CAPABILITIES.map((item) => (
                                <div key={item.label} className="border-b border-line py-4">
                                    <dt className="eyebrow text-dim">{item.label}</dt>
                                    <dd className="text-body-sm mt-2 text-muted">{item.text}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <p className="postscript">FIRST 10 CREDITS ARE ON US</p>
                </div>
            </aside>

            {/* Right — form */}
            <div className="flex w-full items-center justify-center bg-canvas p-6 lg:w-1/2 lg:p-10">
                <div className="w-full max-w-md">
                    <div className="mb-6 lg:hidden">
                        <Link href="/" className="display text-h3 text-ink">
                            Lynceus
                        </Link>
                    </div>

                    <div className="panel overflow-hidden">
                        <div className="panel__header">
                            <span>NEW ACCOUNT</span>
                        </div>

                        <div className="panel__body">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="field">
                                        <label htmlFor="firstName" className="label">
                                            First name
                                        </label>
                                        <div className="relative">
                                            <User
                                                aria-hidden="true"
                                                strokeWidth={1.5}
                                                className="field__affix field__affix--left h-4 w-4"
                                            />
                                            <input
                                                id="firstName"
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="John"
                                                className="input input--has-icon"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label htmlFor="lastName" className="label">
                                            Last name
                                        </label>
                                        <div className="relative">
                                            <User
                                                aria-hidden="true"
                                                strokeWidth={1.5}
                                                className="field__affix field__affix--left h-4 w-4"
                                            />
                                            <input
                                                id="lastName"
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Doe"
                                                className="input input--has-icon"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
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
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="input input--has-icon"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="field">
                                    <label htmlFor="password" className="label">
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
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="At least 6 characters"
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

                                {/* Confirm password */}
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
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Repeat it"
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

                                {/* Terms — the links stay neutral so azure reads as
                                    the one action on the panel. */}
                                <div className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="checkbox"
                                    />
                                    <label htmlFor="terms" className="text-body-sm text-muted">
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-ink underline underline-offset-2">
                                            Terms and Conditions
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="text-ink underline underline-offset-2">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>

                                {/* Error */}
                                {(error || authError) && (
                                    <div className="alert alert--error" role="alert">
                                        {error || authError}
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
                                            Creating account
                                        </>
                                    ) : (
                                        <>
                                            Create account
                                            <span className="font-mono" aria-hidden="true">
                                                →
                                            </span>
                                        </>
                                    )}
                                </button>

                                <p className="text-body-sm text-center text-muted">
                                    Already have an account?{" "}
                                    <Link href="/auth/login" className="text-azure">
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
