import '@/components/ui/treeflex.css'
import { useState, useEffect, useRef } from 'react';
import { LoadingBeat } from '@/lib/loading';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { AlertNotification } from '@/lib/alert';
import { apiFetch } from '@/hook/apiFetch';
import { Pohon } from './Pohon';

interface pohontematik {
    id: number;
    show_all: boolean;
    jenis: "laporan" | "pemda" | ""
    set_show_all: () => void;
}
interface opd {
    kode_opd: string;
    nama_opd: string;
}

interface tematik {
    id: number;
    parent: number;
    tema: string;
    taget: string;
    satuan: string;
    keterangan: string;
    indikators: string;
    childs: childs[];
}
interface childs {
    id: number;
    parent: number;
    tema_sub_tematik: string;
    keterangan: string;
    kode_opd: opd;
    indikators: string;
    strategics: childs[];
}

const BridgeTematik = ({ id, jenis, show_all, set_show_all }: pohontematik) => {

    const { branding } = useBrandingContext();
    const [Pokin, setPokin] = useState<tematik[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');
    const [Deleted, setDeleted] = useState<boolean>(false);

    useEffect(() => {
        const fetchTematikKab = async () => {
            const API_URL_CASCADING_PEMDA = process.env.NEXT_PUBLIC_API_URL_CASCADING_PEMDA;
            setLoading(true);
            try {
                let url = "";
                if (jenis === "pemda") {
                    url = `${branding?.api_perencanaan}/pohon_kinerja_admin/tematik/${id}`;
                } else if (jenis === "laporan") {
                    url = `${API_URL_CASCADING_PEMDA}/laporan/cascading_pemda?tematikId=${id}&tahun=${branding?.tahun?.value}`;
                }
                await apiFetch(url, {
                }).then((resp: any) => {
                    // console.log(resp);
                    const data = resp?.data || [];
                    setPokin(data);
                }).catch(err => {
                    AlertNotification("Gagal", `${err}`, "error", 3000, true);
                    setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja tematik');
                })
            } catch (err) {
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja tematik');
            } finally {
                setLoading(false);
            }
        }
        if (id != undefined && branding?.tahun?.value != undefined) {
            fetchTematikKab();
        }
    }, [id, branding, Deleted, jenis]);

    if (error) {
        return (
            <h1 className="text-red-500">{error}</h1>
        )
    }
    if (Loading) {
        return (
            <LoadingBeat className="mx-5 py-5" />
        )
    }

    return (
        <>
            <ul>
                {jenis === "pemda" &&
                    <Pohon
                        user={branding?.user?.roles}
                        tema={Pokin}
                        tahun={String(branding?.tahun?.value)}
                        deleteTrigger={() => setDeleted((prev) => !prev)}
                        show_all={show_all}
                        set_show_all={set_show_all}
                    />
                }
            </ul>
        </>
    )
}

export default BridgeTematik;
