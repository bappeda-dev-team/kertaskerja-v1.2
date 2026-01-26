'use client'

import { ButtonRedBorder, ButtonGreenBorder, ButtonSkyBorder } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { TahunNull, OpdTahunNull } from "@/components/ui/OpdTahunNull";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal } from "@/types";
import { GetResponseFindallTujuanOpd, TujuanOpd, Indikator, Target } from "../type";
import { ModalTujuanOpd } from "./ModalTujuanOpd";

interface table {
    id_periode: number;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    tahun_list: string[];
    kode_opd: string;
    tipe: 'laporan' | 'opd';
}

const Table: React.FC<table> = ({ tipe, id_periode, kode_opd, tahun_awal, tahun_akhir, jenis_periode, tahun_list }) => {

    const { branding } = useBrandingContext();
    const [Tujuan, setTujuan] = useState<GetResponseFindallTujuanOpd[]>([]);

    const [PeriodeNotFound, setPeriodeNotFound] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [IdModal, setIdModal] = useState<number>(0);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        const fetchTujuanOpd = async () => {
            setLoading(true)
            await apiFetch<GetResponseGlobal<GetResponseFindallTujuanOpd[]>>(`${branding?.api_perencanaan}/tujuan_opd/findall/${kode_opd}/tahunawal/${tahun_awal}/tahunakhir/${tahun_akhir}/jenisperiode/${jenis_periode}`, {
                method: "GET",
            }).then((result) => {
                const data = result.data;
                if (data.length == 0) {
                    setDataNull(true);
                    setTujuan([]);
                } else if (result.code == 500) {
                    setPeriodeNotFound(true);
                    console.log(result.data);
                    setTujuan([]);
                } else if (result.code == 200 || result.code == 201) {
                    setDataNull(false);
                    setTujuan(data);
                    setError(false);
                } else {
                    setDataNull(false);
                    setTujuan([]);
                    setError(true);
                    console.log(result.data);
                }

            }).catch((err) => {
                setError(true);
                console.log(err);
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchTujuanOpd();
    }, [FetchTrigger, branding, tahun_awal, tahun_akhir, jenis_periode]);

    const hapusTujuanOpd = async (id: number) => {
        await apiFetch(`${branding?.api_perencanaan}/tujuan_opd/delete/${id}`, {
            method: "DELETE",
        }).then((_) => {
            AlertNotification("Berhasil", "Data Tujuan OPD Berhasil Dihapus", "success", 1000);
            setFetchTrigger((prev) => !prev);
        }).catch((err) => {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        })
    };

    const handleModal = (id: number, jenis: "tambah" | "edit") => {
        if (ModalOpen) {
            setModalOpen(false);
            setIdModal(0);
            setJenisModal(jenis);
        } else {
            setModalOpen(true);
            setIdModal(id)
            setJenisModal(jenis);
        }
    }

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Error, Periksa koneksi internet atau database server, jika error masih berlanjut hubungi tim developer</h1>
            </div>
        )
    } else if (PeriodeNotFound && branding?.tahun?.value != undefined) {
        return (
            <div className="flex flex-col gap-3 border p-5 rounded-xl shadow-xl">
                <h1 className="text-yellow-500 font-base mx-5">Tahun {branding?.tahun?.value} tidak tersedia di data periode / periode dengan tahun {branding?.tahun?.value} belum di buat</h1>
                <h1 className="text-yellow-500 font-bold mx-5">Tambahkan periode dengan tahun {branding?.tahun?.value} di halaman Master Periode (Super Admin)</h1>
            </div>
        )
    } else if (branding?.tahun?.value == undefined) {
        return <TahunNull />
    } else if (branding?.user?.roles == 'super_admin') {
        if (branding?.opd?.value == undefined) {
            return (
                <>
                    <div className="flex flex-col p-5 border-b-2 border-x-2 rounded-b-xl">
                        <OpdTahunNull />
                    </div>
                </>
            )
        }
    }

    return (
        <div>
            {tipe === 'opd' &&
                <div className="flex items-center justify-between pl-3 py-2">
                    <ButtonSkyBorder onClick={() => handleModal(0, "tambah")}>
                        <TbCirclePlus className="mr-1" />
                        Tambah Tujuan OPD
                    </ButtonSkyBorder>
                </div>
            }
            <div className="overflow-auto m-2 rounded-t-xl border border-gray-200">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Urusan & Bidang Urusan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Tujuan OPD</th>
                            {tipe === 'opd' &&
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            }
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                            {tahun_list.map((item: any) => (
                                <th key={item} colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">{item}</th>
                            ))}
                        </tr>
                        <tr className="bg-emerald-700 text-white">
                            {tahun_list.map((item: any) => (
                                <React.Fragment key={item}>
                                    <th className="border-l border-b py-1 min-w-[50px]">Target</th>
                                    <th className="border-l border-b py-1 min-w-[50px]">Satuan</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Tujuan.map((data: GetResponseFindallTujuanOpd, index: number) => {

                                const TotalRow = data.tujuan_opd.reduce((total, item) => total + (item.indikator.length === 0 ? 1 : item.indikator.length), 0) + data.tujuan_opd.length + 1;

                                return (
                                    // URUSAN DAN BIDANG URUSAN
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4 text-center" rowSpan={TotalRow}>{index + 1}</td>
                                            <td className="border-x border-b border-emerald-500 px-6 py-6" rowSpan={TotalRow}>
                                                <div className="flex flex-col gap-2">
                                                    <p className="border-b border-emerald-500 pb-2">{data.urusan ? `${data.kode_urusan} - ${data.urusan}` : "-"}</p>
                                                    <p>{data.kode_bidang_urusan ? `${data.kode_bidang_urusan} - ${data.nama_bidang_urusan}` : "-"}</p>
                                                </div>
                                            </td>
                                        </tr>
                                        {/* TUJUAN DAN AKSI */}
                                        {data.tujuan_opd.map((item: TujuanOpd) => (
                                            <React.Fragment key={item.id_tujuan_opd}>
                                                <tr>
                                                    <td className="border-x border-b border-emerald-500 px-6 py-6 h-full" rowSpan={item.indikator.length !== 0 ? item.indikator.length + 1 : 2}>
                                                        <p className="flex min-h-[100px] bg-white items-center">
                                                            {item.tujuan || "-"}
                                                        </p>
                                                    </td>
                                                    {tipe === 'opd' &&
                                                        <td className="border-x border-b border-emerald-500 px-6 py-6" rowSpan={item.indikator.length !== 0 ? item.indikator.length + 1 : 2}>
                                                            <div className="flex flex-col justify-center items-center gap-2">
                                                                <ButtonGreenBorder
                                                                    className="flex items-center gap-1 w-full"
                                                                    onClick={() => handleModal(item.id_tujuan_opd, "edit")}
                                                                >
                                                                    <TbPencil />
                                                                    Edit
                                                                </ButtonGreenBorder>
                                                                <ButtonRedBorder className="flex items-center gap-1 w-full" onClick={() => {
                                                                    AlertQuestion("Hapus?", "Hapus Tujuan Pemda yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                        if (result.isConfirmed) {
                                                                            hapusTujuanOpd(item.id_tujuan_opd);
                                                                        }
                                                                    });
                                                                }}>
                                                                    <TbTrash />
                                                                    Hapus
                                                                </ButtonRedBorder>
                                                            </div>
                                                        </td>
                                                    }
                                                </tr>
                                                {/* INDIKATOR */}
                                                {item.indikator.length === 0 ? (
                                                    <React.Fragment>
                                                        <tr>
                                                            <td colSpan={30} className="border-x border-b border-emerald-500 px-6 py-6 bg-yellow-500 text-white">indikator tujuan opd belum di tambahkan</td>
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
                                        ))}
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            {ModalOpen &&
                <ModalTujuanOpd
                    id={IdModal}
                    jenis={JenisModal}
                    kode_opd={kode_opd}
                    tahun={branding?.tahun?.value}
                    tahun_list={tahun_list}
                    periode={id_periode}
                    isOpen={ModalOpen}
                    onClose={() => handleModal(0, "tambah")}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            }
        </div>
    )
}

export default Table;
