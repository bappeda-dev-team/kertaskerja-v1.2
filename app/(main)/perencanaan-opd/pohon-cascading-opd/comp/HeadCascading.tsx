'use client'

import '@/components/ui/treeflex.css'
import React, { useState, useEffect, useRef } from 'react';
import { TbEye, TbHandStop, TbPointer, TbPrinter } from 'react-icons/tb';
import { LoadingBeat, LoadingButton } from '@/lib/loading';
import { OpdTahunNull, TahunNull } from '@/components/ui/OpdTahunNull';
import { PohonCascading } from './PohonCascading';
import { PohonLaporan } from '@/app/(main)/laporan/laporan-cascading-opd/comp/PohonLaporan';
import { ButtonBlackBorder, ButtonSky } from '@/components/ui/button';
import { apiFetch } from '@/hook/apiFetch'; 
import { useBrandingContext } from '@/providers/BrandingProvider';

interface cascading {
    jenis: 'laporan' | 'non-laporan';
}
interface pokin {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    tujuan_opd: tujuanopd[];
    childs: childs[]
}
interface tujuanopd {
    id: number;
    kode_opd: string;
    tujuan: string;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    indikator: Indikator[];
}
interface Indikator {
    indikator: string;
}
interface childs {
    id: number;
    parent: number;
    strategi: string;
    taget: string;
    satuan: string;
    keterangan: string;
    indikators: string;
    childs: childs[];
}

