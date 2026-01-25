'use client'

import { ButtonRed, ButtonGreen, ButtonSky } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { TahunNull } from "@/components/ui/OpdTahunNull";
import { TbPencil, TbArrowBadgeDownFilled, TbTrash, TbCirclePlus } from "react-icons/tb";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { LoadingButton } from "@/lib/loading";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal } from "@/types";
import { GetResponseFindallSasaranPemda, SasaranPemda, SubTematik, Periode, Indikator, Target } from "../type";
import { ModalSasaranPemda } from "./ModalSasaranPemda";

interface table {
    id_periode: number
    tahun_awal: string;
    tahun_akhir: string;
    jenis: string;
    tahun_list: string[];
}

const Table: React.FC<table> = ({ id_periode, tahun_awal, tahun_akhir, jenis, tahun_list }) => {

    const [Data, setData] = useState<GetResponseFindallSasaranPemda[]>([]);

    const [PeriodeNotFound, setPeriodeNotFound] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [IdSasaran, setIdSasaran] = useState<number>(0);
    const [IdSubTema, setIdSubTema] = useState<number>(0);
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [JenisPohon, setJenisPohon] = useState<string>('');

    const [Proses, setProses] = useState<boolean>(false);
    const [Show, setShow] = useState<{ [key: string]: boolean }>({});

    const { branding } = useBrandingContext();

    const HandleModal = (jenis: "tambah" | "edit", id: number, nama_pohon: string, jenis_pohon: string, id_tema?: number) => {
        if (ModalOpen) {
            setModalOpen(false);
            setNamaPohon('');
            setJenisPohon('');
            setIdSubTema(0);
            setJenisModal(jenis);
            setIdSasaran(id_tema || 0);
        } else {
            setModalOpen(true);
            setNamaPohon(nama_pohon);
            setJenisPohon(jenis_pohon)
            setIdSubTema(id);
            setJenisModal(jenis);
            setIdSasaran(id_tema || 0);
        }
    }

    useEffect(() => {
        const fetchSasaran = async () => {
            setLoading(true);
            try {
                await apiFetch<GetResponseGlobal<GetResponseFindallSasaranPemda[]>>(`${branding?.api_perencanaan}/sasaran_pemda/findall/tahun_awal/${tahun_awal}/tahun_akhir/${tahun_akhir}/jenis_periode/${jenis}`, {
                    method: "GET",
                }).then((resp) => {
                    const data = resp.data;
                    if (data == null) {
                        setDataNull(true);
                        setData([]);
                    } else if (resp.code == 200 || resp.code == 201) {
                        setDataNull(false);
                        setData(data);
                        setError(false);
                    } else {
                        setDataNull(false);
                        setData([]);
                        setError(true);
                        console.log(data);
                    }
                }).catch(err => {
                    AlertNotification("Gagal", `${err}`, "error", 3000, true);
                    setError(true);
                }).finally(() => {
                    setLoading(false);
                })
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        if (branding?.user?.roles !== undefined && branding?.tahun?.value != undefined) {
            fetchSasaran();
        }
    }, [branding, FetchTrigger, tahun_awal, tahun_akhir, jenis]);

    const handleShow = (id: number) => {
        setShow((prev) => ({
            [id]: !prev[id],
        }));
    }

    const hapusData = async (id: any) => {
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/sasaran_pemda/delete/${id}`, {
            method: "DELETE",
        }).then(resp => {
            setFetchTrigger((prev) => !prev);
            AlertNotification("Berhasil", "Sasaran Pemda Berhasil Dihapus", "success", 2000);
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setProses(false);
        })
    };

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Error, Periksa koneksi internet atau database server, jika error berlanjut silakan hubungi tim developer</h1>
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
    }

    return (
        <>
            {DataNull ?
                <div className="px-6 py-3 border w-full rounded-xl">
                    Data Kosong / Belum Ditambahkan
                </div>
                :
                Data.map((data: GetResponseFindallSasaranPemda) => {
                    const isShown = Show[data.tematik_id] || false;
                    const isActiveTematik = data?.subtematik[0]?.is_active;
                    return (
                        <div className="flex flex-col m-2" key={data.tematik_id}>
                            <div
                                className={`flex justify-between border items-center p-5 rounded-xl text-emerald-500 cursor-pointer border-emerald-500 hover:bg-emerald-500 hover:text-white ${isShown ? "bg-emerald-500 text-white" : ""}`}
                                onClick={() => handleShow(data.tematik_id)}
                            >
                                <div className="flex items-center gap-2">
                                    <h1 className="font-semibold">Tematik - {data.nama_tematik}</h1>
                                    <h1 className="font-semibold text-blue-500">({data.tahun})</h1>
                                    {!isActiveTematik &&
                                        <h1 className="font-semibold text-red-500">NON AKTIF</h1>
                                    }
                                </div>
                                <div className="flex items-center">
                                    <TbArrowBadgeDownFilled className={`transition-all duration-200 ease-in-out text-3xl ${isShown ? "" : "-rotate-90"}`} />
                                </div>
                            </div>
                            <div className={`transition-all duration-300 ease-in-out border-x border-b border-emerald-500 ${isShown ? "opacity-100 mx-4 p-5" : "max-h-0 opacity-0 pointer-events-none"}`}>
                                <div className="overflow-auto rounded-t-xl border border-emerald-500">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-xm bg-emerald-500 text-white">
                                                <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Strategic Pemda</td>
                                                <td rowSpan={2} colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Sasaran Pemda</td>
                                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</td>
                                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Rumus Perhitungan</td>
                                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Sumber Data</td>
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
                                            {data.subtematik.length == 0 ?
                                                <tr>
                                                    <td className="px-6 py-3" colSpan={30}>
                                                        Data Kosong / Belum Ditambahkan
                                                    </td>
                                                </tr>
                                                :
                                                data.subtematik.map((item: SubTematik, index: number) => {
                                                    // Cek apakah item.tujuan_pemda ada
                                                    const hasSasaran = item.sasaran_pemda.length != 0;
                                                    const [sasaranLength, indikatorLength] = hasSasaran
                                                        ? [
                                                            item.sasaran_pemda.length + 1,
                                                            item.sasaran_pemda.reduce((total, sasaran) => total + (sasaran.indikator.length === 0 ? 1 : sasaran.indikator.length), 0),
                                                        ]
                                                        : [1, 1];
                                                    return (
                                                        <React.Fragment key={item.subtematik_id}>
                                                            {/* NO & POHON */}
                                                            <tr>
                                                                <td className="border border-emerald-500 px-4 py-4 text-center" rowSpan={sasaranLength + (indikatorLength === 0 ? 1 : indikatorLength)}>
                                                                    {index + 1}
                                                                </td>
                                                                <td className="border border-emerald-500 px-6 py-4" rowSpan={sasaranLength + (indikatorLength === 0 ? 1 : indikatorLength)}>
                                                                    <p>{item.nama_subtematik} ({item.tahun})</p>
                                                                    <div className="flex flex-col justify-between gap-2 h-full">
                                                                        <p className="uppercase text-emerald-500 text-xs">{item.jenis_pohon}</p>
                                                                        {item.is_active === false ?
                                                                            <button
                                                                                className="flex justify-between gap-1 rounded-full p-1 bg-red-500 text-white cursor-not-allowed"
                                                                                disabled
                                                                            >
                                                                                <div className="flex gap-1">
                                                                                    <TbCirclePlus />
                                                                                    <p className="text-xs">Tematik NON-AKTIF</p>
                                                                                </div>
                                                                                <TbArrowBadgeDownFilled className="-rotate-90" />
                                                                            </button>
                                                                            :
                                                                            <button
                                                                                className="flex justify-between gap-1 rounded-full p-1 bg-sky-500 text-white border border-sky-500 hover:bg-white hover:text-sky-500 hover:border hover:border-sky-500"
                                                                                onClick={() => HandleModal("tambah", item.subtematik_id, item.nama_subtematik, item.jenis_pohon)}
                                                                            >
                                                                                <div className="flex gap-1">
                                                                                    <TbCirclePlus />
                                                                                    <p className="text-xs">Tambah Sasaran Baru</p>
                                                                                </div>
                                                                                <TbArrowBadgeDownFilled className="-rotate-90" />
                                                                            </button>
                                                                        }
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            {/* SASARAN */}
                                                            {hasSasaran ?
                                                                item.sasaran_pemda.map((s: SasaranPemda) => (
                                                                    <React.Fragment key={s.id_sasaran_pemda}>
                                                                        <tr>
                                                                            <td className="border-b border-emerald-500 px-6 py-4 h-[150px]" rowSpan={s.indikator.length === 0 ? 2 : s.indikator.length + 1}>
                                                                                {s.sasaran_pemda || "-"}
                                                                            </td>
                                                                            <td className="border-b border-r border-emerald-500 px-6 py-4" rowSpan={s.indikator.length === 0 ? 2 : s.indikator.length + 1}>
                                                                                <div className="flex flex-col justify-center items-center gap-1">
                                                                                    <>
                                                                                        <ButtonGreen
                                                                                            className="flex items-center gap-1 w-full"
                                                                                            onClick={() => HandleModal("edit", item.subtematik_id, item.nama_subtematik, item.jenis_pohon, s.id_sasaran_pemda)}
                                                                                        >
                                                                                            <TbPencil />
                                                                                            Edit
                                                                                        </ButtonGreen>
                                                                                        <ButtonRed
                                                                                            className="flex items-center gap-1 w-full"
                                                                                            onClick={() => {
                                                                                                AlertQuestion("Hapus?", "Hapus Tujuan Pemda yang dipilih?", "question", "Hapus", "Batal").then((result: any) => {
                                                                                                    if (result.isConfirmed) {
                                                                                                        hapusData(s.id_sasaran_pemda);
                                                                                                    }
                                                                                                });
                                                                                            }}
                                                                                            disabled={Proses}
                                                                                        >
                                                                                            {Proses ?
                                                                                                <>
                                                                                                    <LoadingButton />
                                                                                                    Delete
                                                                                                </>
                                                                                                :
                                                                                                <>
                                                                                                    <TbTrash />
                                                                                                    Delete
                                                                                                </>
                                                                                            }
                                                                                        </ButtonRed>
                                                                                    </>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        {/* INDIKATOR */}
                                                                        {s.indikator.length == 0 ?
                                                                            <td className="border-r border-b border-emerald-500 px-6 py-4 bg-yellow-500 text-white" colSpan={30}>
                                                                                Indikator Kosong / Belum di Inputkan
                                                                            </td>
                                                                            :
                                                                            s.indikator.map((i: Indikator) => (
                                                                                <tr key={i.id}>
                                                                                    <td className="border-b border-r border-emerald-500 px-6 py-4">{i.indikator || "-"}</td>
                                                                                    <td className="border-b border-r border-emerald-500 px-6 py-4">{i.rumus_perhitungan || "-"}</td>
                                                                                    <td className="border-b border-r border-emerald-500 px-6 py-4">{i.sumber_data || "-"}</td>
                                                                                    {i.target.map((t: Target) => (
                                                                                        <React.Fragment key={t.id}>
                                                                                            <td className="border-b border-r border-emerald-500 px-6 py-4 text-center">{t.target || "-"}</td>
                                                                                            <td className="border-b border-r border-emerald-500 px-6 py-4 text-center">{t.satuan || "-"}</td>
                                                                                        </React.Fragment>
                                                                                    ))}
                                                                                </tr>
                                                                            ))
                                                                        }
                                                                    </React.Fragment>
                                                                ))
                                                                :
                                                                <tr>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4 bg-red-400 text-white" colSpan={30}>
                                                                        Sasaran Pemda belum di buat
                                                                    </td>
                                                                </tr>
                                                            }
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
            {ModalOpen &&
                < ModalSasaranPemda
                    id={IdSasaran}
                    jenis={JenisModal}
                    subtema_id={IdSubTema}
                    nama_pohon={NamaPohon}
                    periode={id_periode}
                    jenis_periode={jenis}
                    jenis_pohon={JenisPohon}
                    tahun={branding?.tahun?.value || 0}
                    tahun_list={tahun_list}
                    isOpen={ModalOpen}
                    onClose={() => HandleModal("tambah", 0, '', '')}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            }
        </>
    )
}

export default Table;
