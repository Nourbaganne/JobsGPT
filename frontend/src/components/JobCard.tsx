export interface Job {
    id: number;
    title: string;
    company: string;
    location?: string | null;
    url?: string | null;
    source?: string | null;
    score?: number | null;
    createdAt: Date | string;
}

/* Score is the only hue this card spends: mint once a match clears 80, amber
   while it sits in the 50–79 band, neutral below. Everything else — company,
   location, date, the footer action — reads in the surface palette, so a wall
   of cards colours only where the number means something. */
function scoreClass(score: number): string {
    if (score >= 80) return "score score--high";
    if (score >= 50) return "score score--mid";
    return "score";
}

export default function JobCard({ job }: { job: Job }) {
    return (
        <article className="panel flex h-full flex-col overflow-hidden">
            <div className="panel__header">
                <span className="min-w-0 truncate">{job.company}</span>
                {job.score !== null && job.score !== undefined && (
                    <span className={scoreClass(job.score)}>{job.score}% MATCH</span>
                )}
            </div>

            <div className="panel__body flex flex-1 flex-col">
                <h3 className="display text-h3 line-clamp-2 text-ink">{job.title}</h3>

                <p className="eyebrow tabular mt-2 text-dim">
                    {job.location || "Remote"}
                    <span className="mx-2" aria-hidden="true">
                        ·
                    </span>
                    {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>

                <div className="mt-6 flex flex-1 items-end">
                    <a
                        href={job.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta cta--secondary w-full justify-center"
                    >
                        View job
                        <span className="font-mono" aria-hidden="true">
                            →
                        </span>
                    </a>
                </div>
            </div>
        </article>
    );
}
