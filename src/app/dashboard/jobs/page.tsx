import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import JobCard from "@/components/JobCard";
import { redirect } from "next/navigation";

export default async function JobsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        redirect("/auth/login");
    }

    const userId = parseInt(session.user.id);

    const jobs = await db.job.findMany({
        where: { userId },
        orderBy: { score: "desc" },
    });

    return (
        <div className="space-y-8">
            <div className="scroll-animate scroll-fade-up md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="text-3xl font-bold leading-tight text-[#22223b] sm:text-4xl lg:text-5xl">
                        All Jobs
                    </h1>
                    <p className="mt-3 text-base text-[#4a4e69] sm:text-lg">
                        {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
                    </p>
                </div>
            </div>

            {jobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job, index) => (
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
                    <h3 className="text-lg font-semibold text-[#22223b]">No jobs found</h3>
                    <p className="mt-2 text-sm text-[#4a4e69] max-w-sm mx-auto">Start a search to discover job opportunities.</p>
                </div>
            )}
        </div>
    );
}
