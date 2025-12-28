'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const MasterJabatan = () => {

    const menu = [
        { label: "Data Master", href: "/" },
        { label: "Program Kegiatan", href: "/" },
        { label: "Bidang Urusan", href: "/datamaster/programkegiatan/bidang-urusan", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <Table />
        </>
    )
}

export default MasterJabatan;