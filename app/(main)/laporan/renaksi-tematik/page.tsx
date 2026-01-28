'use client'

import { Table } from "./comp/Table";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { OpdNull, TahunNull } from "@/components/ui/OpdTahunNull";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

const RenaksiTematikPage = () => {

    const { branding } = useBrandingContext();

    const menu = [
        { label: "Laporan", href: "/" },
        { label: "Renaksi Tematik", href: "/laporan/renaksi-tematik", active: true }
    ]

    if ((branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') && (branding?.opd?.value === undefined || branding?.opd?.value === null)) {
        return (
            <OpdNull />
        )
    } else if (branding?.tahun?.value === undefined || branding?.tahun?.value === null) {
        return (
            <TahunNull />
        )
    }
    else {
        return (
            <>
                <Breadcrumbs items={menu} />
                <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex flex-col justify-between border-b border-gray-200 px-5 py-5">
                        <h1 className="font-bold text-lg uppercase">Renaksi Tematik</h1>
                        <h1 className="text-sm">Rekap pohon dengan tagging di <span className="font-bold text-blue-700">{branding?.tahun?.label || ''}</span></h1>
                    </div>
                    <div className="flex m-2">
                        <Table tahun={branding?.tahun?.value} />
                    </div>
                </div>
            </>
        )
    }

}

export default RenaksiTematikPage;