import { Breadcrumbs } from '@/components/ui/breadcrumb';
import HeadCascading from '../../perencanaan-opd/pohon-cascading-opd/comp/HeadCascading';

const PohonKinerjaPemda = () => {

    const menu = [
        { label: "Laporan", href: "/" },
        { label: "Laporan Cascading OPD", href: "/laporan/laporan-casacding-opd", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <HeadCascading jenis="laporan"/>
        </>
    )
}

export default PohonKinerjaPemda;