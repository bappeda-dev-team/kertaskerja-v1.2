'use client'

import { useState, useEffect } from "react";
import { LoadingClip } from "@/lib/loading";
import { TbArrowBadgeDownFilled } from "react-icons/tb";
import { apiFetch } from "@/hook/apiFetch";
import { Tematik, OPD, GetResponseListOpdTematik } from "./type";
import { AlertNotification } from "@/lib/alert";
import { useBrandingContext } from "@/providers/BrandingProvider";

const Table = () => {

    const [Opd, setOpd] = useState<Tematik[]>([]);

    const [IsError, setIsError] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Show, setShow] = useState<{ [key: number]: boolean }>({});
    const [DataNull, setDataNull] = useState<boolean>(false);

    const { branding } = useBrandingContext();

    useEffect(() => {
        const fetchOpd = async () => {
            setLoading(true);
            await apiFetch<GetResponseListOpdTematik>(`${branding?.api_perencanaan}/pokin_tematik/list_opd/${branding?.tahun?.value}`, {
                method: "GET",
            }).then((resp) => {
                const data = resp.data;
                if (data == null) {
                    setDataNull(true);
                    setOpd([]);
                } else if (resp.code === 401) {
                    setIsError(true);
                } else {
                    setDataNull(false);
                    setOpd(data);
                    setIsError(false);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                setIsError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchOpd();
    }, [branding]);

    const handleShow = (id: number) => {
        setShow((prev) => ({
            [id]: !prev[id],
        }));
    }

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
                {DataNull ?
                    <div className="px-6 py-3 border border-gray-200 w-full rounded-xl">
                        Data Kosong / Belum Ditambahkan
                    </div>
                    :
                    Opd.map((data: Tematik, index: number) => {

                        const isShown = Show[index] || false;

                        return (
                            <div className="flex flex-col m-2 w-full" key={index}>
                                <div
                                    className={`flex justify-between border items-center p-5 rounded-xl text-emerald-500 cursor-pointer border-emerald-500 hover:bg-emerald-500 hover:text-white ${isShown ? "bg-emerald-500 text-white" : ""}`}
                                    onClick={() => {
                                        if (data.is_active === true) {
                                            handleShow(index);
                                        }
                                    }}
                                >

                                    {data.is_active === true ?
                                        <h1 className="font-semibold">Tematik - {data.tematik}</h1>
                                        :
                                        <h1 className="font-semibold text-red-500">Tematik - {data.tematik} (non-aktif)</h1>
                                    }
                                    <div className="flex items-center">
                                        <TbArrowBadgeDownFilled className={`transition-all duration-200 ease-in-out text-3xl ${isShown ? "" : "-rotate-90"}`} />
                                    </div>
                                </div>
                                <div className={`transition-all duration-300 ease-in-out border-x border-b border-emerald-500 ${isShown ? "opacity-100 mx-4 p-5" : "max-h-0 opacity-0 pointer-events-none"}`}>
                                    <div className="overflow-auto rounded-t-xl border border-gray-200">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-emerald-500 text-white">
                                                    <th className="border-r border-gray-200 border-b px-6 py-3 min-w-[50px]">No</th>
                                                    <th className="border-r border-gray-200 border-b px-6 py-3 min-w-[200px]">Kode Perangkat Daerah</th>
                                                    <th className="border-r border-gray-200 border-b px-6 py-3 min-w-[300px]">Nama Perangkat Daerah</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data.list_opd ?
                                                        data.list_opd.map((data: OPD, index) => (
                                                            <tr key={index}>
                                                                <td className="border-r border-gray-200 border-b px-6 py-4 text-center">{index + 1}</td>
                                                                <td className="border-r border-gray-200 border-b px-6 py-4">{data.kode_opd ? data.kode_opd : "-"}</td>
                                                                <td className="border-r border-gray-200 border-b px-6 py-4">{data.perangkat_daerah ? data.perangkat_daerah : "-"}</td>
                                                            </tr>
                                                        ))
                                                        :
                                                        <tr>
                                                            <td className="px-6 py-3 uppercase" colSpan={13}>
                                                                Tidak Ada OPD terkait di tematik ini
                                                            </td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </>
        )
    }
}

export default Table;