'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const MasterLembaga = () => {

    const menu = [
        { label: "Data Master", href: "/" },
        { label: "Master OPD", href: "/datamaster/opd", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <Table />
        </>
    )
}

export default MasterLembaga;