'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseControlPokin, Pokin, PokinLevel } from "./type";
import { AlertNotification } from "@/lib/alert";
import { apiFetch } from "@/hook/apiFetch";

interface Table {
    kode_opd: string;
    tahun: number;
}

const Table: React.FC<Table> = ({ kode_opd, tahun }) => {

    const [Data, setData] = useState<Pokin | null>(null);
    const [Error, setError] = useState<boolean | null>(null);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const { branding } = useBrandingContext();

    useEffect(() => {
        const GetControlPokin = async () => {
            setLoading(true);
            await apiFetch<GetResponseControlPokin>(`${branding?.api_perencanaan}/pohon_kinerja_opd/control_pokin_opd/${kode_opd}/${tahun}`, {
                method: "GET",
            }).then((resp) => {
                const data = resp.data;
                if (resp.code === 200) {
                    setData(data);
                } else {
                    setData(null);
                    setError(true);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        GetControlPokin();
    }, [branding, tahun, kode_opd]);

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
                                <th className="border-r border-b border-gray-200 px-6 py-3 text-center">No</th>
                                <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">Level Pohon Kinerja</th>
                                <th className="border-r border-b border-gray-200 px-6 py-3 w-[200px]">Jumlah Pokin</th>
                                <th className="border-r border-b border-gray-200 px-6 py-3 w-[200px]">Jumlah Pelaksana</th>
                                <th className="border-l border-b border-gray-200 px-6 py-3 w-[200px]">Jumlah Pokin Dengan Pelaksana</th>
                                <th className="border-l border-b border-gray-200 px-6 py-3 w-[200px]">Jumlah Pokin Tanpa Pelaksana</th>
                                <th className="border-l border-b border-gray-200 px-6 py-3 min-w-[200px]">
                                    <div className="flex flex-col gap-1">
                                        <p>Persentase Pokin Dengan Pelaksana</p>
                                        <p className="text-sm">(Kolom 5 / Kolom 3)</p>
                                    </div>
                                </th>
                                <th className="border-l border-b border-gray-200 px-6 py-3 w-[200px]">Jumlah Rencana Kinerja</th>
                                <th className="border-l border-b border-gray-200 px-6 py-3 w-[200px]">Jumlah Pokin Dengan Rencana Kinerja</th>
                                <th className="border-l border-b border-gray-200 px-6 py-3 w-[200px]">Jumlah Pokin Tanpa Rencana Kinerja</th>
                                <th className="border-l border-b border-gray-200 px-6 py-3 min-w-[200px]">
                                    <div className="flex flex-col gap-1">
                                        <p>Persentase Cascading Kinerja</p>
                                        <p className="text-sm">(Kolom 9  / Kolom 3)</p>
                                    </div>
                                </th>
                            </tr>
                            <tr className="bg-orange-700 text-white">
                                <th className="border-r border-b border-gray-200 px-2 py-1 text-center">1</th>
                                <th className="border-r border-b border-gray-200 px-2 py-1 text-center">2</th>
                                <th className="border-r border-b border-gray-200 px-2 py-1 text-center">3</th>
                                <th className="border-r border-b border-gray-200 px-2 py-1 text-center">4</th>
                                <th className="border-l border-b border-gray-200 px-2 py-1 text-center">5</th>
                                <th className="border-l border-b border-gray-200 px-2 py-1 text-center">6</th>
                                <th className="border-l border-b border-gray-200 px-2 py-1 text-center">7</th>
                                <th className="border-l border-b border-gray-200 px-2 py-1 text-center">8</th>
                                <th className="border-l border-b border-gray-200 px-2 py-1 text-center">9</th>
                                <th className="border-l border-b border-gray-200 px-2 py-1 text-center">10</th>
                                <th className="border-l border-b border-gray-200 px-2 py-1 text-center">11</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!Data?.data ?
                                <tr>
                                    <td className="px-6 py-3" colSpan={30}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                <>
                                    {Data.data.map((item: PokinLevel, index: number) => (
                                        <tr key={index}>
                                            <td className="border-x border-b border-orange-500 py-4 px-3 text-center">
                                                {index + 1}
                                            </td>
                                            <td className={`border-r border-b border-orange-500 px-6 py-4 font-bold
                                                    ${item.level_pohon === 4 && "text-red-400"}
                                                    ${item.level_pohon === 5 && "text-blue-400"}
                                                    ${item.level_pohon === 6 && "text-green-400"}
                                                    ${item.level_pohon > 6 && "text-emerald-400"}
                                                `}>
                                                {item.nama_level || "-"}
                                            </td>
                                            <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                                {item.jumlah_pokin || 0}
                                            </td>
                                            <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                                {item.jumlah_pelaksana || 0}
                                            </td>
                                            <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                                {item.jumlah_pokin_ada_pelaksana || 0}
                                            </td>
                                            <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                                {item.jumlah_pokin_tanpa_pelaksana || 0}
                                            </td>
                                            <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                                {item.persentase || "0%"}
                                            </td>
                                            <td className="border-r border-b border-orange-500 bg-orange-100 px-6 py-4 text-center">
                                                {item.jumlah_rencana_kinerja || 0}
                                            </td>
                                            <td className="border-r border-b border-orange-500 bg-orange-100 px-6 py-4 text-center">
                                                {item.jumlah_pokin_ada_rekin || 0}
                                            </td>
                                            <td className="border-r border-b border-orange-500 bg-orange-100 px-6 py-4 text-center">
                                                {item.jumlah_pokin_tanpa_rekin || 0}
                                            </td>
                                            <td className="border-r border-b border-orange-500 bg-orange-100 px-6 py-4 text-center">
                                                {item.persentase_cascading || "0%"}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-orange-600 text-white">
                                        <td colSpan={2} className="border-r border-l border-r-white border-l-orange-500 px-6 py-4 font-bold">
                                            Total
                                        </td>
                                        <td className="text-center border-r border-white px-6 py-4 font-bold">
                                            {Data.total.total_pokin || 0}
                                        </td>
                                        <td className="text-center border-r border-white px-6 py-4 font-bold">
                                            {Data.total.total_pelaksana || 0}
                                        </td>
                                        <td className="text-center border-r border-white px-6 py-4 font-bold">
                                            {Data.total.total_pokin_ada_pelaksana || 0}
                                        </td>
                                        <td className="text-center border-r border-white px-6 py-4 font-bold">
                                            {Data.total.total_pokin_tanpa_pelaksana || 0}
                                        </td>
                                        <td className="text-center border-r border-orange-500 px-6 py-4 font-bold">
                                            {Data.total.persentase || "0%"}
                                        </td>
                                        <td className="text-center border-r border-orange-500 px-6 py-4 font-bold">
                                            {Data.total.total_rencana_kinerja || 0}
                                        </td>
                                        <td className="text-center border-r border-orange-500 px-6 py-4 font-bold">
                                            {Data.total.total_pokin_ada_rekin || 0}
                                        </td>
                                        <td className="text-center border-r border-orange-500 px-6 py-4 font-bold">
                                            {Data.total.total_pokin_tanpa_rekin || 0}
                                        </td>
                                        <td className="text-center border-r border-orange-500 px-6 py-4 font-bold">
                                            {Data.total.persentase_cascading || "0%"}
                                        </td>
                                    </tr>
                                </>
                            }
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default Table;
