'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseFindallTujuanPemda, TujuanPemda, Indikator, Target } from "../type";
import { GetResponseGlobal, OptionTypeString } from "@/types";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { apiFetch } from "@/hook/apiFetch";
import { ButtonGreen, ButtonRed } from "@/components/ui/button";
import { TbPencil, TbTrash, TbCirclePlus, TbX, TbArrowBadgeDownFilled } from "react-icons/tb";
import { Card, HeaderCard } from "@/components/ui/Card";
import { GetResponseFindallPeriode } from "@/app/(main)/datamaster/periode/type";
import Select from 'react-select';

interface Table {
    Periode: GetResponseFindallPeriode | null;
}

const Table: React.FC<Table> = ({ Periode }) => {

    const [Data, setData] = useState<GetResponseFindallTujuanPemda[]>([]);
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [DataModal, setDataModal] = useState<GetResponseFindallTujuanPemda | null>(null);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const handleModal = (jenis: "tambah" | "edit", data: GetResponseFindallTujuanPemda | null) => {
        if (ModalOpen) {
            setModalOpen(false);
            setDataModal(null);
            setJenisModal("tambah");
        } else {
            setModalOpen(true);
            setDataModal(data);
            setJenisModal(jenis);
        }
    }

    useEffect(() => {
        const getTujuanPemda = async () => {
            setLoading(true);
            await apiFetch<GetResponseGlobal<GetResponseFindallTujuanPemda[]>>(`${branding?.api_perencanaan}/tujuan_pemda/findall_with_pokin/${Periode?.tahun_awal}/${Periode?.tahun_akhir}/${Periode?.jenis_periode}`, {
                method: "GET",
            }).then((resp) => {
                const data = resp.data;
                if (resp.code === 200) {
                    setData(data);
                } else {
                    setData([]);
                    setError(true);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        if (Periode) {
            getTujuanPemda();
        }
    }, [branding, FetchTrigger, Periode]);

    const hapusData = async (id: number) => {
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/misi_pemda/delete/${id}`, {
            method: "DELETE",
        }).then(resp => {
            AlertNotification("Berhasil", "Data Tujuan Pemda Berhasil Dihapus", "success", 1000);
            setFetchTrigger((prev) => !prev);
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setProses(false);
        })
    };

    if (Loading) {
        return (
            <div className="border border-gray-200 p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="flex flex-wrap items-center justify-between gap-5 w-full">
                <h1 className="font-bold text-lg uppercase">Tujuan Pemda {branding?.tahun?.label || "tahun kosong"}</h1>
            </div>
        )
    } else {
        return (
            <>
                {Periode ?
                    <div className="flex flex-wrap m-2">
                        <div className="overflow-auto m-2 rounded-t-xl border border-gray-200 w-full">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-emerald-500 text-white">
                                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Tema</th>
                                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Tujuan Pemda</th>
                                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Visi</th>
                                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</th>
                                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Rumus Perhitungan</th>
                                        <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Sumber Data</th>
                                        {Periode.tahun_list.map((item: any) => (
                                            <th key={item} colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">{item}</th>
                                        ))}
                                    </tr>
                                    <tr className="bg-emerald-500 text-white">
                                        {Periode.tahun_list.map((item: any) => (
                                            <React.Fragment key={item}>
                                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Data.length === 0 ?
                                        <tr>
                                            <td className="px-6 py-3" colSpan={30}>
                                                Data Kosong / Belum Ditambahkan
                                            </td>
                                        </tr>
                                        :
                                        Data.map((data: GetResponseFindallTujuanPemda, index: number) => {
                                            // Cek apakah data.tujuan_pemda ada
                                            const hasTujuanPemda = data.tujuan_pemda.length != 0;
                                            const TotalRow = data.tujuan_pemda.reduce((total, item) => total + (item.indikator == null ? 1 : item.indikator.length), 0) + data.tujuan_pemda.length + 1;

                                            return (
                                                <React.Fragment key={index}>
                                                    {/* Baris Utama */}
                                                    <tr>
                                                        <td className="border-x border-b border-emerald-500 px-6 py-4 text-center" rowSpan={data.tujuan_pemda.length === 0 ? 2 : TotalRow}>
                                                            {index + 1}
                                                        </td>
                                                        <td className="border-r border-b border-emerald-500 px-6 py-4" rowSpan={data.tujuan_pemda.length === 0 ? 2 : TotalRow}>
                                                            <div className="flex flex-col gap-2">
                                                                {data.nama_tematik || "-"} - {data.tahun_pokin}
                                                                <div className="flex items center gap-1 border-t border-emerald-500 pt-3">
                                                                    <div className="flex flex-col justify-between  gap-2 h-full w-full">
                                                                        <button
                                                                            className={`flex justify-between gap-1 rounded-full p-1
                                                                                 ${data.is_active ?
                                                                                    "bg-sky-500 text-white border border-sky-500 hover:bg-white hover:text-sky-500 hover:border hover:border-sky-500 cursor-pointer"
                                                                                    :
                                                                                    "bg-red-500 text-white cursor-not-allowed"} 
                                                                                `}
                                                                            onClick={() => handleModal("tambah", data)}
                                                                            disabled={data.is_active === false}
                                                                        >
                                                                            <div className="flex gap-1">
                                                                                {data.is_active ?
                                                                                    <>
                                                                                        <TbCirclePlus />
                                                                                        <p className="text-xs">Tambah Tujuan Baru</p>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <TbX />
                                                                                        <p className="text-xs">Tematik NON-AKTIF</p>
                                                                                    </>
                                                                                }
                                                                            </div>
                                                                            <TbArrowBadgeDownFilled className="-rotate-90" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {hasTujuanPemda ?
                                                        data.tujuan_pemda.map((item: TujuanPemda) => (
                                                            <React.Fragment key={item.id}>
                                                                <tr>
                                                                    <td className="border-x border-b border-emerald-500 px-6 py-6 h-[150px]" rowSpan={item.indikator !== null ? item.indikator.length + 1 : 2}>
                                                                        {item.tujuan_pemda || "-"}
                                                                    </td>
                                                                    <td className="border-x border-b border-emerald-500 px-6 py-6 h-[150px]" rowSpan={item.indikator !== null ? item.indikator.length + 1 : 2}>
                                                                        {item.visi || "-"}
                                                                        /
                                                                        {item.misi || "-"}
                                                                    </td>
                                                                    <td className="border-x border-b border-emerald-500 px-6 py-6" rowSpan={item.indikator !== null ? item.indikator.length + 1 : 2}>
                                                                        <div className="flex flex-col justify-center items-center gap-2">
                                                                            <ButtonGreen
                                                                                className="flex items-center gap-1 w-full"
                                                                                onClick={() => handleModal("edit", data)}
                                                                            >
                                                                                <TbPencil />
                                                                                Edit
                                                                            </ButtonGreen>
                                                                            <ButtonRed className="flex items-center gap-1 w-full" onClick={() => {
                                                                                AlertQuestion("Hapus?", "Hapus Tujuan Pemda yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                                    if (result.isConfirmed) {
                                                                                        hapusData(item.id);
                                                                                    }
                                                                                });
                                                                            }}>
                                                                                <TbTrash />
                                                                                Hapus
                                                                            </ButtonRed>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {/* INDIKATOR */}
                                                                {item.indikator === null ? (
                                                                    <React.Fragment>
                                                                        <tr>
                                                                            <td colSpan={30} className="border-x border-b border-emerald-500 px-6 py-6 bg-yellow-500 text-white">indikator tujuan pemda belum di tambahkan</td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                ) : (
                                                                    item.indikator.map((i: Indikator) => (
                                                                        <tr key={i.id}>
                                                                            <td className="border-x border-b border-emerald-500 px-6 py-6">{i.indikator || "-"}</td>
                                                                            <td className="border-x border-b border-emerald-500 px-6 py-6">{i.rumus_perhitungan || "-"}</td>
                                                                            <td className="border-x border-b border-emerald-500 px-6 py-6">{i.sumber_data || "-"}</td>
                                                                            {i.target.map((t: Target) => (
                                                                                <React.Fragment key={t.id}>
                                                                                    <td className="border-x border-b border-emerald-500 px-6 py-6 text-center">{t.target || "-"}</td>
                                                                                    <td className="border-x border-b border-emerald-500 px-6 py-6 text-center">{t.satuan || "-"}</td>
                                                                                </React.Fragment>
                                                                            ))}
                                                                        </tr>
                                                                    ))
                                                                )}
                                                            </React.Fragment>
                                                        ))
                                                        :
                                                        <tr>
                                                            <td className="border-r border-b border-emerald-500 px-6 py-4 bg-red-400 text-white" colSpan={30}>
                                                                Tujuan Pemda belum di buat
                                                            </td>
                                                        </tr>
                                                    }
                                                </React.Fragment>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    :
                    <h1 className="p-5 m-5 font-bold border rounded-lg">❕ Pilih Periode terlebih dahulu</h1>
                }
                {/* {ModalOpen &&
                    <ModalVisi
                        isOpen={ModalOpen}
                        onClose={() => handleModal("tambah", null)}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                        Data={DataModal}
                        jenis={JenisModal}
                        periode={Periode?.value || "RPJMD"}
                    />
                } */}
            </>
        )
    }
}

export default Table;
