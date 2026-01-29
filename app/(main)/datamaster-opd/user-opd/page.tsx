'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const UserOpdPage = () => {

    const menu = [
        { label: "Data Master OPD", href: "/" },
        { label: "User OPD", href: "/datamaster-opd/user-opd", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <Table />
        </>
    )
}

export default UserOpdPage;