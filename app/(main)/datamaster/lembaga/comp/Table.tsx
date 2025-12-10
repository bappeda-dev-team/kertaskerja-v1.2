'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseFindallLembaga } from "../type";
import { AlertNotification } from "@/lib/alert";
import { apiFetch } from "@/hook/apiFetch";
import { ButtonSkyBorder, ButtonRedBorder } from "@/components/ui/button";
import { TbPencil, TbTrash } from "react-icons/tb";

const Table = () => {

    const [Data, setData] = useState<GetResponseFindallLembaga[]>([]);
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [DataModal, setDataModal] = useState<GetResponseFindallLembaga | null>(null);

    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const { branding } = useBrandingContext();

    const handleModal = (data: GetResponseFindallLembaga | null) => {
        if (ModalOpen) {
            setModalOpen(false);
            setDataModal(null);
        } else {
            setModalOpen(true);
            setDataModal(data);
        }
    }

    useEffect(() => {
        const getLembaga = async () => {
            setLoading(true);
            await apiFetch<any>(`${branding?.api_perencanaan}/lembaga/findall`, {
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
        getLembaga();
    }, [branding]);

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
                <div className="overflow-auto m-2 rounded-t-xl border border-gray-200 w-full">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-orange-500 text-white">
                                <th className="border-r border-b border-gray-200 px-6 py-3 w-[50px] text-center">No</th>
                                <th className="border-r border-b border-gray-200 px-6 py-3 w-[150px]">Id Lembaga</th>
                                <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">Nama Lembaga</th>
                                <th className="border-r border-b border-gray-200 px-6 py-3 w-[100px]">Kode Lembaga</th>
                                <th className="border-l border-b border-gray-200 px-6 py-3 w-[100px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Data.length > 0 ?
                                Data.map((item: GetResponseFindallLembaga, index: number) => (
                                    <tr key={index}>
                                        <td className="border-x border-b border-orange-500 py-4 px-3 text-center">{index + 1}</td>
                                        <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.id || "-"}</td>
                                        <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.nama_lembaga || "-"}</td>
                                        <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.kode_lembaga || 0}</td>
                                        <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <ButtonSkyBorder
                                                    className="w-full flex items-center gap-1"

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
            </>
        )
    }
}

export default Table;
