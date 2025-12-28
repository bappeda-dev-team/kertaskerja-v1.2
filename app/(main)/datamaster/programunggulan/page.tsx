'use client'

// import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const MasterProgramUnggulan = () => {

    const menu = [
        { label: "Data Master", href: "/" },
        { label: "Master Program Unggulan", href: "/datamaster/programunggulan", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            {/* <Table /> */}
            halaman program unggulan
        </>
    )
}

export default MasterProgramUnggulan;