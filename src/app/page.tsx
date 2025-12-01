import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Search, Zap, Sparkles as SparklesIcon, Briefcase, TrendingUp, Users, Target, MapPin, Star, Building2, Headphones, Award, Mail, X, Check, Coins, ChevronDown, HelpCircle } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HorizontalScrollCarousel from "@/components/HorizontalScrollCarousel";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import StackingCards from "@/components/StackingCards";
import { Sparkles } from "@/components/Sparkles";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeNavbar />
      {/* Hero Section */}
      <header id="home" className="relative overflow-hidden bg-[#22223b] min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#22223b] via-[#4a4e69]/50 to-[#22223b] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(154,140,152,0.1),transparent_50%)] z-0" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#5b6fa3]/10 rounded-full blur-3xl" data-parallax="0.3"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4a4e69]/10 rounded-full blur-3xl" data-parallax="0.2"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-left">
              <div className="scroll-animate scroll-rotate scroll-stagger-1 inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[#4a4e69]/80 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-[#5b6fa3]/50">
                <SparklesIcon className="h-4 w-4" />
                <span>Available Now</span>
              </div>
              <h1 className="scroll-animate scroll-blur scroll-stagger-1 text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-reveal">Transform Your</span>
                <span className="block bg-gradient-to-r from-[#b8c5d6] via-white to-[#b8c5d6] bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_ease_infinite] text-reveal scroll-glow">
                  Job Search Today
                </span>
              </h1>
              <p className="scroll-animate scroll-slide-up scroll-stagger-2 mt-6 max-w-xl text-lg text-gray-300 sm:text-xl md:mt-8 md:text-2xl leading-relaxed">
                Start building your job search in minutes with our powerful platform. No technical skills required.
              </p>
              <div className="scroll-animate scroll-scale scroll-stagger-3 mt-10 flex flex-col sm:flex-row gap-4 md:mt-12">
                <Link
                  href="/auth/register"
                  className="magnetic group inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-[#22223b] bg-gradient-to-r from-[#b8c5d6] to-white hover:from-white hover:to-[#b8c5d6] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Get Started Now
                </Link>
                <Link
                  href="/dashboard"
                  className="magnetic inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-base font-semibold rounded-xl text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="mr-2 h-5 w-5" />
                  View Demo
                </Link>
              </div>
              <div className="scroll-animate scroll-fade-up scroll-stagger-4 mt-8 flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#b8c5d6]" />
                  <span>5,000+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#b8c5d6]" />
                  <span>5-min Setup</span>
                </div>
              </div>
            </div>

            {/* Right Side - Laptop Mockup */}
            <div className="scroll-animate scroll-fade-right scroll-scale scroll-stagger-2 relative">
              {/* Sparkles Effect */}
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] h-48 z-0">
                <Sparkles
                  className="w-full h-full"
                  size={2}
                  density={100}
                  speed={0.8}
                  color="#b8c5d6"
                  opacity={0.8}
                  direction="top"
                />
              </div>
              <div className="relative mx-auto z-10" style={{ maxWidth: '800px' }}>
                {/* Laptop Frame */}
                <div className="relative bg-gray-800 rounded-t-2xl p-2 shadow-2xl">
                  {/* Screen Bezel */}
                  <div className="bg-black rounded-lg overflow-hidden">
                    {/* Browser Bar */}
                    <div className="bg-[#4a4e69] px-4 py-2 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 bg-[#22223b] rounded px-3 py-1 text-xs text-gray-400 text-center">
                        jobsgpt.com/dashboard
                      </div>
                    </div>
                    {/* Dashboard Content */}
                    <div className="bg-[#e8eef5] p-6 min-h-[500px]">
                      {/* Dashboard Header */}
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-[#22223b] mb-2">Dashboard</h2>
                        <p className="text-sm text-[#4a4e69]">Welcome back! Here's an overview of your job search progress.</p>
                      </div>
                      
                      {/* Stats Cards */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-md border border-[#b8c5d6]/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-[#4a4e69]">Total Jobs</span>
                            <Briefcase className="h-4 w-4 text-[#5b6fa3]" />
                          </div>
                          <div className="text-2xl font-bold text-[#22223b]">156</div>
                          <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md border border-[#b8c5d6]/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-[#4a4e69]">Matches</span>
                            <Target className="h-4 w-4 text-[#5b6fa3]" />
                          </div>
                          <div className="text-2xl font-bold text-[#22223b]">24</div>
                          <p className="text-xs text-green-600 mt-1">+2 this week</p>
                        </div>
                      </div>

                      {/* Recent Jobs Table */}
                      <div className="bg-white rounded-xl shadow-md border border-[#b8c5d6]/30 overflow-hidden">
                        <div className="px-4 py-3 bg-[#e8eef5] border-b border-[#b8c5d6]/30">
                          <h3 className="text-sm font-semibold text-[#22223b]">Recent Job Matches</h3>
                        </div>
                        <div className="p-4">
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#e8eef5] hover:bg-[#b8c5d6]/20 transition-colors">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-medium text-[#22223b]">Senior Developer</span>
                                  </div>
                                  <span className="text-xs text-[#4a4e69]">Tech Corp • Remote</span>
                                </div>
                                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">95% match</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Laptop Base */}
                <div className="h-2 bg-gray-700 rounded-b-lg"></div>
                <div className="h-1 bg-gray-900 rounded-b-lg mx-auto" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 bg-[#22223b] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(154,140,152,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(201,173,167,0.1),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Jobs Matched */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <Briefcase className="h-8 w-8 text-[#b8c5d6]" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <p className="text-sm md:text-base text-[#b8c5d6] font-medium">Jobs Matched</p>
            </div>

            {/* Partner Companies */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <Building2 className="h-8 w-8 text-[#b8c5d6]" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <p className="text-sm md:text-base text-[#b8c5d6] font-medium">Partner Companies</p>
            </div>

            {/* User Satisfaction */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <Award className="h-8 w-8 text-[#b8c5d6]" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <p className="text-sm md:text-base text-[#b8c5d6] font-medium">User Satisfaction</p>
            </div>

            {/* Support */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                <Headphones className="h-8 w-8 text-[#b8c5d6]" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                24/7
              </div>
              <p className="text-sm md:text-base text-[#b8c5d6] font-medium">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#e8eef5] overflow-hidden lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8eef5] via-[#b8c5d6]/20 to-[#5b6fa3]/10 z-0" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-96 h-96 bg-[#5b6fa3]/10 rounded-full blur-3xl" data-parallax="0.3"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#b8c5d6]/10 rounded-full blur-3xl" data-parallax="0.2"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Visual Mockup */}
            <div className="scroll-animate scroll-fade-left scroll-scale order-2 lg:order-1">
              <div className="relative mx-auto" style={{ maxWidth: '700px' }}>
                {/* Phone/Tablet Mockup */}
                <div className="relative bg-gray-800 rounded-3xl p-3 shadow-2xl">
                  <div className="bg-black rounded-2xl overflow-hidden">
                    {/* Status Bar */}
                    <div className="bg-[#4a4e69] px-4 py-2 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                      </div>
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-3 border border-white rounded-sm"></div>
                        <div className="w-1 h-1 rounded-full bg-white"></div>
                      </div>
                    </div>
                    {/* App Content */}
                    <div className="bg-[#e8eef5] p-4 min-h-[500px]">
                      {/* Job Cards Preview */}
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-white rounded-xl p-4 shadow-md border border-[#b8c5d6]/30">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-8 h-8 rounded-lg bg-[#5b6fa3] flex items-center justify-center">
                                    <Briefcase className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-[#22223b]">Senior Developer</h4>
                                    <p className="text-xs text-[#4a4e69]">Tech Corp</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-[#4a4e69] mt-2">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>Remote</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>2h ago</span>
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">95%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Notification Badge */}
                      <div className="mt-4 bg-[#22223b] rounded-xl p-4 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4" />
                          <span className="text-sm font-semibold">New Match Found!</span>
                        </div>
                        <p className="text-xs opacity-90">3 new jobs match your profile</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#5b6fa3] to-[#b8c5d6] rounded-full blur-2xl opacity-50" data-parallax="0.4"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#b8c5d6] to-[#5b6fa3] rounded-full blur-2xl opacity-50" data-parallax="0.3"></div>
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div className="scroll-animate scroll-fade-right scroll-stagger-1 order-1 lg:order-2">
              <div className="text-left lg:text-left">
                <h2 className="scroll-animate scroll-blur text-3xl leading-8 font-extrabold tracking-tight text-[#22223b] sm:text-4xl lg:text-5xl">
                  Work Smarter, Not Harder
                </h2>
                <p className="scroll-animate scroll-slide-up scroll-stagger-2 mt-4 text-lg text-[#4a4e69] sm:text-xl leading-relaxed">
                  Our platform handles the tedious parts of job hunting so you can focus on preparing for interviews.
                </p>

                {/* Feature List */}
                <div className="scroll-animate scroll-fade-up scroll-stagger-3 mt-8 space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#5b6fa3] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Search className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#22223b] mb-1">Smart Matching</h3>
                      <p className="text-[#4a4e69]">
                        Our advanced algorithms analyze your resume and preferences to find jobs that are a perfect fit for your skills and career goals.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#5b6fa3] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#22223b] mb-1">Automated Discovery</h3>
                      <p className="text-[#4a4e69]">
                        We scour multiple job boards 24/7. New opportunities are discovered and added to your dashboard instantly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#5b6fa3] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#22223b] mb-1">Real-time Alerts</h3>
                      <p className="text-[#4a4e69]">
                        Be the first to apply. Get notified immediately when high-priority matches are found, giving you a competitive edge.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="scroll-animate scroll-scale scroll-stagger-4 mt-10">
                  <Link
                    href="/auth/register"
                    className="magnetic inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-[#22223b] hover:hover:bg-[#2d3047] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stacking Cards Features Section */}
      <StackingCards />

      {/* Comparison Table */}
      <section className="py-20 bg-[#e8eef5] lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8eef5] via-white/30 to-[#e8eef5] z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="scroll-animate scroll-fade-up text-3xl font-extrabold text-[#22223b] sm:text-4xl lg:text-5xl">
              JobsGPT vs Traditional Job Search
            </h2>
            <p className="scroll-animate scroll-fade-up scroll-stagger-1 mt-4 text-lg text-[#4a4e69] sm:text-xl max-w-2xl mx-auto">
              See how our platform transforms the way you find your next opportunity.
            </p>
          </div>

          <div className="scroll-animate scroll-fade-up scroll-stagger-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#b8c5d6]/20">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-gradient-to-r from-[#22223b] to-[#4a4e69] text-white">
                <div className="p-6 font-semibold text-lg">Feature</div>
                <div className="p-6 font-semibold text-lg text-center border-l border-white/20">Traditional</div>
                <div className="p-6 font-semibold text-lg text-center border-l border-white/20 bg-gradient-to-r from-[#5b6fa3] to-[#b8c5d6]">JobsGPT</div>
              </div>

              {/* Table Rows */}
              {[
                { feature: 'Time spent searching', traditional: 'Hours daily', jobmatch: 'Minutes' },
                { feature: 'Finding recruiter contacts', traditional: 'Manual research', jobmatch: 'Instant access' },
                { feature: 'Personalized outreach', traditional: 'Generic templates', jobmatch: 'AI-generated emails' },
                { feature: 'Company insights', traditional: 'Limited info', jobmatch: 'Full intel (CEO, hiring team)' },
                { feature: 'Application tracking', traditional: 'Spreadsheets', jobmatch: 'Built-in dashboard' },
                { feature: 'Job matching accuracy', traditional: 'Random results', jobmatch: 'AI-powered 95%+' },
              ].map((row, index) => (
                <div key={index} className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-white' : 'bg-[#e8eef5]/30'}`}>
                  <div className="p-5 font-medium text-[#22223b] border-t border-[#b8c5d6]/20">
                    {row.feature}
                  </div>
                  <div className="p-5 text-center border-t border-l border-[#b8c5d6]/20 flex items-center justify-center gap-2">
                    <X className="h-5 w-5 text-red-400" />
                    <span className="text-[#4a4e69]">{row.traditional}</span>
                  </div>
                  <div className="p-5 text-center border-t border-l border-[#b8c5d6]/20 bg-[#b8c5d6]/10 flex items-center justify-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-[#22223b] font-medium">{row.jobmatch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Credits Model */}
      <section id="pricing" className="py-20 bg-white lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(154,140,152,0.1),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="scroll-animate scroll-fade-up inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[#b8c5d6]/20 rounded-full text-sm font-medium text-[#4a4e69]">
              <Coins className="h-4 w-4" />
              <span>Credit-Based Pricing</span>
            </div>
            <h2 className="scroll-animate scroll-fade-up text-3xl font-extrabold text-[#22223b] sm:text-4xl lg:text-5xl">
              Pay Only for What You Use
            </h2>
            <p className="scroll-animate scroll-fade-up scroll-stagger-1 mt-4 text-lg text-[#4a4e69] sm:text-xl max-w-2xl mx-auto">
              No subscriptions. Buy credits and use them whenever you need. Credits never expire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Starter Pack */}
            <div className="scroll-animate scroll-fade-up scroll-stagger-1">
              <div className="h-full p-8 rounded-2xl bg-white border-2 border-[#b8c5d6]/30 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-[#22223b] mb-2">Starter Pack</h3>
                  <p className="text-[#4a4e69] text-sm mb-4">Perfect for trying the platform</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-[#22223b]">$9</span>
                  </div>
                  <p className="text-[#5b6fa3] mt-2 font-medium">50 Credits</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-[#4a4e69]">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>50 job searches</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#4a4e69]">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>25 AI-generated emails</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#4a4e69]">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>16 company intel reports</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#4a4e69]">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Credits never expire</span>
                  </li>
                </ul>
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-6 py-3 border-2 border-[#4a4e69] text-[#4a4e69] font-semibold rounded-xl hover:bg-[#4a4e69] hover:text-white transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Pro Pack - Most Popular */}
            <div className="scroll-animate scroll-fade-up scroll-stagger-2">
              <div className="h-full p-8 rounded-2xl bg-[#22223b] border-2 border-[#5b6fa3] shadow-2xl hover:-translate-y-2 transition-all duration-300 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#b8c5d6] to-[#5b6fa3] rounded-full text-white text-sm font-semibold">
                  Most Popular
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Pro Pack</h3>
                  <p className="text-[#b8c5d6] text-sm mb-4">Best value for active job seekers</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-white">$29</span>
                  </div>
                  <p className="text-[#b8c5d6] mt-2 font-medium">200 Credits + 20% Bonus</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-white">
                    <Check className="h-5 w-5 text-[#b8c5d6] flex-shrink-0" />
                    <span>240 total credits (20% bonus)</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Check className="h-5 w-5 text-[#b8c5d6] flex-shrink-0" />
                    <span>120 AI-generated emails</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Check className="h-5 w-5 text-[#b8c5d6] flex-shrink-0" />
                    <span>80 company intel reports</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <Check className="h-5 w-5 text-[#b8c5d6] flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#b8c5d6] to-white text-[#22223b] font-semibold rounded-xl hover:from-white hover:to-[#b8c5d6] transition-all duration-300"
                >
                  Get Pro Pack
                </Link>
              </div>
            </div>

            {/* Enterprise Pack */}
            <div className="scroll-animate scroll-fade-up scroll-stagger-3">
              <div className="h-full p-8 rounded-2xl bg-white border-2 border-[#b8c5d6]/30 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-[#22223b] mb-2">Enterprise Pack</h3>
                  <p className="text-[#4a4e69] text-sm mb-4">For power users & teams</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-[#22223b]">$79</span>
                  </div>
                  <p className="text-[#5b6fa3] mt-2 font-medium">600 Credits + 30% Bonus</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-[#4a4e69]">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>780 total credits (30% bonus)</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#4a4e69]">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>390 AI-generated emails</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#4a4e69]">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>260 company intel reports</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#4a4e69]">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#4a4e69]">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>API access</span>
                  </li>
                </ul>
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-6 py-3 border-2 border-[#4a4e69] text-[#4a4e69] font-semibold rounded-xl hover:bg-[#4a4e69] hover:text-white transition-all duration-300"
                >
                  Get Enterprise
                </Link>
              </div>
            </div>
          </div>

          {/* How Credits Work */}
          <div className="scroll-animate scroll-fade-up scroll-stagger-4">
            <div className="bg-[#e8eef5] rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold text-[#22223b] mb-6 text-center">How Credits Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-[#4a4e69]" />
                  </div>
                  <h4 className="font-semibold text-[#22223b] mb-2">Job Search</h4>
                  <p className="text-[#4a4e69] text-sm">1 credit per search</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-[#4a4e69]" />
                  </div>
                  <h4 className="font-semibold text-[#22223b] mb-2">AI Email</h4>
                  <p className="text-[#4a4e69] text-sm">2 credits per email</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-[#4a4e69]" />
                  </div>
                  <h4 className="font-semibold text-[#22223b] mb-2">Company Intel</h4>
                  <p className="text-[#4a4e69] text-sm">3 credits per report</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <div id="how-it-works">
        <HorizontalScrollCarousel
            items={[
              { 
                id: 1,
                step: 1, 
                title: "Upload Resume", 
                description: "Upload your CV so we can understand your experience and skills.",
                icon: "Briefcase"
              },
              { 
                id: 2,
                step: 2, 
                title: "Set Preferences", 
                description: "Define your desired role, location, and salary expectations.",
                icon: "Target"
              },
              { 
                id: 3,
                step: 3, 
                title: "Get Matched", 
                description: "Sit back as curated job listings appear in your dashboard.",
                icon: "Search"
              },
              { 
                id: 4,
                step: 4, 
                title: "Review Matches", 
                description: "Browse through personalized job recommendations tailored to your profile.",
                icon: "CheckCircle"
              },
              { 
                id: 5,
                step: 5, 
                title: "Apply Easily", 
                description: "One-click application process with pre-filled information.",
                icon: "Zap"
              },
              { 
                id: 6,
                step: 6, 
                title: "Track Progress", 
                description: "Monitor your applications and interview status in real-time.",
                icon: "TrendingUp"
              },
              { 
                id: 7,
                step: 7, 
                title: "Get Notifications", 
                description: "Receive instant alerts when new matching jobs are found.",
                icon: "Clock"
              },
              { 
                id: 8,
                step: 8, 
                title: "Land Your Dream Job", 
                description: "Successfully secure your ideal position with our platform.",
                icon: "Users"
              }
            ]}
          />
      </div>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#e8eef5] lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8eef5] via-white/50 to-[#e8eef5] z-0" />
        
        <div className="relative z-10">
          <div className="text-center mb-12 px-4">
            <h2 className="scroll-animate scroll-fade-up text-3xl font-extrabold text-[#22223b] sm:text-4xl lg:text-5xl">
              What Our Users Say
            </h2>
            <p className="scroll-animate scroll-fade-up scroll-stagger-1 mt-4 text-lg text-[#4a4e69] sm:text-xl max-w-2xl mx-auto">
              Join thousands of satisfied professionals who found their dream jobs through our platform.
            </p>
          </div>

          {/* Marquee Reviews */}
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:30s]">
              {[
                {
                  name: 'Sarah Mitchell',
                  username: '@sarahm',
                  body: "JobsGPT completely transformed my job search. Within two weeks, I landed interviews at three top tech companies!",
                  img: 'https://avatar.vercel.sh/sarah',
                },
                {
                  name: 'James Chen',
                  username: '@jameschen',
                  body: "The automated job discovery saved me hours every day. I found my dream role in just 3 weeks.",
                  img: 'https://avatar.vercel.sh/james',
                },
                {
                  name: 'Emily Parker',
                  username: '@emilyp',
                  body: "As a career changer, JobsGPT understood my transferable skills and matched me perfectly.",
                  img: 'https://avatar.vercel.sh/emily',
                },
                {
                  name: 'Michael Torres',
                  username: '@mtorres',
                  body: "The AI matching is incredibly accurate. Every job recommendation was spot-on for my experience.",
                  img: 'https://avatar.vercel.sh/michael',
                },
                {
                  name: 'Lisa Wang',
                  username: '@lisawang',
                  body: "I was skeptical at first, but the platform delivered beyond expectations. Highly recommend!",
                  img: 'https://avatar.vercel.sh/lisa',
                },
                {
                  name: 'David Kim',
                  username: '@davidkim',
                  body: "Finally a job platform that actually understands what I'm looking for. Game changer!",
                  img: 'https://avatar.vercel.sh/david',
                },
              ].map((review) => (
                <figure
                  key={review.username}
                  className={cn(
                    'relative w-72 cursor-pointer overflow-hidden rounded-2xl border p-5 mx-2',
                    'border-[#b8c5d6]/30 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl',
                    'transition-all duration-300 hover:-translate-y-1'
                  )}
                >
                  <div className="flex flex-row items-center gap-3">
                    <img className="rounded-full" width="40" height="40" alt="" src={review.img} />
                    <div className="flex flex-col">
                      <figcaption className="text-sm font-semibold text-[#22223b]">
                        {review.name}
                      </figcaption>
                      <p className="text-xs font-medium text-[#5b6fa3]">{review.username}</p>
                    </div>
                  </div>
                  <blockquote className="mt-3 text-sm text-[#4a4e69] leading-relaxed">{review.body}</blockquote>
                  <div className="flex gap-0.5 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#b8c5d6] text-[#b8c5d6]" />
                    ))}
                  </div>
                </figure>
              ))}
            </Marquee>

            <Marquee reverse pauseOnHover className="[--duration:30s] mt-4">
              {[
                {
                  name: 'Alex Johnson',
                  username: '@alexj',
                  body: "The real-time alerts are a game changer. I was always first to apply to new positions.",
                  img: 'https://avatar.vercel.sh/alex',
                },
                {
                  name: 'Rachel Green',
                  username: '@rachelg',
                  body: "Switched from LinkedIn to JobsGPT and never looked back. So much more efficient!",
                  img: 'https://avatar.vercel.sh/rachel',
                },
                {
                  name: 'Chris Martinez',
                  username: '@chrism',
                  body: "Found my perfect remote job within a month. The filtering options are fantastic.",
                  img: 'https://avatar.vercel.sh/chris',
                },
                {
                  name: 'Amanda Foster',
                  username: '@amandaf',
                  body: "The resume analysis feature helped me understand what employers are looking for.",
                  img: 'https://avatar.vercel.sh/amanda',
                },
                {
                  name: 'Ryan Brooks',
                  username: '@ryanb',
                  body: "Best investment in my career. Landed a 40% salary increase at my new company.",
                  img: 'https://avatar.vercel.sh/ryan',
                },
                {
                  name: 'Sophie Lee',
                  username: '@sophiel',
                  body: "The platform is so intuitive. Set it up in 5 minutes and started getting matches immediately.",
                  img: 'https://avatar.vercel.sh/sophie',
                },
              ].map((review) => (
                <figure
                  key={review.username}
                  className={cn(
                    'relative w-72 cursor-pointer overflow-hidden rounded-2xl border p-5 mx-2',
                    'border-[#b8c5d6]/30 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl',
                    'transition-all duration-300 hover:-translate-y-1'
                  )}
                >
                  <div className="flex flex-row items-center gap-3">
                    <img className="rounded-full" width="40" height="40" alt="" src={review.img} />
                    <div className="flex flex-col">
                      <figcaption className="text-sm font-semibold text-[#22223b]">
                        {review.name}
                      </figcaption>
                      <p className="text-xs font-medium text-[#5b6fa3]">{review.username}</p>
                    </div>
                  </div>
                  <blockquote className="mt-3 text-sm text-[#4a4e69] leading-relaxed">{review.body}</blockquote>
                  <div className="flex gap-0.5 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#b8c5d6] text-[#b8c5d6]" />
                    ))}
                  </div>
                </figure>
              ))}
            </Marquee>

            {/* Gradient overlays */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#e8eef5]"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#e8eef5]"></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#e8eef5] lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8eef5] via-white/50 to-[#e8eef5] z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="scroll-animate scroll-fade-up inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[#b8c5d6]/20 rounded-full text-sm font-medium text-[#4a4e69]">
              <HelpCircle className="h-4 w-4" />
              <span>Have Questions?</span>
            </div>
            <h2 className="scroll-animate scroll-fade-up text-3xl font-extrabold text-[#22223b] sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="scroll-animate scroll-fade-up scroll-stagger-1 mt-4 text-lg text-[#4a4e69] sm:text-xl">
              Everything you need to know about JobsGPT.
            </p>
          </div>

          <div className="scroll-animate scroll-fade-up scroll-stagger-2 space-y-4">
            {[
              {
                question: "How do credits work?",
                answer: "Credits are our flexible payment system. You purchase credit packs and use them for different actions: 1 credit for job searches, 2 credits for AI-generated emails, and 3 credits for company intel reports. Credits never expire, so you can use them at your own pace."
              },
              {
                question: "What information do you provide about jobs?",
                answer: "We provide comprehensive job intel including the job posting details, who posted it, who's managing the hiring process, direct contact information for recruiters and hiring managers, and when available, CEO and leadership contact information. This gives you a direct line to decision-makers."
              },
              {
                question: "How does the AI email generator work?",
                answer: "Our AI analyzes the job posting, company information, and your resume to craft personalized outreach emails. Each email is tailored to highlight your relevant experience and express genuine interest in the specific role. You can edit and customize before sending."
              },
              {
                question: "Can I get a refund on unused credits?",
                answer: "Yes! If you're not satisfied with our platform within the first 14 days, we offer a full refund on any unused credits. After that period, credits are non-refundable but they never expire, so you can always use them later."
              },
              {
                question: "How accurate is the job matching?",
                answer: "Our AI-powered matching algorithm has a 95%+ accuracy rate based on user feedback. It analyzes your skills, experience, preferences, and career goals to find jobs that are genuinely relevant to you, saving you hours of manual searching."
              },
              {
                question: "Do credits expire?",
                answer: "No, your credits never expire. Once purchased, they're yours to use whenever you need them. Whether you're actively job hunting or just keeping an eye on the market, your credits will be there when you need them."
              },
              {
                question: "How do you find recruiter and CEO contact information?",
                answer: "We use a combination of public data sources, professional networks, and our proprietary database to compile accurate contact information. Our data is regularly verified and updated to ensure you're reaching the right people."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use bank-level encryption to protect your personal information and resume data. We never share your information with third parties without your explicit consent. Your job search remains private and confidential."
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-2xl shadow-md border border-[#b8c5d6]/20 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-[#22223b] text-lg pr-4">{faq.question}</span>
                  <ChevronDown className="h-5 w-5 text-[#5b6fa3] flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-[#4a4e69] leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="scroll-animate scroll-fade-up scroll-stagger-3 text-center mt-12">
            <p className="text-[#4a4e69] mb-4">Still have questions?</p>
            <Link
              href="mailto:support@jobsgpt.com"
              className="inline-flex items-center gap-2 text-[#4a4e69] font-semibold hover:text-[#22223b] transition-colors"
            >
              <Mail className="h-5 w-5" />
              Contact our support team
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-[#22223b] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" data-parallax="0.4"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" data-parallax="0.3"></div>
          </div>
        </div>
        <div className="relative max-w-2xl mx-auto text-center py-20 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="scroll-animate scroll-blur text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            <span className="block text-reveal">Ready to dive in?</span>
            <span className="block mt-2 text-reveal">Start your free trial today.</span>
          </h2>
          <p className="scroll-animate scroll-slide-up scroll-stagger-1 mt-6 text-lg leading-7 text-[#e8eef5] sm:text-xl">
            Join thousands of job seekers who have found their next role faster and easier with our platform.
          </p>
          <div className="scroll-animate scroll-scale scroll-stagger-2 mt-10">
            <Link
              href="/auth/register"
              className="magnetic inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-[#4a4e69] bg-white hover:bg-[#e8eef5] shadow-xl hover:shadow-2xl hover:scale-110 sm:w-auto transition-all duration-300"
            >
              Sign up for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
