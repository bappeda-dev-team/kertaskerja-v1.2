import { Breadcrumbs } from '@/components/ui/breadcrumb';
import HeadCascading from './comp/HeadCascading';

const PohonKinerjaPemda = () => {

    const menu = [
        { label: "Perencanaan OPD", href: "/" },
        { label: "Pohon Casacding OPD", href: "/perencanaan-opd/pohon-casacding-opd", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <HeadCascading jenis="non-laporan" />
        </>
    )
}

export default PohonKinerjaPemda;