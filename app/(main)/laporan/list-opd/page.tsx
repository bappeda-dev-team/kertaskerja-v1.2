'use client'

import Table from './Table';
import { FiHome } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { TahunNull } from '@/components/ui/OpdTahunNull';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const LaporanRincianBelanja = () => {

    const { branding } = useBrandingContext();
    const menu = [
        { label: "Laporan", href: "/" },
        { label: "List OPD di Tematik", href: "/laporan/list-opd", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu}/>
            <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
                <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-5 py-5">
                    <h1 className="font-bold text-lg uppercase">List OPD di Tematik tahun {branding?.tahun?.value}</h1>
                </div>
                <div className="flex flex-wrap m-2">
                    {(branding?.tahun?.value === undefined) ?
                        <div className="w-full">
                            <TahunNull />
                        </div>
                        :
                        <Table />
                    }
                </div>
            </div>
        </>
    )
}

export default LaporanRincianBelanja;