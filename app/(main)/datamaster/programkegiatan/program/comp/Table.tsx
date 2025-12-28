'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseFindallProgram } from "../type";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { apiFetch } from "@/hook/apiFetch";
import { ButtonSkyBorder, ButtonRedBorder, ButtonSky } from "@/components/ui/button";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { Card, HeaderCard } from "@/components/ui/Card";
import { ModalMasterProgram } from "./ModalMasterProgram";

const Table = () => {

    const [Data, setData] = useState<GetResponseFindallProgram[]>([]);
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [DataModal, setDataModal] = useState<GetResponseFindallProgram | null>(null);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean | null>(null);
    const { branding } = useBrandingContext();

    const handleModal = (jenis: "tambah" | "edit", data: GetResponseFindallProgram | null) => {
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
        const getBidangUrusan = async () => {
            setLoading(true);
            await apiFetch<any>(`${branding?.api_perencanaan}/program_kegiatan/findall`, {
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
        getBidangUrusan();
    }, [branding, FetchTrigger]);

    const hapusData = async (id: any) => {
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/program_kegiatan/delete/${id}`, {
            method: "DELETE",
        }).then(resp => {
            setData(Data.filter((data) => (data.id !== id)))
            // setFetchTrigger((prev) => !prev);
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
            <div className="w-full border border-gray-200 p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else {
        return (
            <>
                <Card>
                    <HeaderCard>
                        <h1 className="font-bold text-lg uppercase">Master Program</h1>
                        <ButtonSky
                            className='flex items-center gap-1'
                            onClick={() => handleModal("tambah", null)}
                        >
                            <TbCirclePlus />
                            Tambah Program
                        </ButtonSky>
                    </HeaderCard>
                    <div className="flex flex-wrap m-2">
                        <div className="overflow-auto m-2 rounded-t-xl border border-blue-500 w-full">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-blue-500 text-white">
                                        <th className="border-r border-b border-gray-200 px-6 py-3 w-[50px] text-center">No</th>
                                        <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">Nama Program</th>
                                        <th className="border-r border-b border-gray-200 px-6 py-3 w-[100px]">Kode</th>
                                        <th className="border-l border-b border-gray-200 px-6 py-3 w-[100px]">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Data.length > 0 ?
                                        Data.map((item: GetResponseFindallProgram, index: number) => (
                                            <tr key={index}>
                                                <td className="border-r border-b border-blue-500 py-4 px-3 text-center">{index + 1}</td>
                                                <td className="border-r border-b border-blue-500 px-6 py-4 text-center">{item.nama_program || "-"}</td>
                                                <td className="border-r border-b border-blue-500 px-6 py-4 text-center">{item.kode_program || 0}</td>
                                                <td className="border-b border-blue-500 px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <ButtonSkyBorder
                                                            className="w-full flex items-center gap-1"
                                                            onClick={() => handleModal("edit", item)}
                                                        >
                                                            <TbPencil />
                                                            Edit
                                                        </ButtonSkyBorder>
                                                        <ButtonRedBorder
                                                            className="w-full flex items-center gap-1"
                                                            onClick={() => {
                                                                AlertQuestion("Hapus?", "Hapus Program yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        hapusData(item.id);
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            <TbTrash />
                                                            Hapus
                                                        </ButtonRedBorder>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td className="px-6 py-3" colSpan={30}>
                                                Data Kosong / Belum Ditambahkan
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
                {ModalOpen &&
                    <ModalMasterProgram
                        isOpen={ModalOpen}
                        onClose={() => handleModal("tambah", null)}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                        Data={DataModal}
                        jenis={JenisModal}
                    />
                }
            </>
        )
    }
}

export default Table;
