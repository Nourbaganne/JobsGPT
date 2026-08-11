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
            <div className="flex min-h-[50vh] items-center justify-center">
                <span className="spinner text-dim" aria-hidden="true" />
                <span className="sr-only">Loading</span>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="scroll-animate md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <p className="eyebrow">SEARCH RESULTS</p>
                    <h1 className="display text-h2 mt-4 text-ink">All jobs</h1>
                    <p className="eyebrow tabular mt-4 text-dim">
                        {isLoading ? "Loading..." : `${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'} found`}
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <span className="spinner text-dim" aria-hidden="true" />
                    <span className="sr-only">Loading</span>
                </div>
            ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job, index) => (
                        <div key={job.id} className={`scroll-animate scroll-stagger-${(index % 3) + 1}`}>
                            <JobCard job={job} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state scroll-animate">
                    <p className="eyebrow">NO RESULTS</p>
                    <p className="text-body max-w-[46ch] text-muted">
                        No openings are on the record yet. Start a search and matches will land
                        here as they are scored.
                    </p>
                </div>
            )}
        </div>
    );
}
