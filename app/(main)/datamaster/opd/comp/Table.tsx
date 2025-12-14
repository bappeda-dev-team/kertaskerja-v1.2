'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseMasterOpd } from "../type";
import { AlertNotification } from "@/lib/alert";
import { apiFetch } from "@/hook/apiFetch";
import { ButtonSkyBorder, ButtonRedBorder, ButtonSky } from "@/components/ui/button";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { Card, HeaderCard } from "@/components/ui/Card";
import { ModalOpd } from "./ModalOpd";

const Table = () => {

    const [Data, setData] = useState<GetResponseMasterOpd[]>([]);
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [DataModal, setDataModal] = useState<GetResponseMasterOpd | null>(null);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const { branding } = useBrandingContext();

    const handleModal = (jenis: "tambah" | "edit", data: GetResponseMasterOpd | null) => {
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
        const getData = async () => {
            setLoading(true);
            await apiFetch<any>(`${branding?.api_perencanaan}/opd/findall`, {
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
        getData();
    }, [branding, FetchTrigger]);

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
                        <h1 className="font-bold text-lg uppercase">Master OPD</h1>
                        <ButtonSky 
                            className='flex items-center gap-1'
                            onClick={() => handleModal("tambah", null)}
                        >
                            <TbCirclePlus />
                            Tambah OPD
                        </ButtonSky>
                    </HeaderCard>
                    <div className="flex flex-wrap m-2">
                        <div className="overflow-auto m-2 rounded-t-xl border border-gray-200 w-full">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-orange-500 text-white">
                                        <th className="border-r border-b border-gray-200 px-6 py-3 w-[50px] text-center">No</th>
                                        <th className="border-r border-b border-gray-200 px-6 py-3 w-[150px]">Kode OPD</th>
                                        <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">Nama OPD</th>
                                        <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">Nama Kepala OPD</th>
                                        <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">NIP Kepala OPD</th>
                                        <th className="border-r border-b border-gray-200 px-6 py-3 w-[100px]">Pangkat Kepala OPD</th>
                                        <th className="border-r border-b border-gray-200 px-6 py-3 w-[100px]">Lembaga</th>
                                        <th className="border-l border-b border-gray-200 px-6 py-3 w-[100px]">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Data.length > 0 ?
                                        Data.map((item: GetResponseMasterOpd, index: number) => (
                                            <tr key={index}>
                                                <td className="border-x border-b border-orange-500 py-4 px-3 text-center">{index + 1}</td>
                                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.kode_opd || "-"}</td>
                                                <td className="border-r border-b border-orange-500 px-6 py-4">{item.nama_opd || "-"}</td>
                                                <td className="border-r border-b border-orange-500 px-6 py-4">{item.nama_kepala_opd || "-"}</td>
                                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.nip_kepala_opd || "-"}</td>
                                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.pangkat_kepala || "-"}</td>
                                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.id_lembaga.nama_lembaga || "-"}</td>
                                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <ButtonSkyBorder
                                                            className="w-full flex items-center gap-1"
                                                            onClick={() => handleModal("tambah", item)}
                                                        >
                                                            <TbPencil />
                                                            Edit
                                                        </ButtonSkyBorder>
                                                        <ButtonRedBorder
                                                            className="w-full flex items-center gap-1"
                                                        >
                                                            <TbTrash />
                                                            Delete
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
                    <ModalOpd 
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
