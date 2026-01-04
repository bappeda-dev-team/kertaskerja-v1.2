'use client'

import { useState, useEffect } from "react";
import { LoadingClip } from "@/lib/loading";
import { apiFetch } from "@/hook/apiFetch";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { GetResponseTematik, GetResponseTematiks, Tematiks, Indikator, Target } from "../type";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { HeaderCard, Card } from "@/components/ui/Card";
import { ButtonSkyBorder, ButtonRedBorder } from "@/components/ui/button";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";
import { ModalTematik } from "./ModalTematik";

const Table = () => {

    const [Data, setData] = useState<Tematiks[]>([]);

    const [IsError, setIsError] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [DataModal, setDataModal] = useState<Tematiks | null>(null);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");

    const { branding } = useBrandingContext();

    const handleModal = (data: Tematiks | null, jenis: "tambah" | "edit") => {
        if(ModalOpen){
            setModalOpen(false); 
            setDataModal(data);
            setJenisModal(jenis);
        } else {
            setModalOpen(true);
            setDataModal(data);
            setJenisModal(jenis);
        }
    }

    useEffect(() => {
        const fetchOpd = async () => {
            setLoading(true);
            await apiFetch<any>(`${branding?.api_perencanaan}/tematik_pemda/${branding?.tahun?.value}`, {
                method: "GET",
            }).then((resp) => {
                const result = resp.data;
                if (result?.tematiks == null) {
                    setData([]);
                } else if (resp.code === 401) {
                    setIsError(true);
                } else {
                    setData(result?.tematiks);
                    setIsError(false);
                }
                console.log(result?.tematiks);
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                setIsError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchOpd();
    }, [branding, FetchTrigger]);

    const hapusData = async (id: any) => {
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/pohon_kinerja_admin/delete/${id}`, {
            method: "DELETE",
        }).then(resp => {
            setData(Data.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Tematik Berhasil Dihapus", "success", 2000);
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
    } else if (IsError) {
        return (
            <div className="w-full border border-gray-200 p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else {
        return (
            <>
                {Data.length === 0 ?
                    <div className="px-6 py-3 border border-gray-200 w-full rounded-xl">
                        Data Kosong / Belum Ditambahkan
                    </div>
                    :
                    <Card>
                        <HeaderCard>
                            <h1 className="font-bold text-lg uppercase">Tematik {branding?.tahun?.label || ""}</h1>
                            <ButtonSkyBorder
                                className='flex items-center gap-1'
                                onClick={() => handleModal(null, "tambah")}
                            >
                                <TbCirclePlus />
                                Tambah Tematik
                            </ButtonSkyBorder>
                        </HeaderCard>
                        <div className="flex flex-wrap m-2">
                            <div className="overflow-auto m-2 rounded-t-xl border border-slate-300 w-full">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-emerald-500 text-white">
                                            <th className="border-r border-gray-200 border-b px-6 py-3 min-w-[50px]">No</th>
                                            <th className="border-r border-gray-200 border-b px-6 py-3 min-w-[300px]">Tema</th>
                                            <th className="border-r border-gray-200 border-b px-6 py-3 min-w-[300px]">Indikator</th>
                                            <th className="border-r border-gray-200 border-b px-6 py-3 min-w-[150px]">Target</th>
                                            <th className="border-r border-gray-200 border-b px-6 py-3 min-w-[150px]">Satuan</th>
                                            <th className="border-r border-gray-200 border-b px-6 py-3 min-w-[300px]">Keterangan</th>
                                            <th className="border-r border-gray-200 border-b px-6 py-3 min-w-[150px]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Data?.map((data: Tematiks, index: number) => (
                                            <tr key={index}>
                                                <td className="border-r border-gray-200 border-b px-6 py-4 text-center">{index + 1}</td>
                                                <td className="border-r border-gray-200 border-b px-6 py-4">{data.tema || "-"}</td>
                                                {data.indikator === null ?
                                                    <>
                                                        <td className="border-r border-gray-200 border-b px-6 py-4">-</td>
                                                        <td className="border-r border-gray-200 border-b px-6 py-4">-</td>
                                                        <td className="border-r border-gray-200 border-b px-6 py-4">-</td>
                                                    </>
                                                    :
                                                    <>
                                                        <td className="border-r border-gray-200 border-b px-6 py-4">
                                                            {data.indikator.map((item: Indikator, i_index: number) => (
                                                                <p key={i_index} className="p-1 my-2 rounded-lg border border-sky-500 w-full">{i_index + 1}. {item.nama_indikator || "-"}</p>
                                                            ))}
                                                        </td>
                                                        <td className="border-r border-gray-200 border-b px-6 py-4">
                                                            {data.indikator.map((item: Indikator, i_index: number) => (
                                                                item.targets ?
                                                                    item.targets.map((t: Target, t_index: number) => (
                                                                        <p className="p-1 my-2 rounded-lg border border-sky-500 w-full" key={t_index}>{i_index + 1}. {t.target || "-"}</p>
                                                                    ))
                                                                    :
                                                                    <p>-</p>
                                                            ))}
                                                        </td>
                                                        <td className="border-r border-gray-200 border-b px-6 py-4">
                                                            {data.indikator.map((item: Indikator, i_index: number) => (
                                                                item.targets ?
                                                                    item.targets.map((t: Target, t_index: number) => (
                                                                        <p className="p-1 my-2 rounded-lg border border-sky-500 w-full" key={t_index}>{i_index + 1}. {t.satuan || "-"}</p>
                                                                    ))
                                                                    :
                                                                    <p>-</p>
                                                            ))}
                                                        </td>
                                                    </>
                                                }
                                                <td className="border-r border-gray-200 border-b px-6 py-4">{data.keterangan || "-"}</td>
                                                <td className="border-b border-gray-200 px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <ButtonSkyBorder
                                                            className="w-full flex items-center gap-1"
                                                            onClick={() => handleModal(data, "edit")}
                                                        >
                                                            <TbPencil />
                                                            Edit
                                                        </ButtonSkyBorder>
                                                        <ButtonRedBorder
                                                            className="w-full flex items-center gap-1"
                                                            onClick={() => {
                                                                AlertQuestion("Hapus?", "Hapus Tematik yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        hapusData(data.id);
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {ModalOpen &&
                            <ModalTematik 
                                isOpen={ModalOpen}
                                onClose={() => handleModal(null, "tambah")}
                                Data={DataModal}
                                jenis={JenisModal}
                                onSuccess={() => setFetchTrigger((prev) => !prev)}
                            />
                        }
                    </Card>
                }
            </>
        )
    }
}

export default Table;