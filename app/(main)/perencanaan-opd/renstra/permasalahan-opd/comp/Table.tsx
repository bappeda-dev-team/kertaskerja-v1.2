'use client'

import { ButtonSkyBorder, ButtonBlack } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { LoadingSync } from "@/lib/loading";
import { TbPencil, TbCheckbox } from "react-icons/tb";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponsePermasalahanOpd, PermasalahanOpd } from "../type";
import { GetResponseGlobal } from "@/types";
import { apiFetch } from "@/hook/apiFetch";
import { FormPermasalahan } from "./FormPermasalahan";

interface Table {
    kode_opd: string;
    tahun: string;
}

export const TablePermasalahan: React.FC<Table> = ({ kode_opd, tahun }) => {

    const { branding } = useBrandingContext();

    const [Pohon, setPohon] = useState<PermasalahanOpd[]>([]);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        const fetchPohon = async () => {
            setLoading(true);
            await apiFetch<GetResponseGlobal<GetResponsePermasalahanOpd>>(`${branding?.api_permasalahan}/permasalahan/${kode_opd}/${tahun}`, {
                method: "GET",
            }).then((resp) => {
                if (resp.code === 200) {
                    if (resp.data.childs === null) {
                        setDataNull(true);
                        setError(false)
                        setPohon([]);
                    } else {
                        setDataNull(false);
                        setError(false);
                        setPohon(resp.data.childs);
                    }
                } else {
                    setError(true);
                    setPohon([]);
                }
            }).catch((err) => {
                setError(true);
                console.error(err);
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchPohon();
    }, [kode_opd, tahun, branding, FetchTrigger]);

    if (Loading) {
        return (
            <div className="overflow-auto m-2 rounded-xl border">
                <LoadingSync />
            </div>
        )
    } else if (Error) {
        return (
            <div className="overflow-auto m-2 rounded-xl border">
                <h1 className="p-4 text-red-500 font-semibold">Error, periksa koneksi internet atau database server. terdapat kesalahan di backend</h1>
            </div>
        )
    }

    return (
        <div className="overflow-auto m-2 rounded-t-xl border">
            <table className="w-full">
                <thead>
                    <tr className="bg-black border border-black text-white">
                        <th className="border-r border-b px-3 py-3 max-w-[50px] text-center">No</th>
                        <th colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Masalah Pokok</th>
                        <th colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Masalah</th>
                        <th colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Akar Masalah</th>
                    </tr>
                </thead>
                {DataNull ?
                    <tbody>
                        <tr>
                            <td colSpan={30} className="p-4 font-semibold">Data Pohon Kinerja Kosong / Belum di tambahkan di tahun {tahun}</td>
                        </tr>
                    </tbody>
                    :
                    <tbody>
                        {Pohon.map((p: PermasalahanOpd, index: number) => {

                            let calculatedTotalRow2;

                            // if (p.childs.length === 0) {
                            if (!p.childs) {
                                calculatedTotalRow2 = 1; // Hanya baris p sendiri jika tidak ada anak taktis
                            } else {
                                calculatedTotalRow2 = p.childs.reduce((accumulator, t_element) => {
                                    // t_element adalah setiap item 'tactical' (disebut 't' di JSX)
                                    let rowsForThis_t_element;
                                    if (!t_element.childs) {
                                        rowsForThis_t_element = 2; // Baris t_element + baris pesan "tidak ada anak pohon"
                                    } else {
                                        rowsForThis_t_element = 1 + t_element.childs.length; // Baris t_element + baris untuk setiap anak 'operational'
                                    }
                                    return accumulator + rowsForThis_t_element;
                                }, 0);
                            }

                            return (
                                // Strategic
                                <React.Fragment key={p.id || index}>
                                    <tr>
                                        <td rowSpan={p.childs ? calculatedTotalRow2 + 1 : 2} className="border-x border-b border-black px-3 py-4 text-center">{index + 1}</td>
                                        <Childs
                                            data={p}
                                            rowSpan={p.childs ? calculatedTotalRow2 + 1 : 2}
                                            tahun={tahun}
                                        />
                                    </tr>
                                    {/* TACTICAL */}
                                    {!p.childs ?
                                        <tr>
                                            <td colSpan={4} className="p-6 font-semibold border border-black text-red-400">tidak ada anak pohon</td>
                                        </tr>
                                        :
                                        p.childs.map((t: PermasalahanOpd, sub_index: number) => (
                                            <React.Fragment key={t.id || sub_index}>
                                                <tr>
                                                    <Childs
                                                        data={t}
                                                        rowSpan={t.childs ? t.childs.length + 1 : 2}
                                                        tahun={tahun}
                                                    />
                                                </tr>
                                                {/* OPERATIONAL */}
                                                {!t.childs ?
                                                    <tr>
                                                        <td colSpan={2} className="p-6 font-semibold border border-black text-red-400">tidak ada anak pohon</td>
                                                    </tr>
                                                    :
                                                    t.childs.map((o: PermasalahanOpd, subsub_index: number) => (
                                                        <tr key={o.id || subsub_index}>
                                                            <Childs
                                                                data={o}
                                                                rowSpan={1}
                                                                tahun={tahun}
                                                            />
                                                        </tr>
                                                    ))
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                }
            </table>
        </div>
    );
}

interface Childs {
    data?: PermasalahanOpd;
    rowSpan: number;
    tahun: string;
    editing?: () => void;
}

export const Childs: React.FC<Childs> = ({ data, rowSpan, tahun }) => {

    const [Edit, setEdit] = useState<boolean>(false);
    const [JenisForm, setJenisForm] = useState<"baru" | "edit" | "">("");
    const [LoadingPilih, setLoadingPilih] = useState<boolean>(false);
    const [Terpilih, setTerpilh] = useState<boolean>(false);
    const {branding} = useBrandingContext();

    const handleEdit = (jenis: "baru" | "edit" | "") => {
        if (Edit) {
            setEdit(false);
            setJenisForm("");
        } else {
            setEdit(true);
            setJenisForm(jenis);
        }
    }

    const handlePilih = async (id: number) => {
        const formData = {
            masalah_id: id,
            kode_opd: data?.perangkat_daerah.kode_opd,
            tahun: String(tahun),
        }
        // console.log(formData);
        setLoadingPilih(true);
        await apiFetch(`${branding.api_permasalahan}/permasalahan_terpilih/create`, {
            method: "POST",
            body: JSON.stringify(formData),
        }).then((resp: any) => {
            if (resp.code === 200) {
                AlertNotification("Berhasil", "Berhasil memilih data permasalahan, lanjut ke halaman isu strategis", "success", 2000, true);
                setTerpilh(true);
            } else {
                AlertNotification("Gagal", `${resp.data}`, "error");
            }
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setLoadingPilih(false);
        })
    }

    if (Edit) {
        return (
            <FormPermasalahan
                data={data}
                rowSpan={rowSpan}
                tahun={tahun}
                editing={() => handleEdit("")}
                jenis={JenisForm}
            />
        )
    } else if (LoadingPilih) {
        return (
            <td>Loading...</td>
        )
    } else {
        return (
            <React.Fragment>
                <td
                    rowSpan={rowSpan}
                    className={`border-r border-b border-black px-6 py-4 
                        ${data?.level_pohon === 4 && 'bg-red-300'}
                        ${data?.level_pohon === 5 && 'bg-blue-200'}
                        ${data?.level_pohon === 6 && 'bg-emerald-200'}
                    `}
                >
                    {data?.nama_pohon || "-"}
                </td>
                <td
                    rowSpan={rowSpan}
                    className={`border-r border-b border-black px-6 py-4 max-w-[150px]
                        ${data?.level_pohon === 4 && 'bg-red-300'}
                        ${data?.level_pohon === 5 && 'bg-blue-200'}
                        ${data?.level_pohon === 6 && 'bg-emerald-200'}
                    `}
                >
                    <div className="flex flex-col justify-center items-center gap-2">
                        <ButtonSkyBorder
                            className="w-full"
                            onClick={() => {
                                if (data?.is_permasalahan) {
                                    handleEdit("edit");
                                } else {
                                    handleEdit("baru");
                                }
                            }}
                        >
                            <TbPencil className="mr-1" />
                            Edit
                        </ButtonSkyBorder>
                        {(data?.permasalahan_terpilih || Terpilih) &&
                            <ButtonBlack className="cursor-not-allowed">
                                Terpilih
                            </ButtonBlack>
                        }
                        {(data?.is_permasalahan && !data?.permasalahan_terpilih && !Terpilih) &&
                            <ButtonBlack className="w-full"
                                onClick={() => {
                                    AlertQuestion("Pilih?", `${data?.nama_pohon}`, "question", "Pilih", "Batal").then((result) => {
                                        if (result.isConfirmed) {
                                            if (data?.id_permasalahan) {
                                                handlePilih(data.id_permasalahan);
                                            } else {
                                                AlertNotification("ERROR", "ID permasalahan tidak ditemukan / kosong, hubungi tim developer", "error");
                                            }
                                        }
                                    });
                                }}
                            >
                                <TbCheckbox className="mr-1" />
                                Pilih
                            </ButtonBlack>
                        }
                    </div>
                </td>
            </React.Fragment>
        )
    }
}