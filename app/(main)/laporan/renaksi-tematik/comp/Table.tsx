'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { TbCircleCheckFilled } from "react-icons/tb";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseTagging } from "@/types";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseFindallLaporanTagging, TaggingData, Pelaksana, RencanaKinerja } from "../type";

interface Table {
    tahun: number;
}

export const Table: React.FC<Table> = ({ tahun }) => {

    const { branding } = useBrandingContext();
    const [DataTagging, setDataTagging] = useState<GetResponseFindallLaporanTagging | null>(null);

    const [NamaTagging, setNamaTagging] = useState<string>('');
    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchDataTagging = async () => {
            setLoading(true)
            await apiFetch<GetResponseTagging<any>>(`${branding?.api_tagging}/laporan/tagging_pokin?nama_tagging=${encodeURIComponent(NamaTagging)}&tahun=${tahun}`, {
                method: "GET",
            }).then((result) => {
                const data = result.data[0];
                if (result.status === 200) {
                    setDataTagging(data);
                    console.log(data);
                    setError(false);
                } else {
                    setError(true);
                    setDataTagging(null);
                }
            }).catch((err) => {
                setError(true);
                console.error(err)
            }).finally(() => {
                setLoading(false);
            })
        }
        if (NamaTagging) {
            fetchDataTagging();
        }
    }, [tahun, NamaTagging]);

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl w-full">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 p-2 w-full">
            <div className="flex items-center gap-2">
                <button
                    className={`flex items-center gap-1 p-2 border cursor-pointer
                        ${NamaTagging === "Program Unggulan Bupati" ? 'bg-sky-500 text-white' : 'border-sky-500 text-sky-500'} rounded-lg hover:bg-sky-500 hover:text-white
                    `}
                    onClick={() => setNamaTagging("Program Unggulan Bupati")}
                >
                    <TbCircleCheckFilled />
                    Program Unggulan Bupati
                </button>
                <button
                    className={`flex items-center gap-1 p-2 border cursor-pointer
                        ${NamaTagging === "100 Hari Kerja Bupati" ? 'bg-sky-500 text-white' : 'border-sky-500 text-sky-500'} rounded-lg hover:bg-sky-500 hover:text-white
                    `}
                    onClick={() => setNamaTagging("100 Hari Kerja Bupati")}
                >
                    <TbCircleCheckFilled />
                    100 Hari Kerja Bupati
                </button>
                <button
                    className={`flex items-center gap-1 p-2 border cursor-pointer
                        ${NamaTagging === "Program Unggulan Pemerintah Pusat" ? 'bg-sky-500 text-white' : 'border-sky-500 text-sky-500'} rounded-lg hover:bg-sky-500 hover:text-white
                    `}
                    onClick={() => setNamaTagging("Program Unggulan Pemerintah Pusat")}
                >
                    <TbCircleCheckFilled />
                    Program Unggulan Pemerintah Pusat
                </button>
            </div>
            {NamaTagging === "" ?
                <h1 className="p-3 border rounded-lg">Pilih Jenis Tagging Terlebih Dahulu</h1>
                :
                <div className="overflow-auto rounded-t-xl border border-slate-200">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-emerald-500 text-white">
                                <th rowSpan={2} className="border-r border-b px-6 py-3 w-[50px]">No</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">{DataTagging?.nama_tagging || "Tagging"}</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Perangkat Daerah</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Nama Pohon</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Level Pohon</th>

                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Pelaksana</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Rencana Kinerja</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[150px]">Urusan/Bidang Urusan/Kegiatan/Sub Kegiatan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Pagu Anggaran</th>
                                <th colSpan={4} className="border-r border-b px-6 py-3 min-w-[100px]">Waktu Pelaksanaan</th>
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Keterangan</th>
                            </tr>
                            <tr className="bg-emerald-700 text-white">
                                <th className="border-r border-b px-3 py-1 min-w-[100px]">TW I</th>
                                <th className="border-r border-b px-3 py-1 min-w-[100px]">TW II</th>
                                <th className="border-r border-b px-3 py-1 min-w-[100px]">TW III</th>
                                <th className="border-r border-b px-3 py-1 min-w-[100px]">TW IV</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(DataTagging?.pohon_kinerjas?.length === 0 || DataTagging?.pohon_kinerjas === null) ?
                                <tr>
                                    <td className="px-6 py-3 uppercase" colSpan={13}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                DataTagging?.pohon_kinerjas.map((p: TaggingData, index: number) => {

                                    const TotalRow = p.pelaksanas?.reduce((total, item) => total + (item.rencana_kinerjas.length == 0 ? 1 : item.rencana_kinerjas.length), 0) + p.pelaksanas?.length + 1;

                                    return (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td rowSpan={p.pelaksanas ? TotalRow : 2} className="border-r border-b px-6 py-4">{index + 1}</td>
                                                <td rowSpan={p.pelaksanas ? TotalRow : 2} className="border-r border-b px-6 py-4">{p.nama_program_unggulan || "-"}</td>
                                                <td rowSpan={p.pelaksanas ? TotalRow : 2} className="border-r border-b px-6 py-4">{p.nama_opd || "-"}</td>
                                                <td rowSpan={p.pelaksanas ? TotalRow : 2} className="border-r border-b px-6 py-4">
                                                    <p>{p.nama_pohon || "-"} </p>
                                                    <p className="font-semibold">({p.id_pohon || "-"})</p>
                                                </td>
                                                <td rowSpan={p.pelaksanas ? TotalRow : 2} className="border-r border-b px-6 py-4">{p.jenis_pohon || "-"}</td>
                                            </tr>
                                            {p.pelaksanas ?
                                                p.pelaksanas.map((p: Pelaksana, sub_index: number) => (
                                                    <React.Fragment key={sub_index}>
                                                        <tr>
                                                            <td rowSpan={p.rencana_kinerjas ? p.rencana_kinerjas.length + 1 : 2} className="border-r border-b px-6 py-4">
                                                                <div className="flex flex-col">
                                                                    <p className="border-b mb-2">{p.nama_pelaksana || "-"}</p>
                                                                    <p>{p.nip_pelaksana || "-"}</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {p.rencana_kinerjas ?
                                                            p.rencana_kinerjas.map((rk: RencanaKinerja, subs_index: number) => (
                                                                <tr key={subs_index}>
                                                                    <td key={index} className="border-r border-b px-6 py-4 h-[200px]">{rk.rencana_kinerja || "-"}</td>
                                                                    {rk.kode_subkegiatan ?
                                                                        <>
                                                                            <td className="border-r border-b px-6 py-4 h-[200px]">({rk.kode_subkegiatan || 0}) {rk.nama_subkegiatan || "-"}</td>
                                                                            <td className="border-r border-b px-6 py-4 h-[200px]">{rk.pagu || "-"}</td>
                                                                        </>
                                                                        :
                                                                        <td colSpan={2} className="border-r border-b px-6 py-4 bg-red-400 text-white italic h-[200px]">*Sub Kegiatan Belum Di Pilih</td>
                                                                    }
                                                                    <td className="border-r border-b px-6 py-4 h-[200px]">{rk.tahapan_pelaksanaan.tw_1 || 0}</td>
                                                                    <td className="border-r border-b px-6 py-4 h-[200px]">{rk.tahapan_pelaksanaan.tw_2 || 0}</td>
                                                                    <td className="border-r border-b px-6 py-4 h-[200px]">{rk.tahapan_pelaksanaan.tw_3 || 0}</td>
                                                                    <td className="border-r border-b px-6 py-4 h-[200px]">{rk.tahapan_pelaksanaan.tw_4 || 0}</td>
                                                                    <td className="border-r border-b px-6 py-4 h-[200px]">{rk.keterangan || "-"}</td>
                                                                </tr>
                                                            ))
                                                            :
                                                            <tr>
                                                                <td colSpan={8} className="border-r border-b px-6 py-4 italic bg-red-400 text-white">*Rencana Kinerja belum di buat</td>
                                                            </tr>
                                                        }
                                                    </React.Fragment>
                                                ))
                                                :
                                                <tr>
                                                    <td colSpan={9} className="border-r border-b px-6 py-4 italic bg-red-400 text-white">*Pelaksana belum di tambahkan</td>
                                                </tr>
                                            }
                                        </React.Fragment>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}