import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import JobCard from "@/components/JobCard";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        redirect("/auth/login");
    }

    const userId = parseInt(session.user.id);

    const totalJobs = await db.job.count({
        where: { userId },
    });

    const topJobs = await db.job.findMany({
        where: { userId },
        orderBy: { score: "desc" },
        take: 5,
    });

    const user = await db.user.findUnique({
        where: { id: userId },
        select: { nextRun: true },
    });

    return (
        <div className="space-y-8">
            <div className="scroll-animate scroll-fade-up md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-bold leading-tight text-[#22223b] sm:text-4xl lg:text-5xl">
                        Dashboard
                    </h1>
                    <p className="mt-3 text-base text-[#4a4e69] sm:text-lg">
                        Welcome back! Here's an overview of your job search progress.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="scroll-animate scroll-fade-up scroll-scale scroll-stagger-1 group bg-white overflow-hidden shadow-lg rounded-2xl border border-[#c9ada7]/30 hover:shadow-2xl hover:border-[#9a8c98] transition-all duration-300 hover:-translate-y-1">
                    <div className="px-6 py-8 sm:p-8">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-gradient-to-br from-[#c9ada7] to-[#9a8c98] rounded-xl p-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-semibold text-[#4a4e69] uppercase tracking-wide truncate">
                                    Total Jobs Found
                                </dt>
                                <dd className="mt-2 text-4xl font-bold bg-gradient-to-r from-[#4a4e69] to-[#9a8c98] bg-clip-text text-transparent">
                                    {totalJobs}
                                </dd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="scroll-animate scroll-fade-up flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold leading-7 text-[#22223b] sm:text-3xl">
                            Top Matched Jobs
                        </h2>
                        <p className="mt-2 text-base text-[#4a4e69]">
                            Your highest-scoring job matches
                        </p>
                    </div>
                    <Link
                        href="/dashboard/jobs"
                        className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-[#4a4e69] bg-[#f2e9e4] rounded-xl hover:bg-[#c9ada7] hover:shadow-md transition-all duration-200 border border-[#c9ada7]"
                    >
                        View all
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                {topJobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {topJobs.map((job, index) => (
                            <div key={job.id} className={`scroll-animate scroll-fade-up scroll-scale scroll-stagger-${(index % 3) + 1}`}>
                                <JobCard job={job} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="scroll-animate scroll-fade-up text-center py-20 bg-white rounded-2xl shadow-sm border-2 border-dashed border-[#c9ada7]">
                        <div className="mx-auto h-16 w-16 bg-[#f2e9e4] rounded-full flex items-center justify-center mb-4">
                            <svg className="h-8 w-8 text-[#9a8c98]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#22223b]">No jobs found yet</h3>
                        <p className="mt-2 text-sm text-[#4a4e69] max-w-sm mx-auto">Try triggering a search to discover opportunities!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
