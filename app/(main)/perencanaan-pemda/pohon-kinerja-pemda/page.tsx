'use client'

import { Breadcrumbs } from '@/components/ui/breadcrumb';
import CardTermatik from './comp/CardTematik';

const PohonKinerjaPemda = () => {

    const menu = [
        { label: "Perencanaan Pemda", href: "/" },
        { label: "Pohon Kinerja Pemda", href: "/perencanaan-pemda/pohon-kinerja-pemda", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <CardTermatik />
        </>
    )
}

export default PohonKinerjaPemda;