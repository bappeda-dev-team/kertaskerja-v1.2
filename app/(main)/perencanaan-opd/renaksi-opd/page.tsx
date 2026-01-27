'use client'

import { Table } from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { Card, HeaderCard } from '@/components/ui/Card';

const Misi = () => {

    const menu = [
        { label: "Perencanaan OPD", href: "/" },
        { label: "Renaksi OPD", href: "/perencanaan-opd/renaksi-opd", active: true }
    ]

    const { branding } = useBrandingContext();
        const opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;

    return (
        <>
            <Breadcrumbs items={menu} />
            <Card>
                <HeaderCard>
                    <div className="flex flex-wrap items-end">
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold text-lg uppercase">Rencana Aksi OPD {branding?.tahun?.label}</h1>
                            {(branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ?
                                <h1 className="text-sm">{branding?.opd?.label || ''}</h1>
                                :
                                <h1 className="text-sm">{branding?.user?.nama_opd || ''}</h1>
                            }
                        </div>
                    </div>
                </HeaderCard>
                <div className="p-3">
                    <Table
                        tahun={branding?.tahun?.value ?? 0}
                        kode_opd={opd}
                    />
                </div>
            </Card>
        </>
    )
}

export default Misi;