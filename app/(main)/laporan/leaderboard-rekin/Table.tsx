'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { AlertNotification } from "@/lib/alert";
import { apiFetch } from "@/hook/apiFetch";
import { Pokin, Tematik, GetResponseLeaderboardRekin } from "./type";

const Table = () => {

    const [Data, setData] = useState<Pokin[]>([]);
    const [Error, setError] = useState<boolean | null>(null);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const { branding } = useBrandingContext();

    useEffect(() => {
        const GetRekin = async () => {
            setLoading(true);
            await apiFetch<GetResponseLeaderboardRekin>(`${branding?.api_perencanaan}/pohon_kinerja_opd/leaderboard_pokin_opd/${branding?.tahun?.value}`, {
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
                AlertNotification("Gagal", `${err}`, "error", 3000);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        GetRekin();
    }, [branding]);

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
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
                                <th className="border-r border-b border-gray-200 px-6 py-3 text-center">No</th>
                                <th className="border-r border-b border-gray-200 px-6 py-3 w-[350px]">Perangkat Daerah</th>
                                <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">Tema</th>
                                <th className="border-r border-b border-gray-200 px-6 py-3 w-[100px]">Persentase Cascading</th>
                            </tr>
                            <tr className="bg-orange-700 text-white">
                                <th className="border-r border-b border-gray-200 px-2 py-1 text-center">1</th>
                                <th className="border-r border-b border-gray-200 px-2 py-1 text-center">2</th>
                                <th className="border-r border-b border-gray-200 px-2 py-1 text-center">3</th>
                                <th className="border-r border-b border-gray-200 px-2 py-1 text-center">4</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!Data || Data.length === 0) ?
                                <tr>
                                    <td className="px-6 py-3" colSpan={30}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                Data.map((item: Pokin, index: number) => (
                                    <tr>
                                        <td className="border-x border-b border-orange-500 py-4 px-3 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="border-r border-b border-orange-500 px-6 py-4">
                                            {item.nama_opd || "-"}
                                        </td>
                                        <td className="border-r border-b border-orange-500 px-6 py-4">
                                            {item.tematik ?
                                                item.tematik.map((t: Tematik, index_tematik: number) => (
                                                    <div key={index_tematik} className="flex items-center">
                                                        <p className="py-1 px-2 my-2 bg-emerald-600 text-white rounded-lg">{t.nama || "tematik tanpa nama"}</p>
                                                    </div>
                                                ))
                                                :
                                                <p>-</p>
                                            }
                                        </td>
                                        <td className="border-r border-b font-bold border-orange-500 px-6 py-4 text-center">
                                            {item.persentase_cascading || "0%"}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default Table;
