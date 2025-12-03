'use client'

import Table from "./Table";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { TahunNull } from "@/components/ui/OpdTahunNull";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { IsLoadingBranding } from "@/lib/loading";

const ControlPokin = () => {

    const menu = [
        { label: "Laporan", href: "/" },
        { label: "Leaderboard Rekin", href: "/laporan/leaderboard-rekin", active: true }
    ]
    const { LoadingBranding, branding } = useBrandingContext();

    if (LoadingBranding) {
        return <IsLoadingBranding />
    } else {
        if (branding?.tahun?.value === undefined || branding?.tahun?.value === null) {
            return (
                <TahunNull />
            )
        }
        else {
            return (
                <>
                    <Breadcrumbs items={menu} />
                    <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
                        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-5 py-5">
                            <h1 className="font-bold text-lg uppercase">Leaderboard Rekin {branding?.tahun?.label}</h1>
                        </div>
                        <div className="flex m-2">
                            <Table />
                        </div>
                    </div>
                </>
            )
        }
    }
}

export default ControlPokin;