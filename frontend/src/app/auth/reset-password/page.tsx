"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { api } from "@/lib/api";

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

    useEffect(() => {
        if (!token) {
            setError("Invalid reset link. Please request a new password reset.");
        }
    }, [token]);

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

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
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

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#e8eef5] p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-[#c9ada7]/20 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#22223b] mb-2">Password Reset!</h2>
                        <p className="text-[#4a4e69] mb-6">
                            Your password has been successfully reset. Redirecting to login...
                        </p>
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 text-[#4a4e69] hover:text-[#22223b] font-medium"
                        >
                            Go to Login
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#e8eef5] p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-[#c9ada7]/20 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#22223b] mb-2">Invalid Link</h2>
                        <p className="text-[#4a4e69] mb-6">
                            This password reset link is invalid or has expired.
                        </p>
                        <Link
                            href="/auth/forgot-password"
                            className="inline-flex items-center gap-2 bg-[#22223b] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2d3047] transition-all"
                        >
                            Request New Link
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#e8eef5] p-6">
            <div className="w-full max-w-md">
                <div className="lg:hidden flex justify-center mb-8">
                    <Link href="/">
                        <img 
                            src="/logo.png" 
                            alt="JobsGPT" 
                            className="h-32 w-auto object-contain"
                        />
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-[#c9ada7]/20">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#22223b]">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-[#4a4e69]">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#22223b] mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9a8c98]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-[#c9ada7]/50 focus:border-[#4a4e69] focus:ring-2 focus:ring-[#4a4e69]/20 outline-none transition-all text-[#22223b] placeholder:text-[#9a8c98]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8c98] hover:text-[#4a4e69] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#22223b] mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9a8c98]" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-[#c9ada7]/50 focus:border-[#4a4e69] focus:ring-2 focus:ring-[#4a4e69]/20 outline-none transition-all text-[#22223b] placeholder:text-[#9a8c98]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8c98] hover:text-[#4a4e69] transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#22223b] text-white py-3.5 rounded-xl font-semibold hover:bg-[#2d3047] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Resetting...
                                </span>
                            ) : (
                                <>
                                    Reset Password
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#e8eef5]">
                <div className="animate-spin h-8 w-8 border-4 border-[#22223b] border-t-transparent rounded-full" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
