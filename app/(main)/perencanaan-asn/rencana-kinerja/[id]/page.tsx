'use client'

import { FiHome } from 'react-icons/fi';
import { ButtonGreen } from '@/components/ui/button';
import { AlertNotification } from '@/lib/alert';
import { useRouter, useParams } from 'next/navigation';
import { TbDeviceFloppy } from 'react-icons/tb';
import { useBrandingContext } from '@/providers/BrandingProvider';

const RincianRencanaKinerja = () => {

    const params = useParams();
    const router = useRouter();
    const id_rekin = params.id as string;
    const {branding} = useBrandingContext();

    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Rencana Kinerja</p>
                <p>/ Nama sub kegiatan</p>
            </div>
            {branding?.user?.roles != 'level_4' ?
                <>rincian rekin level 4</>
                :
                <>
                    rincian rekin bukan level 4
                </>
            }
        </>
    )
}

export default RincianRencanaKinerja;