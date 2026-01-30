'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { TbPencil, TbTrash, TbCircleX, TbCircleCheck, TbCirclePlus, TbHourglass } from "react-icons/tb";
import { ButtonBlackBorder, ButtonSkyBorder, ButtonGreen, ButtonRed } from "@/components/ui/button";
import { AlertQuestion, AlertNotification } from "@/lib/alert";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseFindallProgramUnggulan } from "../type";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal } from "@/types";
import { ModalMasterProgramUnggulan } from "./ModalMasterProgramUnggulan";

interface Table {
    tahun_awal: string;
    tahun_akhir: string;
}

const Table: React.FC<Table> = ({ tahun_akhir, tahun_awal }) => {

    const { branding } = useBrandingContext();

    const [Data, setData] = useState<GetResponseFindallProgramUnggulan[]>([]);
    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<'tambah' | "edit">("tambah");
    const [DataModal, setDataModal] = useState<GetResponseFindallProgramUnggulan | null>(null);

    const [DataEdit, setDataEdit] = useState<any>(null);
    const [ModalEdit, setModalEdit] = useState<boolean>(false);
    const [ModalBaru, setModalBaru] = useState<boolean>(false);

    const handleModal = (jenis: "tambah" | "edit", Data: GetResponseFindallProgramUnggulan | null) => {
        if (ModalOpen) {
            setModalOpen(false);
            setJenisModal(jenis);
            setDataModal(Data);
        } else {
            setModalOpen(true);
            setJenisModal(jenis);
            setDataModal(Data);
        }
    }

    useEffect(() => {
        const fetchProgramUnggulan = async () => {
            setLoading(true)
            await apiFetch<GetResponseGlobal<GetResponseFindallProgramUnggulan[]>>(`${branding?.api_perencanaan}/program_unggulan/findall/${tahun_awal}/${tahun_akhir}`, {
                method: "GET",
            }).then((result) => {
                const data = result.data;
                if (result.code === 200) {
                    if (data.length === 0) {
                        setDataNull(true);
                    } else {
                        setDataNull(false);
                        setData(data);
                        setError(false);
                    }
                } else {
                    setError(true);
                    setData([]);
                }
            }).catch((err) => {
                setError(true);
                console.error(err)
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchProgramUnggulan();
    }, [tahun_akhir, tahun_awal, branding, FetchTrigger]);

    const hapusProgramUnggulan = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        await apiFetch(`${branding?.api_perencanaan}/program_unggulan/delete/${id}`, {
            method: "DELETE",
        }).then((result) => {
            setData(Data.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data Program Unggulan Berhasil Dihapus", "success", 1000);
        }).catch((err) => {
            console.error(err);
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
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
    }

    return (
        <>
            <ButtonSkyBorder
                className="m-3 flex items-center gap-1"
                onClick={() => handleModal("tambah", null)}
            >
                <TbCirclePlus />
                Tambah Program Unggulan
            </ButtonSkyBorder>
            <div className="overflow-auto m-2 rounded-t-xl border border-gray-200">
                <table className="w-full">
                    <thead>
                        <tr className="bg-green-500 text-white">
                            <th className="border-r border-b px-6 py-3 text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama Program Unggulan / Hebat</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Rencana Implementasi</th>
                            <th className="border-r border-b px-6 py-3 min-w-[150px]">Status</th>
                            <th className="border-r border-b px-6 py-3 min-w-[150px]">Tahun</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Keterangan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[150px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ? (
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        ) : (
                            Data.map((item: GetResponseFindallProgramUnggulan, index: number) => (
                                <tr key={index}>
                                    <td className="border-x border-b border-green-500 py-4 px-3 text-center">{index + 1}</td>
                                    <td className="border-r border-b border-green-500 px-6 py-4 font-semibold">{item.nama_program_unggulan || "-"}</td>
                                    <td className="border-r border-b border-green-500 px-6 py-4">{item.rencana_implementasi || "-"}</td>
                                    <td className="border-r border-b border-green-500 px-6 py-4">
                                        {item.is_active ?
                                            <p className="flex items-center gap-1">
                                                <TbCircleCheck />
                                                Digunakan
                                            </p>
                                            :
                                            <p className="flex items-center gap-1">
                                                <TbHourglass />
                                                Pending
                                            </p>
                                        }
                                    </td>
                                    <td className="border-r border-b border-green-500 px-6 py-4 text-center">{item.tahun_awal || "-"} - {item.tahun_akhir || "-"}</td>
                                    <td className="border-r border-b border-green-500 px-6 py-4">{item.keterangan || "-"}</td>
                                    <td className="border-r border-b border-green-500 px-6 py-4">
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <ButtonGreen
                                                className="flex items-center gap-1 w-full"
                                                onClick={() => handleModal("edit", item)}
                                            >
                                                <TbPencil />
                                                Edit
                                            </ButtonGreen>
                                            <ButtonRed className="flex items-center gap-1 w-full" onClick={() => {
                                                AlertQuestion("Hapus?", "Hapus Program Unggulan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        hapusProgramUnggulan(item.id);
                                                    }
                                                });
                                            }}>
                                                <TbTrash />
                                                Hapus
                                            </ButtonRed>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {ModalOpen &&
                <ModalMasterProgramUnggulan
                    jenis={JenisModal}
                    dataEdit={DataModal}
                    onClose={() => handleModal("tambah", null)}
                    isOpen={ModalOpen}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    tahun_awal={tahun_awal}
                    tahun_akhir={tahun_akhir}
                />
            }
        </>
    )
}

export default Table;
