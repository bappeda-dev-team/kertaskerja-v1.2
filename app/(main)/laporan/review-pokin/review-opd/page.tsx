'use client'

import Table from './comp/Table';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { TahunNull } from '@/components/ui/OpdTahunNull';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const ReviewPokinOPD = () => {

    const { branding } = useBrandingContext();
    const opd = (branding?.user?.roles == "super_admin" || branding?.user?.roles == "reviewer") ? branding?.opd?.value : branding?.user?.opd
    const menu = [
        { label: "Laporan", href: "/" },
        { label: "Review Pokin", href: "/" },
        { label: "Pokin OPD", href: "/review-pokin/review-opd", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu}/>
            <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
                <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-5 py-5">
                    <h1 className="font-bold text-lg uppercase">Review Pokin OPD {branding?.tahun?.value}</h1>
                </div>
                <div className="flex flex-wrap m-2">
                    {(branding?.tahun?.value === undefined) ?
                        <div className="w-full">
                            <TahunNull />
                        </div>
                        :
                        <Table 
                            kode_opd={opd}
                            tahun={String(branding?.tahun?.value)}
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default ReviewPokinOPD;