import SettingsForm from "@/components/SettingsForm";

export default function SettingsPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="scroll-animate scroll-fade-up mb-10">
                <h1 className="text-3xl font-bold leading-tight text-[#22223b] sm:text-4xl lg:text-5xl">
                    Settings
                </h1>
                <p className="mt-3 text-base text-[#4a4e69] sm:text-lg">
                    Manage your profile and resume.
                </p>
            </div>
            <div className="scroll-animate scroll-fade-up scroll-stagger-1">
                <SettingsForm />
            </div>
        </div>
    );
}
