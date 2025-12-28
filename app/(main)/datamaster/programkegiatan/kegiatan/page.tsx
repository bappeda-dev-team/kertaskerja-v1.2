'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const MasterJabatan = () => {

    const menu = [
        { label: "Data Master", href: "/" },
        { label: "Program Kegiatan", href: "/" },
        { label: "Program", href: "/datamaster/programkegiatan/kegiatan", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <Table />
        </>
    )
}

export default MasterJabatan;