'use client'

import '@/components/ui/treeflex.css'
import React, { useState, useEffect, useRef } from 'react';
import { TbCheck, TbCirclePlus, TbHandStop, TbPointer, TbSettings, TbHourglass, TbEye, TbPrinter } from 'react-icons/tb';
import { ButtonSkyBorder, ButtonRedBorder, ButtonBlackBorder, ButtonSky } from '@/components/ui/button';
import { LoadingBeat, LoadingButton } from '@/lib/loading';
import { OpdTahunNull, TahunNull } from '@/components/ui/OpdTahunNull';
import { FormPohonOpd } from './FormPohonOpd';
// import { ModalPohonPemda, ModalPohonCrosscutting } from './ModalPohonPemda';
// import { ModalTujuanOpd } from '../../tujuanopd/ModalTujuanOpd';
// import { ModalClone } from '../ModalClone';
import { AlertNotification } from '@/lib/alert';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { OptionType } from '@/types';
import { apiFetch } from '@/hook/apiFetch';
import { PohonOpd } from './PohonOpd';

interface PokinPemda {
    value: number;
    label: string;
    jenis: string;
}
interface pokin {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    tujuan_opd: tujuan[];
    childs: childs[]
}
interface tujuan {
    id: number;
    tujuan: string;
}
interface childs {
    id: number;
    parent: number;
    strategi: string;
    target: string;
    satuan: string;
    keterangan: string;
    indikators: string;
    childs: childs[];
}

