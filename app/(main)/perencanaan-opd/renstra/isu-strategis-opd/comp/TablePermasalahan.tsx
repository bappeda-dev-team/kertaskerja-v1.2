'use client'

import { useState, useEffect } from "react";
import { ButtonRedBorder } from "@/components/ui/button";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { TbTrash } from "react-icons/tb";
import { LoadingBeat } from "@/lib/loading";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseGlobal } from "@/types";
import { PermasalahanOpd } from "../../permasalahan-opd/type";
import { apiFetch } from "@/hook/apiFetch";

interface table {
    tahun: number;
    kode_opd: string;
}

const TablePermasalahan: React.FC<table> = ({ tahun, kode_opd }) => {
    const {branding} = useBrandingContext();
    
    const [Data, setData] = useState<PermasalahanOpd[]>([]);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchPermasalahanTerpilih = async () => {
            setLoading(true);
            await apiFetch<GetResponseGlobal<PermasalahanOpd[]>>(`${branding?.api_permasalahan}/permasalahan_terpilih/findall?kode_opd=${kode_opd}&tahun=${tahun}`, {
                method: "GET",
            }).then((result) => {
                const data = result.data;
                if (result.code === 200) {
                    setData(data);
                } else {
                    setError(true);
                    console.log(result.data);
                }
            }).catch((err) => {
                console.log(err);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        if (kode_opd && tahun) {
            fetchPermasalahanTerpilih();
        }
    }, [tahun, kode_opd]);

    const hapusPermasalahan = async(id: number) => {
        await apiFetch(`${branding?.api_permasalahan}/permasalahan/${id}/hapus_permasalahan_terpilih`, {
            method: "DELETE",
        }).then((result: any) => {
            if(result.code === 200){
                AlertNotification("Berhasil", "Data Permasalahan berhasil di hapus", "success", 2000, true);
                setData(Data.filter((data) => (data.id !== id)));
            } else {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
                console.log(result.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    if (Error) {
        return (
            <div className="text-red-500">
                Error data permasalahan, Periksa koneksi internet, jika error berlajut silakan hubungi tim developer
            </div>
        )
    } else if(Loading) {
        return(
            <div className="border rounded-lg m-2">
                <LoadingBeat />
            </div>
        )
    }

    return (
        <div className="overflow-auto mb-2 mx-2 rounded-t-xl border">
            <table className="w-full">
                <thead>
                    <tr className="bg-orange-500 text-white">
                        <th className="border-r border-b px-6 py-3 text-center w-[50px]">No</th>
                        <th className="border-r border-b px-6 py-3">Permasalahan</th>
                        <th className="border-r border-b px-6 py-3">Jenis</th>
                        <th className="border-r border-b px-6 py-3 w-[50px]">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {Data.length === 0 ?
                        <tr>
                            <td colSpan={4} className="border-x border-b border-orange-500 py-4 px-3 text-center">
                                Data Permasalahan Kosong / Pilih dahulu permasalahan di menu Renstra-Permasalahan
                            </td>
                        </tr>
                        :
                        Data.map((data: PermasalahanOpd, index: number) => (
                            <tr key={index}>
                                <td className="border-x border-b border-orange-500 py-4 px-3 text-center">
                                    {index + 1}
                                </td>
                                <td className="border-r border-b border-orange-500 px-6 py-4">
                                    {data.nama_pohon || "-"}
                                </td>
                                <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                    {data.jenis_masalah || "-"}
                                </td>
                                <td className="border-r border-b border-orange-500 px-6 py-4">
                                    <div className="flex flex-col jutify-center items-center gap-2">
                                        <ButtonRedBorder
                                            className="flex items-center gap-1 w-full"
                                            onClick={() => {
                                                AlertQuestion("Hapus?", "Data Permasalahan akan di hapus?", "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        hapusPermasalahan(data.id);
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
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TablePermasalahan;