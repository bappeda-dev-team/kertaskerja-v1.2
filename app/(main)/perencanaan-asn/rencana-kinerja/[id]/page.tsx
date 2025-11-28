'use client'

import { FiHome } from 'react-icons/fi';
import { ButtonGreen } from '@/components/ui/button';
import { AlertNotification } from '@/lib/alert';
import { useRouter, useParams } from 'next/navigation';
import { TbDeviceFloppy } from 'react-icons/tb';
import { useBrandingContext } from '@/providers/BrandingProvider';
import Musrebang from '@/components/pages/rencanakinerja/Rincian/Usulan';
import SubKegiatan from '@/components/pages/rencanakinerja/Rincian/SubKegiatan';
import Sakip from '@/components/pages/rencanakinerja/Rincian/Sakip';
import Renaksi from '@/components/pages/rencanakinerja/Rincian/Renaksi';
import DasarHukum from '@/components/pages/rencanakinerja/Rincian/DasarHukum';
import GambaranUmum from '@/components/pages/rencanakinerja/Rincian/GambaranUmum';
import Permasalahan from '@/components/pages/rencanakinerja/Rincian/Permasalahan';

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
                <>
                    <div className="my-5">
                        <Musrebang
                            id={id_rekin}
                            nip={branding?.user?.nip}
                        />
                        <SubKegiatan
                            id={id_rekin}
                            tahun={branding?.tahun?.value}
                            nip={branding?.user?.nip}
                            kode_opd={branding?.user?.kode_opd}
                        />
                        <Sakip id={id_rekin} />
                        <Renaksi id={id_rekin} />
                        <DasarHukum
                            id={id_rekin}
                            nip={branding?.user?.nip}
                        />
                        <GambaranUmum
                            id={id_rekin}
                            nip={branding?.user?.nip}
                        />
                        <Permasalahan
                            id={id_rekin}
                            nip={branding?.user?.nip}
                        />
                        {/* <Inovasi id={id_rekin}/> */}
                        <div className="w-full my-4">
                            <ButtonGreen
                                onClick={() => {
                                    AlertNotification("Tersimpan", "Data rincian rencana kinerja berhasil disimpan", "success", 2000);
                                    router.push('/rencanakinerja');
                                }}
                                className='w-full flex items-center gap-1'
                            >
                                <TbDeviceFloppy />
                                Selesai
                            </ButtonGreen>
                        </div>
                    </div>
                </>
                :
                <>
                    <Sakip id={id_rekin} />
                    <Renaksi id={id_rekin} />
                    <div className="w-full my-4">
                        <ButtonGreen
                            onClick={() => {
                                AlertNotification("Tersimpan", "Data rincian rencana kinerja berhasil disimpan", "success", 2000);
                                router.push('/rencanakinerja');
                            }}
                            className='w-full flex items-center gap-1'
                        >
                            <TbDeviceFloppy />
                            Selesai
                        </ButtonGreen>
                    </div>
                </>
            }
        </>
    )
}

export default RincianRencanaKinerja;