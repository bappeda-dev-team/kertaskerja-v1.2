'use client'

import { ButtonGreen, ButtonRed, ButtonSkyBorder, ButtonBlackBorder } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { TbCirclePlus, TbPencil, TbRefresh, TbSearch, TbTrash } from "react-icons/tb";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { LoadingClip, LoadingButton } from "@/lib/loading";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal } from "@/types";
import { GetResponseFindallRenaksiOpd, IndikatorSasaranOpd, RencanaKinerja, SubKegiatan, Rekin } from "../type";
import { ModalIndikator2 } from "@/components/global/ModalIndikator";
import { formatRupiah } from "@/lib/FormatRupiah";
import { ModalRenaksiOpd } from "./ModalRenaksiOpd";

interface Table {
    kode_opd: string;
    tahun: number;
}
interface RekinAsn {
    kode_opd: string;
    tahun: number;
    id: number;
    sasaran: string;
    indikator: IndikatorSasaranOpd[];
}

export const Table: React.FC<Table> = ({ kode_opd, tahun }) => {

    const { branding } = useBrandingContext();
    const [SasaranOpd, setSasaranOpd] = useState<GetResponseFindallRenaksiOpd[]>([]);

    const [IsOpenIndikator, setIsOpenIndikator] = useState<boolean>(false);
    const [Indikator, setIndikator] = useState<IndikatorSasaranOpd[]>([]);
    const [IsiModalIndikator, setIsiModalIndikator] = useState<string>('');

    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchSasaran = async () => {
            setLoading(true);
            await apiFetch<GetResponseGlobal<GetResponseFindallRenaksiOpd[]>>(`${branding?.api_renaksi_opd}/sasaran_opd/all/${kode_opd}/${tahun}`, {
                method: "GET",
            }).then((result) => {
                const data = result.data;
                if (data == null) {
                    setDataNull(true);
                    setSasaranOpd([]);
                } else {
                    setDataNull(false);
                    setSasaranOpd(data);
                }
            }).catch((err) => {
                console.log(err);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchSasaran();
    }, [branding, kode_opd, tahun]);

    const handleIndikator = (isi: string, indikator: IndikatorSasaranOpd[]) => {
        if (IsOpenIndikator) {
            setIsOpenIndikator(false);
            setIsiModalIndikator('');
            setIndikator([]);
        } else {
            setIsOpenIndikator(true);
            setIsiModalIndikator(isi);
            setIndikator(indikator);
        }
    }

    if (Loading) {
        return (
            <div className="w-full overflow-auto">
                <LoadingClip className="mx-5 py-5" />
            </div>
        )
    } else if (Error) {
        return (
            <div className="w-full overflow-auto">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else {
        return (
            <div className="overflow-auto">
                {DataNull ?
                    <h1 className="font-bold mx-5 py-5">Sasaran OPD belum di tambahkan di RENSTRA</h1>
                    :
                    SasaranOpd.map((data: GetResponseFindallRenaksiOpd, index: number) => (
                        <div className="my-2" key={data.id || index}>
                            <div
                                className={`flex justify-between border items-center p-5 rounded-xl  border-emerald-500`}
                            >
                                <h1 className="font-semibold">Sasaran OPD {index + 1}. {data.nama_sasaran_opd || "-"}</h1>
                                <div className="flex items-center">
                                    <ButtonBlackBorder
                                        onClick={() => handleIndikator(data.nama_sasaran_opd, data.indikator)}
                                        className="flex items-center justify-center gap-1 text-xs"
                                    >
                                        <TbSearch />
                                        Cek Indikator
                                    </ButtonBlackBorder>
                                </div>
                            </div>
                            <div className={`transition-all duration-300 ease-in-out mx-2 p-2 border-x border-b border-emerald-500`}>
                                <RekinAsn
                                    id={data.id}
                                    sasaran={data.nama_sasaran_opd}
                                    indikator={data.indikator}
                                    kode_opd={kode_opd}
                                    tahun={tahun}
                                />
                            </div>
                        </div>
                    ))
                }
                <ModalIndikator2
                    isOpen={IsOpenIndikator}
                    onClose={() => handleIndikator('', [])}
                    isi={IsiModalIndikator}
                    data={Indikator}
                />
            </div>
        )
    }

}

export const RekinAsn: React.FC<RekinAsn> = ({ id, sasaran, indikator, tahun, kode_opd }) => {

    const { branding } = useBrandingContext();
    const [Data, setData] = useState<Rekin[]>([]);

    const [ModalTambah, setModaltambah] = useState<boolean>(false);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);

    const [IdRenaksi, setIdRenaksi] = useState<number>(0);
    const [IdRekin, setIdRekin] = useState<string>('');
    const [IdSasaran, setIdSasaran] = useState<number>(0);
    const [IndikatorSasaran, setIndikatorSasaran] = useState<IndikatorSasaranOpd[]>([]);
    const [Rekin, setRekin] = useState<string>('');

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");

    const [Loading, setLoading] = useState<boolean>(false);
    const [ProsesSync, setProsesSync] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    
    const handleModal = (jenis: "tambah" | "edit", rekin: string, indikator: IndikatorSasaranOpd[], id_renaksi?: number, id_sasaran?: number) => {
        if (ModalOpen) {
            setModalOpen(false);
            setJenisModal(jenis);
            setRekin(rekin);
            setIdRenaksi(id_renaksi ?? 0);
            setIndikatorSasaran(indikator);
            setIdSasaran(id_sasaran ?? 0);
        } else {
            setModalOpen(true);
            setJenisModal(jenis);
            setRekin(rekin);
            setIdRenaksi(id_renaksi ?? 0);
            setIndikatorSasaran(indikator);
            setIdSasaran(id_sasaran ?? 0);
        }
    }

    const hapusRenaksiOpd = async (id: number) => {
        await apiFetch(`${branding?.api_renaksi_opd}/renaksi-aksi-opd/delete/${id}`, {
            method: "DELETE"
        }).then((_) => {
            AlertNotification("Berhasil", "Rencana Aksi OPD Berhasil Dihapus", "success", 1000);
            setFetchTrigger((prev) => !prev);
        }).catch((err) => {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        })
    };

    const syncRenaksiOpd = async (id: string) => {
        setProsesSync(false);
        await apiFetch(`${branding?.api_renaksi_opd}/rencana-aksi-opd/sync_jadwal/${id}`, {
            method: "POST",
        }).then((result: any) => {
            if (result.code === 200) {
                AlertNotification("Berhasil", `${result.data}`, "success", 1000);
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 1000);
            }
            setFetchTrigger((prev) => !prev);
        }).catch((err) => {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }).finally(() => {
            setProsesSync(false);
        })
    };

    useEffect(() => {
        const fetchRekinById = async () => {
            setLoading(true);
            await apiFetch(`${branding?.api_renaksi_opd}/rencana-aksi-opd/${id}/${tahun}`, {
                method: "GET",
            }).then((result: any) => {
                const data = result.data;
                // console.log(data);
                if (data == null || data == undefined) {
                    setDataNull(true);
                    setData([]);
                } else {
                    if (result.code === 200) {
                        setDataNull(false);
                        setData(data);
                    } else {
                        setError(true);
                        setData([]);
                    }
                }
            }).catch((err) => {
                console.error(err);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchRekinById();
    }, [branding, id, tahun, FetchTrigger]);

    if (Loading) {
        return (
            <React.Fragment>
                <div className="w-full">
                    <div className="border px-6 py-4 text-center"><LoadingButton /> Loading...</div>
                </div>
            </React.Fragment>
        )
    }
    if (Error) {
        return (
            <React.Fragment>
                <div className="w-full">
                    <div className="border px-6 py-4 text-center text-red-500">Cek koneksi internet, terdapat kesalahan server backend atau database</div>
                </div>
            </React.Fragment>
        )
    }

    return (
        <div className="flex flex-col">
            <ButtonSkyBorder
                onClick={() => handleModal("tambah", sasaran, indikator, 0, id)}
                className="flex items-center justify-center gap-1 w-full mb-2"
            >
                <TbCirclePlus />
                Tambah Rencana Aksi OPD
            </ButtonSkyBorder>
            <div className="overflow-auto rounded-t-xl border border-gray-200">
                <table className="w-full">
                    <thead>
                        <tr className="text-xm bg-emerald-500 text-white">
                            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px] text-center">Aksi/Kegiatan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Sub Kegiatan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px] text-center">Anggaran</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px] text-center">Nama Pemilik</td>
                            <td colSpan={4} className="border-r border-b px-6 py-3 min-w-[100px] text-center">Jadwal Pelaksanaan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px] text=center">Keterangan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px] text-center">Aksi</td>
                        </tr>
                        <tr className="text-sm bg-emerald-500 text-white">
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">TW1</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">TW2</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">TW3</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">TW4</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Data?.length != 0 ?
                            Data?.map((data: Rekin, index: number) => (
                                <React.Fragment key={index}>
                                    {data.rencana_kinerja.map((rk: RencanaKinerja, sub_index: number) => (
                                        <tr key={rk.id_renaksiopd || index}>
                                            <td className="border-r border-b border-gray-200 px-6 py-4">{sub_index + 1}</td>
                                            <td className="border-r border-b border-gray-200 px-6 py-4">{rk.nama_rencana_kinerja || "-"}</td>
                                            {rk.subkegiatan ?
                                                <td className="border-r border-b border-gray-200 px-6 py-4">
                                                    {rk.subkegiatan.map((sk: SubKegiatan, sk_index: number) => (
                                                        <div className="w-full flex flex-col items-center gap-1" key={sk_index}>
                                                            <p>{sk.kode_subkegiatan} - {sk.nama_subkegiatan}</p>
                                                            {/* <ButtonBlackBorder className="flex items-center justify-center gap-1 text-xs">
                                                                <TbSearch />
                                                                Cek Indikator
                                                            </ButtonBlackBorder> */}
                                                        </div>
                                                    ))}
                                                </td>
                                                :
                                                <td className="border-r border-b border-gray-200 px-6 py-4 italic text-slate-500">tidak ada Sub Kegiatan</td>
                                            }
                                            <td className="border-r border-b border-gray-200 px-6 py-4">Rp.{formatRupiah(rk.total_anggaran || 0)}</td>
                                            <td className="border-r border-b border-gray-200 px-6 py-4">{rk.nama_pegawai}</td>
                                            <td className="border-r border-b border-gray-200 px-6 py-4 text-center">{rk.tw1}</td>
                                            <td className="border-r border-b border-gray-200 px-6 py-4 text-center">{rk.tw2}</td>
                                            <td className="border-r border-b border-gray-200 px-6 py-4 text-center">{rk.tw3}</td>
                                            <td className="border-r border-b border-gray-200 px-6 py-4 text-center">{rk.tw4}</td>
                                            <td className="border-r border-b border-gray-200 px-6 py-4">{rk.keterangan || "-"}</td>
                                            <td className="border-r border-b border-gray-200 px-6 py-4">
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <ButtonSkyBorder
                                                        className="w-full"
                                                        onClick={() => syncRenaksiOpd(rk.rekin_id)}
                                                    >
                                                        <TbRefresh className="mr-1" />
                                                        Sync
                                                    </ButtonSkyBorder>
                                                    <ButtonGreen
                                                        className="w-full"
                                                        onClick={() => handleModal("edit", rk.nama_rencana_kinerja, indikator, rk.id_renaksiopd, 0)}
                                                    >
                                                        <TbPencil className="mr-1" />
                                                        Edit
                                                    </ButtonGreen>
                                                    <ButtonRed className="w-full"
                                                        onClick={() => {
                                                            AlertQuestion("Hapus?", "Hapus Renaksi OPD yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                if (result.isConfirmed) {
                                                                    hapusRenaksiOpd(rk.id_renaksiopd);
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <TbTrash className="mr-1" />
                                                        Hapus
                                                    </ButtonRed>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                            :
                            <tr>
                                <td colSpan={11} className="border-r border-b border-gray-200 px-6 py-4">Data Kosong / Belum di Tambahkan</td>
                            </tr>
                        }
                    </tbody>
                </table>
                {ModalOpen &&
                    <ModalRenaksiOpd
                        jenis={JenisModal}
                        isOpen={ModalTambah}
                        onClose={() => handleModal("tambah", "", [])}
                        kode_opd={kode_opd}
                        tahun={String(tahun)}
                        id_rekin={IdRekin}
                        id_sasaran={IdSasaran}
                        rekin={Rekin}
                        indikator={IndikatorSasaran ? IndikatorSasaran : []}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                    />
                }
            </div>
        </div>
    )
} 