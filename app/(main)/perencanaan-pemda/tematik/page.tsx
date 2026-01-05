'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const Tematik = () => {

    const menu = [
        { label: "Perencanaan Pemda", href: "/" },
        { label: "Tematik", href: "/perencanaan-pemda/tematik", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <Table />
        </>
    )
}

export default Tematik;