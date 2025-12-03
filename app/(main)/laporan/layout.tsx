'use client'

import { useBrandingContext } from "@/providers/BrandingProvider";
import { IsLoadingBranding } from "@/lib/loading";

interface PerencanaanAsnLayout {
    children: React.ReactNode;
}

export default function LaporanLayout({
    children
}: PerencanaanAsnLayout) {

    const {LoadingBranding, branding} = useBrandingContext()
    
    if(LoadingBranding){
        return <IsLoadingBranding />
    } else {
        return<>{children}</>
    }
}