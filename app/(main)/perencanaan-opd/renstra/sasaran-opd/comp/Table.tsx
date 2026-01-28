'use client'

import { ButtonRed, ButtonGreen, ButtonSky } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { TahunNull, OpdTahunNull } from "@/components/ui/OpdTahunNull";
import { TbPencil, TbTrash, TbCirclePlus, TbArrowBadgeDownFilled } from "react-icons/tb";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal, OptionTypeString } from "@/types";
import { GetResponseFindallSasaranOpd, SasaranOpd, Indikator, Target, Pelaksana } from "../type";
import { ModalSasaranOpd } from "./ModalSasaranOpd";

interface table {
    tipe: "laporan" | "opd";
    kode_opd: string;
    id_periode: number
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    tahun_list: string[];
}

const Table: React.FC<table> = ({ tipe, id_periode, kode_opd, tahun_awal, tahun_akhir, jenis_periode, tahun_list }) => {

    const { branding } = useBrandingContext();
    const [Sasaran, setSasaran] = useState<GetResponseFindallSasaranOpd[]>([]);

    const [PeriodeNotFound, setPeriodeNotFound] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [DataModal, setDataModal] = useState<GetResponseFindallSasaranOpd | null>(null);
    const [IdSasaran, setIdSasaran] = useState<string | null>(null);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        let url = `sasaran_opd/findall/${kode_opd}/${tahun_awal}/${tahun_akhir}/${jenis_periode}`;
        const fetchSasaranOpd = async () => {
            setLoading(true)
            await apiFetch<GetResponseGlobal<GetResponseFindallSasaranOpd[]>>(`${branding?.api_perencanaan}/${url}`, {
                method: "GET",
            }).then((result) => {
                const data = result.data;
                // console.log(data);
                if (data === null) {
                    setDataNull(true);
                    setSasaran([]);
                } else if (result.code == 500) {
                    setPeriodeNotFound(true);
                    setSasaran([]);
                    console.log(result.data);
                } else if (result.code == 200) {
                    setDataNull(false);
                    setSasaran(data);
                    setError(false);
                } else {
                    setDataNull(false);
                    setSasaran([]);
                    setError(true);
                    console.log(result.data);
                }
            }).catch((err) => {
                setError(true);
                console.error(err);
            }).finally(() => {
                setLoading(false);
            })
        }
        if (branding?.user?.roles !== undefined) {
            fetchSasaranOpd();
        }
    }, [branding, FetchTrigger, tahun_awal, tahun_akhir, jenis_periode]);

    const hapusSasaranOpd = async (id: string) => {
        await apiFetch(`${branding?.api_perencanaan}/sasaran_opd/delete/${id}`, {
            method: "DELETE",
        }).then((_) => {
            AlertNotification("Berhasil", "Data Tujuan Pemda Berhasil Dihapus", "success", 1000);
            setFetchTrigger((prev) => !prev);
        }).catch((err) => {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        })
    };

    const handleModal = (Data: GetResponseFindallSasaranOpd | null, jenis: "tambah" | "edit", id_sasaran: string | null) => {
        if (ModalOpen) {
            setModalOpen(false);
            setDataModal(Data);
            setJenisModal(jenis);
            setIdSasaran(id_sasaran);
        } else {
            setModalOpen(true);
            setDataModal(Data);
            setJenisModal(jenis);
            setIdSasaran(id_sasaran);
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
        <>
            <div className="overflow-auto m-2 rounded-t-xl border border-gray-200">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Strategic OPD</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Pemilik</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Sasaran OPD</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Tujuan OPD</th>
                            {tipe === "opd" &&
                                <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            }
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                            {tahun_list.map((item: any) => (
                                <th key={item} colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">{item}</th>
                            ))}
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            {tahun_list.map((item: any) => (
                                <React.Fragment key={item}>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data kosong / Strategic OPD Belum di tambahkan
                                </td>
                            </tr>
                            :
                            Sasaran.map((data: GetResponseFindallSasaranOpd, index: number) => {
                                // Cek apakah data.tujuan_pemda ada
                                const hasPelaksana = data.pelaksana.length != 0;
                                const hasSasaran = data.sasaran_opd.length != 0;
                                const TotalRow = data.sasaran_opd.reduce((total, item) => total + (item.indikator.length == 0 ? 1 : item.indikator.length), 0) + data.sasaran_opd.length + 1;

                                return (
                                    <React.Fragment key={index}>
                                        {/* Baris Utama */}
                                        <tr>
                                            <td className="border-x border-b border-emerald-500 px-6 py-4 text-center" rowSpan={data.sasaran_opd.length === 0 ? 2 : TotalRow}>
                                                {index + 1}
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4" rowSpan={data.sasaran_opd.length === 0 ? 2 : TotalRow}>
                                                <div className="flex flex-col gap-2">
                                                    {data.nama_pohon || "-"}
                                                    {tipe === "opd" &&
                                                        <div className="flex items center gap-1 border-t border-emerald-500 pt-3">
                                                            <div className="flex flex-col justify-between  gap-2 h-full w-full">
                                                                <button
                                                                    className="flex justify-between gap-1 rounded-full p-1 bg-sky-500 text-white border border-sky-500 hover:bg-white hover:text-sky-500 hover:border hover:border-sky-500"
                                                                    onClick={() => {
                                                                        handleModal(data, "tambah", null);
                                                                    }}
                                                                >
                                                                    <div className="flex gap-1">
                                                                        <TbCirclePlus />
                                                                        <p className="text-xs">Tambah Sasaran Baru</p>
                                                                    </div>
                                                                    <TbArrowBadgeDownFilled className="-rotate-90" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4" rowSpan={data.sasaran_opd.length === 0 ? 2 : TotalRow}>
                                                {data.pelaksana.length == 0 ?
                                                    <p className="text-red-500">Pelaksana Belum Di Pilih</p>
                                                    :
                                                    data.pelaksana.map((p: Pelaksana) => (
                                                        <p key={p.id} className="flex flex-col justify-center gap-1">{p.nama_pegawai} ({p.nip})</p>
                                                    ))
                                                }
                                            </td>
                                        </tr>
                                        {hasSasaran ?
                                            data.sasaran_opd.map((item: SasaranOpd) => (
                                                <React.Fragment key={item.id}>
                                                    <tr>
                                                        <td className="border-x border-b border-emerald-500 px-6 py-6 h-[150px]" rowSpan={item.indikator.length !== 0 ? item.indikator.length + 1 : 2}>
                                                            {item.nama_sasaran_opd || "-"}
                                                        </td>
                                                        <td className="border-x border-b border-emerald-500 px-6 py-6 h-[150px]" rowSpan={item.indikator.length !== 0 ? item.indikator.length + 1 : 2}>
                                                            {item.nama_tujuan_opd ?
                                                                <p>{item.nama_tujuan_opd || "-"}</p>
                                                                :
                                                                <p className="italic text-red-300 font-thin">tujuan opd belum di pilih</p>
                                                            }
                                                        </td>
                                                        {tipe === "opd" &&
                                                            <td className="border-x border-b border-emerald-500 px-6 py-6" rowSpan={item.indikator.length !== 0 ? item.indikator.length + 1 : 2}>
                                                                <div className="flex flex-col justify-center items-center gap-2">
                                                                    <ButtonGreen
                                                                        className="flex items-center gap-1 w-full"
                                                                        onClick={() => {
                                                                            handleModal(data, "edit", item.id);
                                                                        }}
                                                                    >
                                                                        <TbPencil />
                                                                        Edit
                                                                    </ButtonGreen>
                                                                    <ButtonRed className="flex items-center gap-1 w-full" onClick={() => {
                                                                        AlertQuestion("Hapus?", "Hapus Sasaran Pemda yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                            if (result.isConfirmed) {
                                                                                hapusSasaranOpd(item.id);
                                                                            }
                                                                        });
                                                                    }}>
                                                                        <TbTrash />
                                                                        Hapus
                                                                    </ButtonRed>
                                                                </div>
                                                            </td>
                                                        }
                                                    </tr>
                                                    {/* INDIKATOR */}
                                                    {item.indikator.length === 0 ? (
                                                        <React.Fragment>
                                                            <tr>
                                                                <td colSpan={30} className="border-x border-b border-emerald-500 px-6 py-6 bg-yellow-500 text-white">indikator sasaran opd belum di tambahkan</td>
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
                                                    Sasaran OPD belum di buat
                                                </td>
                                            </tr>
                                        }
                                    </React.Fragment>
                                );
                            })
                        }
                    </tbody>
                </table>
                {ModalOpen &&
                    <ModalSasaranOpd
                        jenis={JenisModal}
                        Data={DataModal || null}
                        id={IdSasaran ?? ""}
                        tahun={branding?.tahun?.value}
                        tahun_list={tahun_list}
                        periode={id_periode}
                        tahun_awal={tahun_awal}
                        tahun_akhir={tahun_akhir}
                        kode_opd={kode_opd}
                        jenis_periode={jenis_periode}
                        isOpen={ModalOpen}
                        onClose={() => handleModal(null, "tambah", null)}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                    />
                }
            </div>
        </>
    )
}

export default Table;
