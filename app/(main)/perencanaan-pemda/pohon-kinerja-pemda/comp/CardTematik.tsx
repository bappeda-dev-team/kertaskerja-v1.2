'use client'

import { apiFetch } from '@/hook/apiFetch';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select'
import { useRouter, useSearchParams } from 'next/navigation';
import { TbEye} from 'react-icons/tb';
import { ButtonBlackBorder } from '@/components/ui/button';
import { AlertNotification } from '@/lib/alert';
import { useBrandingContext } from '@/providers/BrandingProvider';
import BridgeTematik from './BridgeTematik';

interface OptionType {
    value: number;
    label: string;
}

const CardTematik = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [TematikOption, setTematikOption] = useState<OptionType[]>([]);
    const [Tematik, setTematik] = useState<OptionType | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const {branding} = useBrandingContext();

    // SHOW ALL
    const [ShowAll, setShowAll] = useState<boolean>(false);

    useEffect(() => {
        // Ambil parameter dari URL saat komponen dimuat
        const temaFromUrl = searchParams.get('tema');
        const idFromUrl = searchParams.get('id');

        if (temaFromUrl && idFromUrl) {
            // Set Tematik berdasarkan parameter URL jika ada
            setTematik({ label: temaFromUrl, value: Number(idFromUrl) });
        }
    }, [searchParams]);

    const fetchTematik = async () => {
        setIsLoading(true);
        try {
            setIsLoading(true);
            await apiFetch(`${branding?.api_perencanaan}/tematik_pemda/${branding?.tahun?.value}`, {
            }).then((resp: any) => {
                // console.log(resp);
                const data = resp.data.tematiks;
                const tema = data.map((item: any) => ({
                    value: item.id,
                    label: item.tema,
                }));
                setTematikOption(tema);
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            })
        } catch (err) {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetTematik = (tema: any) => {
        if (!tema) {
            setTematik(null); // Jika tema dihapus, reset Tematik
            router.push(`/perencanaan-pemda/pohon-kinerja-pemda`);
            return;
        }
        setTematik(tema);
        router.push(`/perencanaan-pemda/pohon-kinerja-pemda?tema=${tema.label}&id=${tema.value}`);
    };

    return (
        <>
            <div className="flex flex-col p-5 border border-gray-300 rounded-xl mt-3">
                <div className="flex flex-col">
                    <label
                        className="uppercase text-xs font-bold mb-2"
                        htmlFor="tematik"
                    >
                        Tematik :
                    </label>
                    <Select
                        isSearchable
                        isClearable
                        options={TematikOption}
                        isLoading={IsLoading}
                        onChange={(option) => {
                            handleSetTematik(option)
                            setShowAll(false);
                        }}
                        placeholder="Masukkan Tema"
                        value={
                            searchParams.get('tema') === undefined || !Tematik ?
                                { label: "Pilih Tematik", value: "" }
                                :
                                { label: Tematik?.label, value: Tematik?.value }
                        }
                        onMenuOpen={() => {
                            if (TematikOption.length == 0) {
                                fetchTematik();
                            }
                        }}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                            })
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between p-5 border border-gray-300 rounded-t-xl mt-2">
                {!Tematik ?
                    <h1 className="font-semibold">Pilih Tematik terlebih dahulu</h1>
                    :
                    <>
                        <ButtonBlackBorder
                            onClick={() => {
                                if (ShowAll) {
                                    setShowAll(false);
                                } else {
                                    setShowAll(true);
                                }
                            }}
                        >
                            <TbEye className='mr-1' />
                            {ShowAll ?
                                'Sembunyikan Semua Pohon'
                                :
                                'Tampilkan Semua Pohon'
                            }
                        </ButtonBlackBorder>
                    </>
                }
            </div>
            {Tematik &&
                <div className='flex flex-col py-3 px-3 border-b-2 border-x-2 border-gray-300 rounded-b-xl relative w-full h-[calc(100vh-50px)] max-h-screen overflow-auto'>
                    <div className="flex flex-col p-2 rounded-b-xl">
                        <div ref={containerRef} className="tf-tree text-center mt-3">
                            <BridgeTematik
                                id={Tematik?.value}
                                show_all={ShowAll}
                                jenis='pemda'
                                set_show_all={() => {
                                    setShowAll(true)
                                }}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default CardTematik;