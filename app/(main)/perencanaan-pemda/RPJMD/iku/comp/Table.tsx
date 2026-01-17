'use client'

import React, { useEffect, useState } from "react";
import { ButtonBlackBorder } from "@/components/ui/button";
import { TbMistOff, TbCircleCheck, TbCircleX, TbMist } from "react-icons/tb";
import { LoadingClip } from "@/lib/loading";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { GetResponseGlobal } from "@/types";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseFindallIkuPemda, Target } from "../type";
import { useBrandingContext } from "@/providers/BrandingProvider";

interface table {
    id_periode: number;
    tahun_awal: string;
    tahun_akhir: string;
    jenis: string;
    tahun_list: string[];
}

const TablePemda: React.FC<table> = ({ id_periode, tahun_awal, tahun_akhir, jenis, tahun_list }) => {

    const { branding } = useBrandingContext();
    const Tahun = branding?.tahun ? branding?.tahun?.value : 0;
    const [IKU, setIKU] = useState<GetResponseFindallIkuPemda[]>([]);

    const [TableAktif, setTableAktif] = useState<boolean>(true);
    const [TableNonAktif, setTableNonAktif] = useState<boolean>(false);

    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIkuPemda = async () => {
            setLoading(true);
            setError(false);
            setDataNull(false);
            try {
                await apiFetch<GetResponseGlobal<GetResponseFindallIkuPemda[]>>(`${branding?.api_perencanaan}/indikator_utama/periode/${tahun_awal}/${tahun_akhir}/${jenis}`, {
                    method: "GET",
                }).then((resp) => {
                    const isActiveFilter = TableAktif;
                    const filteredData = resp.data?.filter((n: any) => n.iku_active === isActiveFilter) || [];
    
                    if (resp.code === 200 || resp.code === 201) {
                        if (filteredData.length === 0) {
                            setDataNull(true);
                        }
                        setIKU(filteredData);
                    } else {
                        console.error(resp.data);
                        setError(true);
                        setIKU([]); // Kosongkan data jika ada error dari API
                    }
                }).catch(err => {
                    AlertNotification("Gagal", `${err}`, "error", 3000, true);
                    setError(true);
                }).finally(() => {
                    setLoading(false);
                })
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (Tahun != undefined) {
            fetchIkuPemda();
        }
    }, [branding, Tahun, tahun_awal, tahun_akhir, jenis, TableNonAktif, TableAktif]);

    const UpdateStatusIku = async (id: string,) => {
        const formData = {
            indikator_id: id,
            is_active: !TableAktif,
        }
        // console.log(formData);
        try {
            setProses(true);
            await apiFetch(`${branding?.api_perencanaan}/indikator_utama/status/${id}`, {
                method: jenis === "tambah" ? "POST" : "PUT",
                body: formData as any
            }).then((resp : any) => {
                if (resp.code === 200 || resp.code === 201) {
                    AlertNotification("Berhasil", "berhasil mengubah status IKU", "success");
                    setIKU(IKU.filter((data) => (data.indikator_id !== id)));
                } else {
                    console.error(resp.data);
                    AlertNotification("Gagal", `${resp.data}`, "error");
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            })
        } catch (err) {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
            console.log(err)
        } finally {
            setProses(false);
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
                <h1 className="text-red-500 font-bold mx-5 py-5">Error, Periksa koneksi internet atau database server, jika error berlanjut silakan hubungi tim developer</h1>
            </div>
        )
    }

    return (
        <>
            <div className="flex px-3 py-2 justify-center items-center gap-1">
                <button
                    className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg w-full cursor-pointer 
                        ${TableAktif ? "bg-emerald-500 text-white" : "border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"}
                    `}
                    onClick={() => {
                        setTableAktif(true);
                        setTableNonAktif(false);
                    }}
                >
                    <TbCircleCheck />
                    IKU yang aktif
                </button>
                <button
                    className={`flex items-center justify-center gap-1 px-4 py-2 rounded-lg w-full cursor-pointer 
                        ${TableNonAktif ? "bg-orange-500 text-white" : "border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"}
                    `}
                    onClick={() => {
                        setTableAktif(false);
                        setTableNonAktif(true);
                    }}
                >
                    <TbCircleX />
                    IKU yang tidak aktif
                </button>
            </div>
            <div className="overflow-auto mx-2 mb-3 rounded-t-xl border border-emerald-500">
                <table className="w-full">
                    <thead>
                        <tr className={`${TableAktif ? "bg-emerald-500" : "bg-orange-500"} text-white`}>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 text-center">No</th>
                            <th rowSpan={2} colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Indikator Utama</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                            {tahun_list.map((item: any) => (
                                <th key={item} colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">{item}</th>
                            ))}
                        </tr>
                        <tr className={`${TableAktif ? "bg-emerald-600" : "bg-orange-600"} text-white`}>
                            {tahun_list.map((item: any) => (
                                <React.Fragment key={item}>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                                </React.Fragment>
                            ))}
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
                            IKU.map((item, index) => (
                                <tr key={item.indikator_id || index}>
                                    <td className={`border-x border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} py-4 px-3 text-center`}>
                                        {index + 1}
                                    </td>
                                    <td className={`border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4`}>
                                        <p>{item.indikator || "-"}</p>
                                        <p className={`text-gray-500 text-xs`}>({item.asal_iku || "-"})</p>
                                        <p className={`text-red-500 text-xs`}>{item.is_active === false ? "(Tematik tidak aktif)" : ""}</p>
                                    </td>
                                    <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} pr-6`}>
                                        <div className={`flex flex-col justify-center items-center gap-2`}>
                                            <ButtonBlackBorder
                                                disabled={Proses}
                                                className={`flex items-center gap-1 w-full text-sm`}
                                                onClick={() => {
                                                    if (TableAktif) {
                                                        AlertQuestion("Non Aktifkan IKU?", "", "question", "NonAktifkan", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                UpdateStatusIku(item.indikator_id);
                                                            }
                                                        });
                                                    } else {
                                                        AlertQuestion("Aktifkan IKU?", "", "question", "Aktifkan", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                UpdateStatusIku(item.indikator_id);
                                                            }
                                                        });
                                                    }
                                                }}
                                            >
                                                {TableAktif ?
                                                    <>
                                                        <TbMistOff />
                                                        NonAktifkan
                                                    </>
                                                    :
                                                    <>
                                                        <TbMist />
                                                        Aktifkan
                                                    </>
                                                }
                                            </ButtonBlackBorder>
                                        </div>
                                    </td>
                                    <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4`}>
                                        {item.rumus_perhitungan || "-"}
                                    </td>
                                    <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4`}>
                                        {item.sumber_data || "-"}
                                    </td>
                                    {item.target.map((t: Target, index: number) => (
                                        <React.Fragment key={index}>
                                            <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4 text-center`}>
                                                {t.target || "-"}
                                            </td>
                                            <td className={`border-r border-b ${TableAktif ? "border-emerald-500" : "border-orange-500"} px-6 py-4 text-center`}>
                                                {t.satuan || "-"}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default TablePemda;
