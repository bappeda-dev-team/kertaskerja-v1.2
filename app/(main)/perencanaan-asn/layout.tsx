'use client'

// Import lainnya (forbidden, useBrandingContext, IsLoadingBranding)
import { useBrandingContext } from "@/providers/BrandingProvider"; 
import { IsLoadingBranding } from "@/lib/loading";
import { forbidden } from "next/navigation";

interface PerencanaanAsnLayoutProps {
    children: React.ReactNode;
}

export default function PerencanaanAsnLayout({
    children
}: PerencanaanAsnLayoutProps) {

    const { LoadingBranding, branding } = useBrandingContext();
    const allowedRoles = ["level_1", "level_2", "level_3", "level_4"];

    const user: string[] = branding?.user?.roles || []; 
    const isAuthorized = user.some(role => allowedRoles.includes(role));

    if (LoadingBranding) {
        return <IsLoadingBranding />;
    } else {
        if (isAuthorized) {
            return <>{children}</>
        } else {
            return forbidden();
        }
    }
}