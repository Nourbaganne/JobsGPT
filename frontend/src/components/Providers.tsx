"use client";

import { AuthProvider } from "./AuthProvider";
import LenisProvider from "./LenisProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <LenisProvider>{children}</LenisProvider>
        </AuthProvider>
    );
}
