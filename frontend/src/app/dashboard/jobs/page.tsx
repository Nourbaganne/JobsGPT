"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";

export default function JobsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { jobs, fetchJobs, isLoading } = useUser();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchJobs();
        }
    }, [isAuthenticated, fetchJobs]);

    if (authLoading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin h-8 w-8 border-4 border-[#22223b] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="scroll-animate scroll-fade-up md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-bold leading-tight text-[#22223b] sm:text-4xl lg:text-5xl">
                        All Jobs
                    </h1>
                    <p className="mt-3 text-base text-[#4a4e69] sm:text-lg">
                        {isLoading ? "Loading..." : `${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'} found`}
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin h-8 w-8 border-4 border-[#22223b] border-t-transparent rounded-full" />
                </div>
            ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job, index) => (
                        <div key={job.id} className={`scroll-animate scroll-fade-up scroll-scale scroll-stagger-${(index % 3) + 1}`}>
                            <JobCard job={job} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="scroll-animate scroll-fade-up text-center py-20 bg-white rounded-2xl shadow-sm border-2 border-dashed border-[#b8c5d6]">
                    <div className="mx-auto h-16 w-16 bg-[#e8eef5] rounded-full flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-[#5b6fa3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#22223b]">No jobs found</h3>
                    <p className="mt-2 text-sm text-[#4a4e69] max-w-sm mx-auto">Start a search to discover job opportunities.</p>
                </div>
            )}
        </div>
    );
}
