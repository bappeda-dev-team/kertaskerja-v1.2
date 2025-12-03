'use client'

import Table from './comp/Table';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { TahunNull } from '@/components/ui/OpdTahunNull';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const ReviewPokinPemda = () => {

    const { branding } = useBrandingContext();
    const menu = [
        { label: "Laporan", href: "/" },
        { label: "Review Pokin", href: "/" },
        { label: "Pokin Pemda", href: "/review-pokin/review-pemda", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu}/>
            <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
                <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-5 py-5">
                    <h1 className="font-bold text-lg uppercase">Review Pokin Pemda {branding?.tahun?.value}</h1>
                </div>
                <div className="flex flex-wrap m-2">
                    {(branding?.tahun?.value === undefined) ?
                        <div className="w-full">
                            <TahunNull />
                        </div>
                        :
                        <Table 
                            tahun={String(branding?.tahun?.value)}
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default ReviewPokinPemda;