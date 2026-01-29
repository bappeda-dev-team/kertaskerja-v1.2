'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const MasterPegawaiPage = () => {

    const menu = [
        { label: "Data Master", href: "/" },
        { label: "Master Pegawai", href: "/datamaster/pegawai", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <Table />
        </>
    )
}

export default MasterPegawaiPage;