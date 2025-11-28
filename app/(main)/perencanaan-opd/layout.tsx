'use client'

// Import lainnya (forbidden, useBrandingContext, IsLoadingBranding)
import { useBrandingContext } from "@/providers/BrandingProvider"; 
import { IsLoadingBranding } from "@/lib/loading";
import { forbidden } from "next/navigation";

interface PerencanaanAsnLayoutProps {
    children: React.ReactNode;
}

export default function PerencanaanOpdLayout({
    children
}: PerencanaanAsnLayoutProps) {

    const { LoadingBranding, branding } = useBrandingContext();
    const allowedRoles = ["super_admin", "admin_opd"];

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