const HeadCascading: React.FC<cascading> = ({ jenis }) => {

    const {branding} = useBrandingContext();
    const kode_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;
    const nama_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.label : branding?.user?.nama_opd;
    const tahun = branding?.tahun?.value;
    const user = branding?.user?.roles;
    
    const [Pokin, setPokin] = useState<pokin | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');

    const [Deleted, setDeleted] = useState<boolean>(false);

    // SHOW ALL
    const [ShowAll, setShowAll] = useState<boolean>(false);

    //Hand Tool state
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

    useEffect(() => {
        const fetchPokinOpd = async (url: string) => {
            setLoading(true);
            await apiFetch(`${branding?.api_perencanaan}/${url}`, {
                method: "GET"
            }).then((result: any) => {
                const data = result.data || [];
                setPokin(data);
            }).catch((err) => {
                setError('gagal mendapatkan data, terdapat kesalahan backend/server saat mengambil data pohon kinerja cascading opd ini');
                console.error(err);
            }).finally(() => {
                setLoading(false);
            })
        }
        if (jenis === 'non-laporan') {
            if (user == 'super_admin' || user == 'reviewer') {
                if (kode_opd != undefined && tahun != undefined) {
                    fetchPokinOpd(`pohon_kinerja_opd/findall/${kode_opd}/${tahun}`);
                }
            } else if (user !== 'super_admin') {
                if (kode_opd != undefined && tahun != undefined) {
                    fetchPokinOpd(`pohon_kinerja_opd/findall/${kode_opd}/${tahun}`);
                }
            }
        } else {
            if (user == 'super_admin' || user == 'reviewer') {
                if (kode_opd != undefined && tahun != undefined) {
                    fetchPokinOpd(`cascading_opd/findall/${kode_opd}/${tahun}`);
                }
            } else if (user !== 'super_admin') {
                if (kode_opd != undefined && tahun != undefined) {
                    fetchPokinOpd(`cascading_opd/findall/${kode_opd}/${tahun}`);
                }
            }
        }
    }, [tahun, kode_opd, user, Deleted, jenis, branding]);

    if (Loading) {
        return (
            <>
                <div className="flex flex-col p-5 border rounded-t-xl mt-2">
                    <h1>Pohon Cascading</h1>
                </div>
                <div className="flex flex-col p-5 border-b border-x rounded-b-xl">
                    <LoadingBeat />
                </div>
            </>
        )
    }
    if (error) {
        return (
            <>
                <div className="flex flex-col p-5 border rounded-t-xl mt-2">
                    <h1>Pohon Cascading</h1>
                </div>
                <div className="flex flex-col p-5 border-b border-x rounded-b-xl">
                    {error}
                </div>
            </>
        )
    }
    if (user == 'super_admin') {
        if (kode_opd == undefined || tahun === undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border rounded-t-xl mt-2">
                        <h1>Pohon Cascading {nama_opd}</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b border-x rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            )
        }
    }
    if (user != 'super_admin') {
        if (tahun === undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border rounded-t-xl mt-2">
                        <h1>Pohon Cascading</h1>
                    </div>
                    <div className="flex flex-col p-5 border-b border-x rounded-b-xl">
                        <TahunNull />
                    </div>
                </>
            )
        }
    }

    return (
        <div>
            <div className="flex flex-col p-5 border rounded-t-xl overflow-auto mt-2">
                {user == 'super_admin' ?
                    <h1 className="font-bold">Pohon Cascading {nama_opd}</h1>
                    :
                    <h1 className="font-bold">Pohon Cascading {Pokin?.nama_opd}</h1>
                }
            </div>
            <div className="flex flex-col p-3 border-b border-x rounded-b-xl relative w-full h-[calc(100vh-100px)] max-h-screen overflow-auto">
                <div className={`tf-tree text-center mt-3 ${cursorMode === 'hand' ? "select-none" : ""}`}
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
                                    {(user == 'super_admin' || user == 'admin_opd') ?
                                        <h1>Pohon Cascading</h1>
                                        :
                                        <h1>Pohon Cascading</h1>
                                    }
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
                                            <tr>
                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start">Tahun</td>
                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start">{Pokin?.tahun}</td>
                                            </tr>
                                            {Pokin?.tujuan_opd ?
                                                Pokin?.tujuan_opd.map((item: any) => (
                                                    <React.Fragment key={item.id}>
                                                        {item.kode_bidang_urusan &&
                                                            <tr>
                                                                <td className="min-w-[100px] border px-2 py-3 border-black text-start bg-gray-100">Bidang Urusan</td>
                                                                <td className="min-w-[300px] border px-2 py-3 border-black text-start bg-gray-100">({item.kode_bidang_urusan} - {item.nama_bidang_urusan})</td>
                                                            </tr>
                                                        }
                                                        <tr>
                                                            <td className="min-w-[100px] border px-2 py-3 border-black text-start bg-gray-100">Tujuan OPD</td>
                                                            <td className="min-w-[300px] border px-2 py-3 border-black text-start bg-gray-100">{item.tujuan}</td>
                                                        </tr>
                                                        {item.indikator ?
                                                            item.indikator.map((i: any) => (
                                                                <React.Fragment key={item.id}>
                                                                    <tr>
                                                                        <td className="min-w-[100px] border px-2 py-3 border-black text-start">Indikator</td>
                                                                        <td className="min-w-[300px] border px-2 py-3 border-black text-start">{i.indikator}</td>
                                                                    </tr>
                                                                </React.Fragment>
                                                            ))
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
                                        </tbody>
                                    </table>
                                </div>
                                <ButtonBlackBorder
                                    className='w-full mb-2 hide-on-capture'
                                    onClick={() => setShowAll(true)}
                                >
                                    <TbEye className='mr-1' />
                                    Tampilkan Semua Pohon
                                </ButtonBlackBorder>
                            </div>
                            {jenis === 'laporan' ?
                                <React.Fragment>
                                    {Pokin?.childs ? (
                                        <ul>
                                            {Pokin.childs.map((data: any) => (
                                                <React.Fragment key={data.id}>
                                                    <PohonLaporan
                                                        tema={data}
                                                        show_all={ShowAll}
                                                        set_show_all={() => setShowAll(false)}
                                                    />
                                                </React.Fragment>
                                            ))}
                                        </ul>
                                    ) : (
                                        <ul></ul>
                                    )}
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    {Pokin?.childs &&
                                        <ul>
                                            {Pokin.childs.map((data: any) => (
                                                <React.Fragment key={data.id}>
                                                    <PohonCascading
                                                        tema={data}
                                                        deleteTrigger={() => setDeleted((prev) => !prev)}
                                                        show_all={ShowAll}
                                                        set_show_all={() => setShowAll(false)}
                                                    />
                                                </React.Fragment>
                                            ))}
                                        </ul>
                                    }
                                </React.Fragment>
                            }
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
            </div>
        </div>
    )
}

export default HeadCascading;