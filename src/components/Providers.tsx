"use client";

import { SessionProvider } from "next-auth/react";
import LenisProvider from "./LenisProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LenisProvider>{children}</LenisProvider>
        </SessionProvider>
    );
}
