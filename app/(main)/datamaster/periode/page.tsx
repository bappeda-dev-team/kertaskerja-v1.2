'use client'

// import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const MasterPeriode = () => {

    const menu = [
        { label: "Data Master", href: "/" },
        { label: "Master Periode", href: "/datamaster/periode", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            {/* <Table /> */}
        </>
    )
}

export default MasterPeriode;