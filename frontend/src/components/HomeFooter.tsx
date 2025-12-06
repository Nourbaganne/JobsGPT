"use client";

import Link from "next/link";

export default function HomeFooter() {
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
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
        <footer className="bg-[#22223b] text-gray-300">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Column 1 - Company Info */}
                    <div className="space-y-4">
                        <img 
                            src="/logo.png" 
                            alt="JobsGPT" 
                            className="h-24 w-auto object-contain"
                        />
                        <p className="text-sm text-gray-400 leading-relaxed">
                            JobsGPT revolutionizes job searching with AI-powered matching, automated discovery, and seamless candidate experiences. Perfect for job seekers looking to modernize their search and find opportunities faster.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="w-8 h-8 bg-[#5b6fa3] rounded-full flex items-center justify-center hover:bg-[#6b7db3] transition-colors">
                                <span className="text-white text-xs font-bold">f</span>
                            </a>
                            <a href="#" className="w-8 h-8 bg-[#5b6fa3] rounded-full flex items-center justify-center hover:bg-[#6b7db3] transition-colors">
                                <span className="text-white text-xs font-bold">in</span>
                            </a>
                        </div>
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} JobsGPT. All rights reserved.
                        </p>
                    </div>

                    {/* Column 2 - Quick Links */}
                    <div>
                        <h4 className="text-base font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <a 
                                    href="#home" 
                                    onClick={(e) => handleSmoothScroll(e, "#home")} 
                                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                                >
                                    <span className="mr-2">&gt;</span>
                                    Get Started
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#features" 
                                    onClick={(e) => handleSmoothScroll(e, "#features")} 
                                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                                >
                                    <span className="mr-2">&gt;</span>
                                    Features
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#how-it-works" 
                                    onClick={(e) => handleSmoothScroll(e, "#how-it-works")} 
                                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                                >
                                    <span className="mr-2">&gt;</span>
                                    Live Demo
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 - Resources */}
                    <div>
                        <h4 className="text-base font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                                    <span className="mr-2">&gt;</span>
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                                    <span className="mr-2">&gt;</span>
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4 - Get in Touch */}
                    <div>
                        <h4 className="text-base font-semibold text-white mb-4">Get in Touch</h4>
                        <ul className="space-y-4">
                            <li>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-[#5b6fa3] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-400">support@jobsgpt.com</p>
                                        <p className="text-xs text-gray-500 mt-1">24/7 Support Available</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-[#5b6fa3] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-400">+1 (555) 123-4567</p>
                                        <p className="text-xs text-gray-500 mt-1">Mon-Fri 9AM-6PM EST</p>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-[#5b6fa3] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-400">Available Worldwide</p>
                                        <p className="text-xs text-gray-500 mt-1">Cloud-based platform</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer Links */}
                <div className="border-t border-[#5b6fa3]/50 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <img 
                            src="/logo.png" 
                            alt="JobsGPT" 
                            className="h-16 w-auto object-contain"
                        />
                        <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

