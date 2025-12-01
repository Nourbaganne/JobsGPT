"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X, ArrowRight, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HomeNavbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            
            // Update active section based on scroll position
            const sections = ['home', 'features', 'how-it-works'];
            const scrollPosition = window.scrollY + 100;
            
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const element = document.querySelector(href);
        if (element) {
            const lenis = (window as any).lenis;
            if (lenis) {
                lenis.scrollTo(element, { offset: -80, duration: 1.5 });
            } else {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="group">
                        <img 
                            src="/logo.png" 
                            alt="JobsGPT" 
                            className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    {/* Desktop Navigation - Center */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <a
                            href="#home"
                            onClick={(e) => handleSmoothScroll(e, "#home")}
                            className="relative text-sm font-medium text-[#4a4e69] hover:text-[#22223b] transition-colors"
                        >
                            Home
                            {activeSection === 'home' && (
                                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#5b6fa3] rounded-full"></span>
                            )}
                        </a>
                        <a
                            href="#features"
                            onClick={(e) => handleSmoothScroll(e, "#features")}
                            className="relative text-sm font-medium text-[#4a4e69] hover:text-[#22223b] transition-colors"
                        >
                            Features
                            {activeSection === 'features' && (
                                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#5b6fa3] rounded-full"></span>
                            )}
                        </a>
                        <a
                            href="#how-it-works"
                            onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
                            className="relative text-sm font-medium text-[#4a4e69] hover:text-[#22223b] transition-colors"
                        >
                            Getting Started
                            {activeSection === 'how-it-works' && (
                                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#5b6fa3] rounded-full"></span>
                            )}
                        </a>
                        {session && (
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-[#4a4e69] hover:text-[#22223b] transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Desktop Right Side - Language & CTA */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-sm text-[#4a4e69]">
                            <Globe className="h-4 w-4" />
                            <span>English</span>
                        </div>
                        {session ? (
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#22223b] rounded-lg hover:bg-[#2d3047] transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                            >
                                <span>Dashboard</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <Link
                                href="/auth/register"
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#22223b] rounded-lg hover:bg-[#2d3047] transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                            >
                                <span>Get Started</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-[#4a4e69] hover:bg-gray-100 focus:outline-none transition-all"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <a
                            href="#home"
                            onClick={(e) => handleSmoothScroll(e, "#home")}
                            className="block px-4 py-3 text-base font-medium text-[#4a4e69] hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Home
                        </a>
                        <a
                            href="#features"
                            onClick={(e) => handleSmoothScroll(e, "#features")}
                            className="block px-4 py-3 text-base font-medium text-[#4a4e69] hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
                            className="block px-4 py-3 text-base font-medium text-[#4a4e69] hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            Getting Started
                        </a>
                        {session ? (
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-[#4a4e69] hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-base font-medium text-[#4a4e69] hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-base font-semibold text-white bg-[#22223b] rounded-lg hover:bg-[#2d3047] transition-all text-center"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

