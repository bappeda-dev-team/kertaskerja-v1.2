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


    if (LoadingBranding) {
        return <IsLoadingBranding />;
    } else {
        return <>{children}</>
    }
}