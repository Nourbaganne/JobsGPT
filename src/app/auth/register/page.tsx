"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Brain, Zap, Building2, TrendingUp } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (!agreedToTerms) {
            setError("Please agree to the terms and conditions");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    email: formData.email, 
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                }),
            });

            if (!response.ok) {
                const data = await response.text();
                throw new Error(data || "Something went wrong");
            }

            router.push("/auth/login");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#22223b] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#5b6fa3]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#b8c5d6]/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <Link href="/">
                        <img 
                            src="/logo.png" 
                            alt="JobsGPT" 
                            className="h-40 w-auto object-contain"
                        />
                    </Link>

                    {/* Main Content */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight italic">
                                Transform Your<br />Job Search Experience
                            </h1>
                            <p className="mt-6 text-lg text-[#b8c5d6] leading-relaxed max-w-md">
                                Join thousands of professionals already using JobsGPT to find their dream jobs faster.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            {[
                                { icon: Brain, text: "AI-powered job matching" },
                                { icon: Zap, text: "Real-time job alerts" },
                                { icon: Building2, text: "Company intel & contacts" },
                                { icon: TrendingUp, text: "Application tracking" },
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-4 text-white/90">
                                    <div className="w-10 h-10 rounded-lg bg-[#5b6fa3]/30 flex items-center justify-center">
                                        <feature.icon className="h-5 w-5 text-[#b8c5d6]" />
                                    </div>
                                    <span className="text-base">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <p className="text-white/90 italic leading-relaxed">
                            "JobsGPT's AI matching found me opportunities I never would have discovered. 
                            The company intel feature gave me an edge in interviews. Landed my dream job in 3 weeks!"
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                                <div className="w-10 h-10 rounded-full bg-[#5b6fa3]" />
                            <div>
                                <p className="text-[#b8c5d6] font-semibold">Sarah Chen</p>
                                <p className="text-white/60 text-sm">Software Engineer, Google</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#e8eef5]">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
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
                                Create Your Account
                            </h2>
                            <p className="mt-2 text-[#4a4e69]">
                                Join thousands of professionals using JobsGPT
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#22223b] mb-2">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9a8c98]" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#c9ada7]/50 focus:border-[#4a4e69] focus:ring-2 focus:ring-[#4a4e69]/20 outline-none transition-all text-[#22223b] placeholder:text-[#9a8c98]"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#22223b] mb-2">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9a8c98]" />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#c9ada7]/50 focus:border-[#4a4e69] focus:ring-2 focus:ring-[#4a4e69]/20 outline-none transition-all text-[#22223b] placeholder:text-[#9a8c98]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-[#22223b] mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9a8c98]" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#c9ada7]/50 focus:border-[#4a4e69] focus:ring-2 focus:ring-[#4a4e69]/20 outline-none transition-all text-[#22223b] placeholder:text-[#9a8c98]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-[#22223b] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9a8c98]" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
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

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-[#22223b] mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9a8c98]" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
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

                            {/* Terms */}
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-[#c9ada7] text-[#4a4e69] focus:ring-[#4a4e69]"
                                />
                                <label htmlFor="terms" className="text-sm text-[#4a4e69]">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-[#4a4e69] font-semibold hover:text-[#22223b]">
                                        Terms and Conditions
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-[#4a4e69] font-semibold hover:text-[#22223b]">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
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
                                        Creating Account...
                                    </span>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#c9ada7]/50" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-[#9a8c98]">OR SIGN UP WITH</span>
                                </div>
                            </div>

                            {/* Social Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 px-4 py-3 border border-[#c9ada7]/50 rounded-xl hover:bg-[#f2e9e4] transition-colors"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-[#22223b] font-medium">Google</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 px-4 py-3 border border-[#c9ada7]/50 rounded-xl hover:bg-[#f2e9e4] transition-colors"
                                >
                                    <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-[#22223b] font-medium">Facebook</span>
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <p className="text-center text-[#4a4e69] mt-6">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-[#4a4e69] font-semibold hover:text-[#22223b]">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
