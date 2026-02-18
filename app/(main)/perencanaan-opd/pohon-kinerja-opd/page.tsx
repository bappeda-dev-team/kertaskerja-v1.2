import { Breadcrumbs } from '@/components/ui/breadcrumb';
import HeadPohon from './comp/HeadPohon';

const PohonKinerjaPemda = () => {

    const menu = [
        { label: "Perencanaan OPD", href: "/" },
        { label: "Pohon Kinerja OPD", href: "/perencanaan-opd/pohon-kinerja-opd", active: true }
    ]

    return (
        <>
            <Breadcrumbs items={menu} />
            <HeadPohon />
        </>
    )
}

export default PohonKinerjaPemda;