'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { Card, HeaderCard } from '@/components/ui/Card';

const SubKegiatanOpdPage = () => {

    const menu = [
        { label: "Data Master OPD", href: "/" },
        { label: "Sub Kegiatan OPD", href: "/datamaster-opd/sub-kegiatan-opd", active: true }
    ]

    const { branding } = useBrandingContext();
    const opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;

    return (
        <>
            <Breadcrumbs items={menu} />
            <Card>
                <HeaderCard>
                    <div className="flex flex-wrap items-center justify-between gap-5 w-full">
                        <h1 className="font-bold text-lg uppercase">Sub Kegiatan OPD {branding?.tahun?.label}</h1>
                    </div>
                </HeaderCard>
                <Table
                    tahun={branding?.tahun?.value || 0}
                    opd={opd}
                />
            </Card>
        </>
    )
}

export default SubKegiatanOpdPage;