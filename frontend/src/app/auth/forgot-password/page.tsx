"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

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

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#e8eef5] p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-[#c9ada7]/20 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#22223b] mb-2">Check Your Email</h2>
                        <p className="text-[#4a4e69] mb-6">
                            If an account exists with {email}, you will receive a password reset link.
                        </p>
                        
                        {resetUrl && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                                <p className="text-sm text-blue-700 font-medium mb-2">Development Mode - Reset URL:</p>
                                <a 
                                    href={resetUrl} 
                                    className="text-sm text-blue-600 break-all hover:underline"
                                >
                                    {resetUrl}
                                </a>
                            </div>
                        )}

                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 text-[#4a4e69] hover:text-[#22223b] font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Login
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
                            Forgot Password?
                        </h2>
                        <p className="mt-2 text-[#4a4e69]">
                            Enter your email and we&apos;ll send you a reset link
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#22223b] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9a8c98]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#c9ada7]/50 focus:border-[#4a4e69] focus:ring-2 focus:ring-[#4a4e69]/20 outline-none transition-all text-[#22223b] placeholder:text-[#9a8c98]"
                                    required
                                />
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
                                    Sending...
                                </span>
                            ) : (
                                <>
                                    Send Reset Link
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-[#4a4e69] mt-6">
                            Remember your password?{" "}
                            <Link href="/auth/login" className="text-[#4a4e69] font-semibold hover:text-[#22223b]">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
