'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const MasterLembaga = () => {

    const menu = [
        { label: "Perencanaan Pemda", href: "/" },
        { label: "RPJMD", href: "/perencanaan-pemda/RPJMD/visi" },
        { label: "Visi", href: "/perencanaan-pemda/RPJMD/visi", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <Table />
        </>
    )
}

export default MasterLembaga;