"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";

/* The count is a figure on a control surface, so it takes the mono face and
   the h2 tracking — --track-h1 was cut for a 62px sans, not for mono at 38px. */
const FIGURE =
    "display tabular text-h2 tracking-[var(--track-h2)] text-ink";

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { topJobs, jobCount, fetchTopJobs, fetchJobCount, isLoading } = useUser();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTopJobs(5);
            fetchJobCount();
        }
    }, [isAuthenticated, fetchTopJobs, fetchJobCount]);

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
                    <p className="eyebrow">OVERVIEW</p>
                    <h1 className="display text-h2 mt-4 text-ink">Dashboard</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="panel scroll-animate scroll-stagger-1 overflow-hidden">
                    <div className="panel__body">
                        <p className="label">Total jobs found</p>
                        <p className={`${FIGURE} mt-4`}>{isLoading ? "..." : jobCount}</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="scroll-animate mb-6 flex items-end justify-between gap-6">
                    <div>
                        <h2 className="display text-h3 text-ink">Top matches</h2>
                        <p className="text-body-sm mt-2 text-muted">
                            Your highest-scoring results.
                        </p>
                    </div>
                    {/* Neutral by design: the score badges below already spend this
                        viewport's hue budget, and azure here would compete with them. */}
                    <Link href="/dashboard/jobs" className="cta cta--ghost shrink-0">
                        View all
                        <span className="font-mono" aria-hidden="true">
                            →
                        </span>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <span className="spinner text-dim" aria-hidden="true" />
                        <span className="sr-only">Loading</span>
                    </div>
                ) : topJobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {topJobs.map((job, index) => (
                            <div key={job.id} className={`scroll-animate scroll-stagger-${(index % 3) + 1}`}>
                                <JobCard job={job} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state scroll-animate">
                        <p className="eyebrow">NO RESULTS YET</p>
                        <p className="text-body max-w-[46ch] text-muted">
                            Nothing has been matched against your resume so far. Run a search and
                            the queue will fill in.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
