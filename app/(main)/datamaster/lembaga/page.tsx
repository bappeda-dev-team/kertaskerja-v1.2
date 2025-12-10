'use client'

import Table from './comp/Table';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { TahunNull } from '@/components/ui/OpdTahunNull';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const LaporanRincianBelanja = () => {

    const { branding } = useBrandingContext();
    const menu = [
        { label: "Data Master", href: "/" },
        { label: "Master Lembaga", href: "/datamaster/lembaga", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
                <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-5 py-5">
                    <h1 className="font-bold text-lg uppercase">Master Lembaga</h1>
                </div>
                <div className="flex flex-wrap m-2">
                    <Table />
                </div>
            </div>
        </>
    )
}

export default LaporanRincianBelanja;