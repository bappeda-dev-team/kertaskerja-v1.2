'use client'

import { ButtonRed, ButtonGreen, ButtonSky } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { AlertNotification } from "@/lib/alert";
import { LoadingClip } from "@/lib/loading";
import { apiFetch } from "@/hook/apiFetch";
import { TbArrowBadgeDownFilled } from "react-icons/tb";
import { GetResponseFindallReviewPemda, Review } from "../../type";
import { useBrandingContext } from "@/providers/BrandingProvider";

interface table {
    tahun: string;
}

const Table: React.FC<table> = ({ tahun }) => {

    const [Data, setData] = useState<GetResponseFindallReviewPemda[]>([]);

    const [IsError, setIsError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean>(false);

    const [Show, setShow] = useState<{ [key: string]: boolean }>({});
    const {branding} = useBrandingContext();

    useEffect(() => {
        const fetchReviewPemda = async () => {
            setLoading(true);
            await apiFetch<any>(`${branding?.api_perencanaan}/review_pokin/tematik/${tahun}`, {
                method: "GET",
            }).then((resp) => {
                const data = resp.data;
                if (data == null) {
                    setDataNull(true);
                    setData([]);
                } else if (resp.code === 401) {
                    setIsError(true);
                } else {
                    setDataNull(false);
                    setData(data);
                    setIsError(false);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                setIsError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchReviewPemda();
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
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else {
        return (
            <>
                {DataNull ?
                    <div className="px-6 py-3 border w-full rounded-xl">
                        Data Kosong / Belum Ditambahkan
                    </div>
                    :
                    Data.map((data: GetResponseFindallReviewPemda) => {
                        const isShown = Show[data.id_tematik] || false;
    
                        return (
                            <div className="flex flex-col my-2 w-full" key={data.id_tematik}>
                                <div
                                    className={`flex justify-between border items-center p-5 rounded-xl text-emerald-500 cursor-pointer border-emerald-500 hover:bg-emerald-500 hover:text-white ${isShown ? "bg-emerald-500 text-white" : ""}`}
                                    onClick={() => handleShow(data.id_tematik)}
                                >
                                    <h1 className="font-semibold">Tematik - {data.nama_pohon}</h1>
                                    <div className="flex items-center">
                                        <TbArrowBadgeDownFilled className={`transition-all duration-200 ease-in-out text-3xl ${isShown ? "" : "-rotate-90"}`} />
                                    </div>
                                </div>
                                <div className={`transition-all duration-300 ease-in-out border-x border-b border-emerald-500 ${isShown ? "opacity-100 mx-4 p-5" : "max-h-0 opacity-0 pointer-events-none"}`}>
                                    <div className="overflow-auto rounded-t-xl border border-gray-200">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-xm bg-emerald-500 text-white">
                                                    <td className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Nama Pohon</td>
                                                    <td className="border-r border-b px-6 py-3 min-w-[400px] text-center">Review</td>
                                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Keterangan</td>
                                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">User Pembuat</td>
                                                    <td className="border-r border-b px-6 py-3 min-w-[200px]">Waktu Review</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.review == null ?
                                                    <tr>
                                                        <td className="px-6 py-3" colSpan={30}>
                                                            Tidak Ada review
                                                        </td>
                                                    </tr>
                                                    :
                                                    data.review.map((item: Review, index: number) => {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                {/* NO & POHON */}
                                                                <tr>
                                                                    <td className="border border-emerald-500 px-4 py-4 text-center">
                                                                        {index + 1}
                                                                    </td>
                                                                    <td className="border border-emerald-500 px-6 py-4">
                                                                        <p>{item.nama_pohon || "-"}</p>
                                                                        <p className="uppercase text-emerald-500 text-xs">{item.jenis_pohon}</p>
                                                                    </td>
                                                                    <td className="border border-emerald-500 px-6 py-4">
                                                                        <p>{item.review}</p>
                                                                    </td>
                                                                    <td className="border border-emerald-500 px-6 py-4">
                                                                        <p>{item.keterangan}</p>
                                                                    </td>
                                                                    <td className="border border-emerald-500 px-6 py-4">
                                                                        <p>{item.created_by}</p>
                                                                    </td>
                                                                    <td className="border border-emerald-500 px-6 py-4">
                                                                        {item.created_at === item.updated_at ?
                                                                            <>
                                                                                <p className="font-semibold">dibuat pada :</p>
                                                                                <p>
                                                                                    {new Date(item.created_at).toLocaleDateString("id-ID", {
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
                                                                                    {new Date(item.updated_at).toLocaleDateString("id-ID", {
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
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </>
        )
    }

}

export default Table;
