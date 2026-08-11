import SettingsForm from "@/components/SettingsForm";

export default function SettingsPage() {
    return (
        <div className="mx-auto max-w-3xl">
            <div className="scroll-animate mb-10">
                <h1 className="display text-h2 text-ink">Settings</h1>
                <p className="text-lead mt-4 max-w-[56ch] text-muted">
                    The resume the scan scores against, and the keywords it runs on.
                </p>
            </div>
            <div className="scroll-animate scroll-stagger-1">
                <SettingsForm />
            </div>
        </div>
    );
}