const HeadPohon = () => {

    const { branding } = useBrandingContext();
    const [Pokin, setPokin] = useState<pokin | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);

    const [Kendali, setKendali] = useState<boolean>(true);
    const [OpenModalTujuanOpd, setOpenModalTujuanOpd] = useState<boolean>(false);

    //rekapitulasi jumlah pohon dari pemda
    const [LoadingTotalPending, setLoadingTotalPending] = useState<boolean>(false);
    const [JumlahPemdaStrategic, setJumlahPemdaStrategic] = useState<PokinPemda[]>([]);
    const [JumlahPemdaTactical, setJumlahPemdaTactical] = useState<PokinPemda[]>([]);
    const [JumlahPemdaOperational, setJumlahPemdaOperational] = useState<PokinPemda[]>([]);

    //pohon pemda
    const [PohonPemda, setPohonPemda] = useState<boolean>(false);
    const [TriggerAfterPokinOutside, setTriggerAfterPokinOutside] = useState<boolean>(false);
    const [LevelPemda, setLevelPemda] = useState<number>(0);

    const [LoadingTotalPemda, setLoadingTotalPemda] = useState<boolean>(false);
    const [StrategicPemdaLength, setStrategicPemdaLenght] = useState<number>(0);
    const [TacticalPemdaLength, setTacticalPemdaLenght] = useState<number>(0);
    const [OperationalPemdaLength, setOperationalPemdaLenght] = useState<number>(0);

    //pohon cross opd lain
    const [LoadingTotalCrosscutting, setLoadingTotalCrosscutting] = useState<boolean>(false);
    const [PohonCrosscutting, setPohonCrosscutting] = useState<boolean>(false);
    const [CrossPending, setCrossPending] = useState<number | null>(null);
    const [CrossDitolak, setCrossDitolak] = useState<number | null>(null);

    //clone
    const [Clone, setClone] = useState<boolean>(false);

    //show all
    const [ShowAll, setShowAll] = useState<boolean>(false);
    const [ShowAllDetail, setShowAllDetail] = useState<boolean>(false);

    const [error, setError] = useState<string>('');

    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [Deleted, setDeleted] = useState<boolean>(false);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });
    const [cursorMode, setCursorMode] = useState<"normal" | "hand">("normal");
    const containerRef = useRef<HTMLDivElement | null>(null);

    const toggleCursorMode = () => {
        setCursorMode((prevMode) => (prevMode === "normal" ? "hand" : "normal"));
    }
    const handleMouseDown = (e: React.MouseEvent) => {
        if (cursorMode === "normal") return; // Ignore if cursor is normal

        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        if (containerRef.current) {
            setScrollStart({
                x: containerRef.current.scrollLeft,
                y: containerRef.current.scrollTop,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        const dx = dragStart.x - e.clientX;
        const dy = dragStart.y - e.clientY;
        containerRef.current.scrollLeft = scrollStart.x + dx;
        containerRef.current.scrollTop = scrollStart.y + dy;
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleModalPohonPemda = (level: number) => {
        setPohonPemda((prev) => !prev);
        setLevelPemda(level);
    }
    const handleModalCrosscutting = () => {
        setPohonCrosscutting((prev) => !prev);
    }
    const handleTriggerAfterPokinOutside = () => {
        setTriggerAfterPokinOutside((prev) => !prev);
    }

    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };

    const handleModalNewTujuan = () => {
        if (OpenModalTujuanOpd) {
            setOpenModalTujuanOpd(false);
        } else {
            setOpenModalTujuanOpd(true);
        }
    }

    // FETCH SEMUA POHON OPD
    useEffect(() => {
        const fetchPokinOpd = async (url: string) => {
            //FETCH POKIN OPD
            setLoading(true);
            await apiFetch(`${branding?.api_perencanaan}/${url}`, {
                method: "GET"
            }).then((result: any) => {
                const data = result.data || [];
                setPokin(data);
            }).catch((err) => {
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja perangkat daerah');
                console.error(err);
            }).finally(() => {
                setLoading(false);
            })
        }
        if (branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') {
            if (branding?.opd?.value != undefined && branding?.tahun?.value != undefined) {
                fetchPokinOpd(`pohon_kinerja_opd/findall/${branding?.opd?.value}/${branding?.tahun?.value}`);
            }
        } else if (branding?.user?.roles != 'super_admin') {
            if (branding?.user?.kode_opd != undefined && branding?.tahun?.value != undefined) {
                fetchPokinOpd(`pohon_kinerja_opd/findall/${branding?.user?.kode_opd}/${branding?.tahun?.value}`);
            }
        }
    }, [branding, TriggerAfterPokinOutside]);

    // FETCH STATUS POHON PEMDA & CROSSCUTTING DI CONTROL POKIN 
    useEffect(() => {
        const fetchControlPokin = async () => {
            //FETCH JUMLAH POHON PEMDA YANG DITERIMA
            setLoadingTotalPending(true);
            const url = (branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ? `pohon_kinerja_opd/count_pokin_pemda/${branding?.opd?.value}/${branding?.tahun?.value}` : `pohon_kinerja_opd/count_pokin_pemda/${branding?.user?.kode_opd}/${branding?.tahun?.value}`;
            await apiFetch(`${branding?.api_perencanaan}/${url}`, {
                method: "GET"
            }).then((result: any) => {
                const data = result.data.detail_level || [];
                if (data.length !== 0) {
                    // console.log('strategic : ', data[0].jumlah_pemda, 'tactical : ', data[0].jumlah_pemda, 'operatiocal : ', data[0].jumlah_pemda);
                    setStrategicPemdaLenght(data[0].jumlah_pemda);
                    setTacticalPemdaLenght(data[1].jumlah_pemda);
                    setOperationalPemdaLenght(data[2].jumlah_pemda);
                } else {
                    return null;
                }
            }).catch((err) => {
                setError('gagal mendapatkan data pohon pemda yang diterima, terdapat kesalahan backend/server saat mengambil data pohon kinerja perangkat daerah');
                console.error(err);
            }).finally(() => {
                setLoadingTotalPending(false);
            })
            //FETCH STATUS POHON PEMDA
            setLoadingTotalPemda(true);
            const url_status_total_pemda =
                (
                    branding?.user?.roles == 'super_admin' ||
                    branding?.user?.roles == 'reviewer'
                )
                    ?
                    `pohon_kinerja/status/${branding?.opd?.value}/${branding?.tahun?.value}`
                    :
                    `pohon_kinerja/status/${branding?.user?.kode_opd}/${branding?.tahun?.value}`;
            await apiFetch(`${branding?.api_perencanaan}/${url_status_total_pemda}`, {
                method: "GET"
            }).then((result: any) => {
                const data = result.data || [];
                if (data) {
                    const Strategic = data.filter((item: any) => item.level_pohon == 4);
                    setJumlahPemdaStrategic(Strategic);
                    const Tactical = data.filter((item: any) => item.level_pohon == 5);
                    setJumlahPemdaTactical(Tactical);
                    const Operational = data.filter((item: any) => item.level_pohon == 6);
                    setJumlahPemdaOperational(Operational);
                }
            }).catch((err) => {
                setError('gagal mendapatkan data status pohon pemda, terdapat kesalahan backend/server saat mengambil data pohon kinerja perangkat daerah');
                console.error(err);
            }).finally(() => {
                setLoadingTotalPemda(false);
            })
            //FETCH STATUS POHON CROSSCUTTING
            setLoadingTotalCrosscutting(true);
            const url_status_cross = (branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ? `crosscutting_menunggu/${branding?.opd?.value}/${branding?.tahun?.value}` : `crosscutting_menunggu/${branding?.user?.kode_opd}/${branding?.tahun?.value}`;
            await apiFetch(`${branding?.api_perencanaan}/${url_status_cross}`, {
                method: "GET"
            }).then((result: any) => {
                const data = result.data || [];
                if (data) {
                    const pending = data.filter((item: any) => item.status === "crosscutting_menunggu");
                    setCrossPending(pending.length);
                    const ditolak = data.filter((item: any) => item.status === "crosscutting_ditolak");
                    setCrossDitolak(ditolak.length);
                }
            }).catch((err) => {
                setError('gagal mendapatkan data status pohon crosscutting, terdapat kesalahan backend/server saat mengambil data pohon kinerja perangkat daerah');
                console.error(err);
            }).finally(() => {
                setLoadingTotalCrosscutting(false);
            })
        }
        fetchControlPokin();
    }, [Deleted, branding, TriggerAfterPokinOutside]);

    if (Loading) {
        return (
            <>
                <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                    <h1>Pohon Kinerja {branding?.opd?.label}</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    <LoadingBeat />
                </div>
            </>
        )
    }
    if (error) {
        return (
            <>
                <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                    <h1>Pohon Kinerja</h1>
                </div>
                <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                    {error}
                </div>
            </>
        )
    }
    if (branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') {
        if (branding?.opd?.value == undefined || branding?.tahun?.value == undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                        <h1>Pohon Kinerja {branding?.opd?.label}</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            )
        }
    }
    if (branding?.user?.roles != 'super_admin') {
        if (branding?.tahun?.value == undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border-2 rounded-t-xl mt-2">
                        <h1>Pohon Kinerja {branding?.opd?.label}</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <TahunNull />
                    </div>
                </>
            )
        }
    }

    return (
        <>
            <div className="flex justify-between items-center p-5 border rounded-t-xl mt-2">
                {(branding?.user?.roles == 'super_admin' || branding?.user?.roles === 'reviewer') ?
                    <h1 className="font-bold">Pohon Kinerja {branding?.opd?.label}</h1>
                    :
                    branding?.user?.roles == 'admin_opd' ?
                        <h1 className="font-bold">Pohon Kinerja {Pokin?.nama_opd}</h1>
                        :
                        <h1 className="font-bold">Pohon Cascading {Pokin?.nama_opd}</h1>
                }
                {(branding?.user?.roles == 'admin_opd' || branding?.user?.roles == 'super_admin') &&
                    <ButtonSkyBorder onClick={() => setKendali((prev) => !prev)}>{Kendali ? <span className='flex gap-1 items-center'><TbSettings />Sembunyikan</span> : <span className='flex gap-1 items-center'><TbSettings />Tampilkan</span>}</ButtonSkyBorder>
                }
            </div>
            <div className="flex flex-col p-3 border-b border-x rounded-b-xl relative w-full h-[calc(100vh-50px)] max-h-screen overflow-auto">
                {(branding?.user?.roles == 'admin_opd' || branding?.user?.roles == 'super_admin') &&
                    <div className={`flex flex-wrap border border-blue-700 rounded-lg p-2 justify-between items-center gap-2 transition-all duration-300 ease-in-out ${Kendali ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
                        {/* PEMDA */}
                        <div className="flex flex-col justify-between shadow-sm shadow-slate-300 max-w-[400px] min-w-[300px] px-3 py-2 rounded-xl">
                            <h1 className="font-semibold border-b py-1 text-center">
                                Pohon Pemda
                            </h1>
                            <div className="flex flex-col py-2 mt-1 justify-between">
                                <table>
                                    <tbody className='flex flex-col gap-2'>
                                        <tr className="flex items-center border border-red-500 text-red-500 cursor-pointer rounded-lg px-2 hover:bg-red-500 hover:text-white"
                                            onClick={() => handleModalPohonPemda(4)}
                                        >
                                            <td className="px-2 py-1 text-start min-w-[130px]">
                                                <button type="button" className="font-semibold">
                                                    Strategic
                                                </button>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    :
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex items-center gap-1 font-semibold">
                                                    {LoadingTotalPemda ?
                                                        <LoadingButton />
                                                        :
                                                        JumlahPemdaStrategic?.length || 0
                                                    }
                                                    <TbHourglass />
                                                </h1>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    /
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex items-center gap-1 font-semibold">
                                                    {LoadingTotalPending ?
                                                        <LoadingButton />
                                                        :
                                                        StrategicPemdaLength || 0
                                                    }
                                                    <TbCheck />
                                                </h1>
                                            </td>
                                        </tr>
                                        <tr className="flex items-center border border-blue-500 text-blue-500 cursor-pointer rounded-lg px-2 hover:bg-blue-500 hover:text-white"
                                            onClick={() => handleModalPohonPemda(5)}
                                        >
                                            <td className="px-2 py-1 text-start min-w-[130px]">
                                                <h1 className="font-semibold">
                                                    Tactical
                                                </h1>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    :
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex items-center gap-1 font-semibold">
                                                    {LoadingTotalPemda ?
                                                        <LoadingButton />
                                                        :
                                                        JumlahPemdaTactical?.length || 0
                                                    }
                                                    <TbHourglass />
                                                </h1>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    /
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex items-center gap-1 font-semibold">
                                                    {LoadingTotalPending ?
                                                        <LoadingButton />
                                                        :
                                                        TacticalPemdaLength || 0
                                                    }
                                                    <TbCheck />
                                                </h1>
                                            </td>
                                        </tr>
                                        <tr className="flex items-center border border-green-500 text-green-500 cursor-pointer rounded-lg px-2 hover:bg-green-500 hover:text-white"
                                            onClick={() => handleModalPohonPemda(6)}
                                        >
                                            <td className="px-2 py-1 text-start min-w-[130px]">
                                                <h1 className="font-semibold">
                                                    Operational
                                                </h1>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    :
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex gap-1 items-center font-semibold">
                                                    {LoadingTotalPemda ?
                                                        <LoadingButton />
                                                        :
                                                        JumlahPemdaOperational?.length || 0
                                                    }
                                                    <TbHourglass />
                                                </h1>
                                            </td>
                                            <td className="py-1">
                                                <h1 className="font-semibold">
                                                    /
                                                </h1>
                                            </td>
                                            <td className='flex justify-center px-2 py-1 text-center w-full'>
                                                <h1 className="flex gap-1 items-center font-semibold">
                                                    {LoadingTotalPending ?
                                                        <LoadingButton />
                                                        :
                                                        OperationalPemdaLength || 0
                                                    }
                                                    <TbCheck />
                                                </h1>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* <ModalPohonPemda 
                                isOpen={PohonPemda} 
                                isLevel={LevelPemda} 
                                onClose={() => { handleModalPohonPemda(4) }} 
                                onSuccess={handleTriggerAfterPokinOutside}
                            /> */}
                        </div>
                        {/* BOUNDRIES */}
                        <div className="flex flex-col max-w-[380px] items-center gap-2 text-blue-700">
                            <TbSettings size={50} />
                            <h1 className='font-semibold'>CONTOL POHON KINERJA OPD</h1>
                            <p className='text-sm text-center italic text-slate-400'>
                                Pohon turunan dari pemda & pohon hasil crosscutting dari opd lain di kendalikan dari menu ini.
                            </p>
                            <ButtonSkyBorder className='flex items-center gap-1' onClick={() => setKendali((prev) => !prev)}>
                                <TbSettings />
                                Sembunyikan
                            </ButtonSkyBorder>
                        </div>
                        {/* CROSS OPD */}
                        <div className="flex flex-col justify-between shadow-sm shadow-slate-300 max-w-[400px] min-w-[300px] px-3 py-2 rounded-xl">
                            <h1 className="font-semibold text-orange-700 border-b py-1 text-center">
                                Crosscutting Pending
                            </h1>
                            <div className="flex flex-col py-2 mt-1">
                                <table>
                                    <tbody>
                                        <tr className="flex items-center text-orange-600">
                                            <td className="border-l border-t px-2 py-1 bg-white text-start rounded-tl-lg min-w-[150px]">
                                                <h1 className="font-semibold">
                                                    Ditolak
                                                </h1>
                                            </td>
                                            <td className="border-t py-1">
                                                <h1 className="font-semibold">
                                                    :
                                                </h1>
                                            </td>
                                            <td className='border-r border-t px-2 py-1 bg-white text-center rounded-tr-lg w-full'>
                                                <h1 className="font-semibold">
                                                    {LoadingTotalCrosscutting ?
                                                        <LoadingButton />
                                                        :
                                                        CrossDitolak ? CrossDitolak : 0
                                                    }
                                                </h1>
                                            </td>
                                        </tr>
                                        <tr className="flex items-center text-orange-600">
                                            <td className="border-l border-b px-2 py-1 bg-white text-start rounded-bl-lg min-w-[150px]">
                                                <h1 className="font-semibold">
                                                    Pending
                                                </h1>
                                            </td>
                                            <td className="border-b py-1">
                                                <h1 className="font-semibold">
                                                    :
                                                </h1>
                                            </td>
                                            <td className='border-r border-b px-2 py-1 bg-white text-center rounded-br-lg w-full'>
                                                <h1 className="font-semibold">
                                                    {LoadingTotalCrosscutting ?
                                                        <LoadingButton />
                                                        :
                                                        CrossPending ? CrossPending : 0
                                                    }
                                                </h1>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <ButtonSkyBorder className="w-full" onClick={handleModalCrosscutting}>
                                <TbSettings className='mr-1' />
                                Edit
                            </ButtonSkyBorder>
                            {/* <ModalPohonCrosscutting 
                                isOpen={PohonCrosscutting}
                                onClose={handleModalCrosscutting} 
                                onSuccess={handleTriggerAfterPokinOutside} 
                            /> */}
                        </div>
                    </div>
                }
                <div
                    className={`tf-tree text-center mt-3 transition-all duration-300 ease-in-out ${cursorMode === 'hand' ? "select-none" : ""}`}
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{
                        cursor: cursorMode === "hand" ? (isDragging ? "grabbing" : "grab") : "default", // Cursor style
                    }}
                >
                    <ul>
                        <li>
                            <div className="tf-nc tf flex flex-col w-[600px] rounded-lg">
                                <div className="header flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black">
                                    <h1>Pohon Kinerja OPD</h1>
                                </div>
                                <div className="body flex justify-center my-3">
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Perangkat Daerah</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.nama_opd}</td>
                                            </tr>
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Kode OPD</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.kode_opd}</td>
                                            </tr>
                                            {Pokin?.tujuan_opd ?
                                                Pokin?.tujuan_opd.map((item: any) => (
                                                    <React.Fragment key={item.id}>
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-3 border-black text-start bg-gray-200">Tujuan OPD</td>
                                                            <td className="min-w-[300px] border px-2 py-3 border-black text-start bg-gray-200">{item.tujuan}</td>
                                                        </tr>
                                                        {item.indikator ?
                                                            <React.Fragment>
                                                                {item.indikator.map((i: any) => (
                                                                    <React.Fragment key={item.id}>
                                                                        <tr>
                                                                            <td className="min-w-[100px] border px-2 py-3 border-black text-start">Indikator</td>
                                                                            <td className="min-w-[300px] border px-2 py-3 border-black text-start">{i.indikator}</td>
                                                                        </tr>
                                                                        {i.targets ?
                                                                            i.targets.map((t: any, t_index: number) => (
                                                                                <tr key={t_index}>
                                                                                    <td className="min-w-[100px] border px-2 py-3 border-black text-start">Target/Satuan</td>
                                                                                    <td className="min-w-[300px] border px-2 py-3 border-black text-start">{t.target || "-"} / {t.satuan || "-"}</td>
                                                                                </tr>
                                                                            ))
                                                                            :
                                                                            <tr>
                                                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Target/Satuan</td>
                                                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">-</td>
                                                                            </tr>
                                                                        }
                                                                    </React.Fragment>
                                                                ))}
                                                            </React.Fragment>
                                                            :
                                                            <tr key={item.id}>
                                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Indikator</td>
                                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">-</td>
                                                            </tr>
                                                        }
                                                    </React.Fragment>
                                                ))
                                                :
                                                <tr>
                                                    <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tujuan OPD</td>
                                                    <td className="min-w-[300px] border px-2 py-3 border-black text-start">-</td>
                                                </tr>
                                            }
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tahun</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.tahun}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {(branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'admin_opd') &&
                                    <div className={`flex flex-col gap-2 my-3 py-3 rounded-lg bg-white border-black hide-on-capture`}>
                                        <ButtonSkyBorder onClick={() => handleModalNewTujuan()}>
                                            <TbCirclePlus className="mr-1" />
                                            Tambah Tujuan OPD
                                        </ButtonSkyBorder>
                                        {/* <ButtonBlack
                                            className='flex flex-wrap items-center justify-center gap-1'
                                            onClick={() => setClone(true)}
                                        >
                                            <TbCopy className='mr-1' />
                                            Clone Pohon Kinerja
                                        </ButtonBlack> */}
                                        {/* <ModalClone
                                            isOpen={Clone}
                                            onClose={() => setClone(false)}
                                            jenis='opd'
                                            tahun={branding?.tahun?.value}
                                            nama_opd={branding?.opd?.label}
                                            kode_opd={branding?.opd?.value}
                                            onSuccess={() => setTriggerAfterPokinOutside((prev) => !prev)}
                                        /> */}
                                    </div>
                                }
                                {/* BUTTON HEADER POKIN */}
                                <div className="flex items-center justify-evenly hide-on-capture">
                                    <div className="flex justify-center my-1 py-2">
                                        <ButtonBlackBorder onClick={() => setShowAll(true)}>
                                            <TbEye className="mr-1" />
                                            Tampilkan Semua
                                        </ButtonBlackBorder>
                                    </div>
                                    {(branding?.user?.roles == 'admin_opd' || branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'level_1') &&
                                        <div className="flex justify-center my-1 py-2">
                                            <ButtonRedBorder onClick={newChild}>
                                                <TbCirclePlus className="mr-1" />
                                                Strategic
                                            </ButtonRedBorder>
                                        </div>
                                    }
                                </div>
                            </div>
                            {Pokin?.childs ? (
                                <ul>
                                    {Pokin.childs.map((data: any) => (
                                        <React.Fragment key={data.id}>
                                            <PohonOpd
                                                tema={data}
                                                deleteTrigger={() => setDeleted((prev) => !prev)}
                                                fetchTrigger={() => setTriggerAfterPokinOutside((prev) => !prev)}
                                                show_all={ShowAll}
                                                set_show_all={() => setShowAll(false)}
                                                show_detail={ShowAllDetail}
                                            />
                                        </React.Fragment>
                                    ))}
                                    {formList.map((formId) => (
                                        <React.Fragment key={formId}>
                                            <FormPohonOpd
                                                level={3}
                                                id={null}
                                                key={formId}
                                                formId={formId}
                                                onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                                                deleteTrigger={() => setDeleted((prev) => !prev)}
                                                fetchTrigger={() => setTriggerAfterPokinOutside((prev) => !prev)}
                                            />
                                        </React.Fragment>
                                    ))}
                                </ul>
                            ) : (
                                <ul>
                                    {formList.map((formId) => (
                                        <React.Fragment key={formId}>
                                            <FormPohonOpd
                                                level={3}
                                                id={null}
                                                key={formId}
                                                formId={formId}
                                                onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                                                deleteTrigger={() => setDeleted((prev) => !prev)}
                                                fetchTrigger={() => setTriggerAfterPokinOutside((prev) => !prev)}
                                            />
                                        </React.Fragment>
                                    ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
                {/* BUTTON HAND TOOL */}
                <div className="fixed flex items-center mr-2 mb-2 bottom-0 right-0">
                    <button
                        onClick={toggleCursorMode}
                        className={`p-2 rounded ${cursorMode === "hand" ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
                    >
                        {cursorMode === "hand" ? <TbHandStop size={30} /> : <TbPointer size={30} />}
                    </button>
                </div>
                {/* <ModalTujuanOpd
                    metode="baru"
                    kode_opd={branding?.user?.roles == 'super_admin' ? branding?.opd?.value : branding?.user?.kode_opd}
                    tahun={branding?.tahun?.value}
                    special={true}
                    isOpen={OpenModalTujuanOpd}
                    onClose={() => handleModalNewTujuan()}
                    onSuccess={() => setTriggerAfterPokinOutside((prev) => !prev)}
                /> */}
            </div>
        </>
    )
}

export default HeadPohon;