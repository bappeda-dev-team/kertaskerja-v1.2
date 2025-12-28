'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const MasterJabatan = () => {

    const menu = [
        { label: "Data Master", href: "/" },
        { label: "Master Jabatan", href: "/datamaster/jabatan", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <Table />
        </>
    )
}

export default MasterJabatan;