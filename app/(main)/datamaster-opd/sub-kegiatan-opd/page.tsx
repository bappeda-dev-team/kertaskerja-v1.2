'use client'

// import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';

const SubKegiatanOpdPage = () => {

    const menu = [
        { label: "Data Master OPD", href: "/" },
        { label: "Sub Kegiatan OPD", href: "/datamaster-opd/sub-kegiatan-opd", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            {/* <Table /> */}
        </>
    )
}

export default SubKegiatanOpdPage;