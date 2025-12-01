import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f2e9e4] via-white to-[#c9ada7]/20">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full">{children}</main>
            </div>
        </div>
    );
}
