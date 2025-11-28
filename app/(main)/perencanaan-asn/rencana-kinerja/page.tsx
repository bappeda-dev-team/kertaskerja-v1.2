'use client'

import { useEffect, useState } from 'react';
import { TablePerencanaan } from './comp/Table';
import { FiHome } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { TahunNull } from '@/components/ui/OpdTahunNull';
import { useBrandingContext } from '@/providers/BrandingProvider';

const RencanaKinerja = () => {

    const [Loading, setLoading] = useState<boolean>(false);
    const {branding} = useBrandingContext();
    const router = useRouter();

    if (branding?.tahun?.value == undefined) {
        return (
            <>
                <div className="mt-3 rounded-xl shadow-lg border">
                    <TahunNull />
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="flex items-center">
                    <a href="/" className="mr-1"><FiHome /></a>
                    <p className="mr-1">/ Perencanaan</p>
                    <p>/ Rencana Kinerja</p>
                </div>
                <div className="mt-3 rounded-xl shadow-lg border">
                    <TablePerencanaan />
                </div>
            </>
        )
    }
}

export default RencanaKinerja;