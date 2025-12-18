'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const MasterUser = () => {

    const menu = [
        { label: "Data Master", href: "/" },
        { label: "Master User", href: "/datamaster/user", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <Table />
        </>
    )
}

export default MasterUser;