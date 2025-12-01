import { ExternalLink, MapPin, Building2, Calendar } from "lucide-react";

export interface Job {
    id: number;
    title: string;
    company: string;
    location?: string | null;
    url?: string | null;
    source?: string | null;
    score?: number | null;
    createdAt: Date;
}

export default function JobCard({ job }: { job: Job }) {
    return (
        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-[#c9ada7]/30 hover:shadow-2xl hover:border-[#9a8c98] transition-all duration-300 group hover:-translate-y-1">
            <div className="px-6 py-6">
                <div className="flex justify-between items-start mb-5">
                    <div className="flex-1 min-w-0 pr-3">
                        <h3 className="text-lg font-bold leading-6 text-[#22223b] group-hover:text-[#4a4e69] transition-colors line-clamp-2">
                            {job.title}
                        </h3>
                        <div className="mt-2.5 flex items-center text-sm text-[#4a4e69]">
                            <Building2 className="flex-shrink-0 mr-2 h-4 w-4 text-[#9a8c98]" />
                            <span className="truncate font-medium">{job.company}</span>
                        </div>
                    </div>
                    {job.score !== null && job.score !== undefined && (
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 shadow-sm ${
                            job.score >= 80 
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300' 
                                : job.score >= 50 
                                    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300'
                                    : 'bg-[#f2e9e4] text-[#4a4e69] border-2 border-[#c9ada7]'
                        }`}>
                            {job.score}% match
                        </span>
                    )}
                </div>
                
                <div className="mt-5 space-y-2.5">
                    <div className="flex items-center text-sm text-[#4a4e69]">
                        <MapPin className="flex-shrink-0 mr-2 h-4 w-4 text-[#9a8c98]" />
                        <span className="truncate">{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center text-sm text-[#4a4e69]">
                        <Calendar className="flex-shrink-0 mr-2 h-4 w-4 text-[#9a8c98]" />
                        <span>{new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
                
                <div className="mt-6 pt-5 border-t border-[#c9ada7]/30">
                    <a
                        href={job.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#4a4e69] to-[#9a8c98] hover:from-[#22223b] hover:to-[#4a4e69] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a4e69] transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
                    >
                        View Job
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
