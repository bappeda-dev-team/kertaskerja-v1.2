'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { AlertNotification } from "@/lib/alert";
import { Review } from "../../type";

interface table {
    tahun: string;
    kode_opd: string;
}

const Table: React.FC<table> = ({ tahun, kode_opd }) => {

    const [ReviewOpd, setReviewOpd] = useState<Review[]>([]);

    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const { branding } = useBrandingContext();

    useEffect(() => {
        const fetchOpd = async () => {
            setLoading(true);
            await apiFetch<any>(`${branding?.api_perencanaan}/review_pokin/opd/${kode_opd}/${tahun}`, {
                method: "GET",
            }).then((resp) => {
                const data = resp.data;
                if (data == null) {
                    setDataNull(true);
                    setReviewOpd([]);
                } else if (resp.code === 401) {
                    setError(true);
                } else {
                    setDataNull(false);
                    setReviewOpd(data);
                    setError(false);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchOpd();
    }, [branding, tahun, kode_opd]);

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Reload Halaman, Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else {
        return (
            <>
                <div className="overflow-auto m-2 rounded-t-xl border border-gray-200">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-emerald-500 text-white">
                                <th className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama Pohon</th>
                                <th className="border-r border-b px-6 py-3 min-w-[400px]">Review</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Keterangan</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">User Pembuat</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Waktu Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ReviewOpd.length > 0 ?
                                ReviewOpd.map((data: Review, index: number) => {
                                    return (
                                        <React.Fragment key={index}>
                                            {/* Baris Utama */}
                                            <tr>
                                                <td className="border-x border-b border-emerald-500 px-6 py-4 text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-emerald-500 px-6 py-4">
                                                    <p>{data.nama_pohon || "-"}</p>
                                                    <p className="uppercase text-emerald-500 text-xs">{data.jenis_pohon}</p>
                                                </td>
                                                <td className="border border-emerald-500 px-6 py-4">
                                                    <p>{data.review || "-"}</p>
                                                </td>
                                                <td className="border border-emerald-500 px-6 py-4">
                                                    <p>{data.keterangan || "-"}</p>
                                                </td>
                                                <td className="border border-emerald-500 px-6 py-4">
                                                    <p>{data.created_by}</p>
                                                </td>
                                                <td className="border border-emerald-500 px-6 py-4">
                                                    {data.created_at === data.updated_at ?
                                                        <>
                                                            <p className="font-semibold">dibuat pada :</p>
                                                            <p>
                                                                {new Date(data.created_at).toLocaleDateString("id-ID", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                })}
                                                            </p>
                                                        </>
                                                        :
                                                        <>
                                                            <p className="font-semibold">diedit pada :</p>
                                                            <p>
                                                                {new Date(data.updated_at).toLocaleDateString("id-ID", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                })}
                                                            </p>
                                                        </>
                                                    }
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })
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
