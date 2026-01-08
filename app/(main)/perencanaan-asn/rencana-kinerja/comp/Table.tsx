'use client'

import { ButtonBlackBorder, ButtonGreenBorder, ButtonRedBorder, ButtonSkyBorder } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { TbCirclePlus, TbPencil, TbPencilDown, TbTrash, TbLayersSubtract } from "react-icons/tb";
import { LoadingButton, LoadingClock } from "@/lib/loading";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { useRouter } from "next/navigation";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { ModalRencanaKinerja } from "./ModalRencanaKinerja";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseRekin, type_rekin, indikator, target } from "../type/rekin";

export const TablePerencanaan = () => {

    const [loading, setLoading] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean | null>(null);
    const [rekin, setRekin] = useState<type_rekin[]>([]);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"baru" | "lama">("baru");
    const [IdRekin, setIdRekin] = useState<string | null>(null);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const { branding } = useBrandingContext();
    const user = branding?.user
    const router = useRouter();

    useEffect(() => {
        const GetRekin = async () => {
            setLoading(true);
            await apiFetch<GetResponseRekin>(`${branding?.api_perencanaan}/get_rencana_kinerja/pegawai/${user?.nip}?tahun=${branding?.tahun?.value}`, {
                method: "GET",
            }).then((resp) => {
                const data = resp.rencana_kinerja;
                if (data == null) {
                    setDataNull(true);
                    setRekin([]);
                } else {
                    setDataNull(false);
                    setRekin(data);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            }).finally(() => {
                setLoading(false);
            })
        }
        GetRekin();
    }, [branding, user, FetchTrigger]);

    const handleModalRekin = (id: string, jenis: "baru" | "lama") => {
        if (ModalOpen) {
            setIdRekin(null);
            setModalOpen(false);
            setJenisModal("baru")
        } else {
            setIdRekin(id);
            setModalOpen(true);
            setJenisModal(jenis)
        }
    }

    const hapusRekin = async (id: any) => {
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/rencana_kinerja/delete/${id}`, {
            method: "DELETE",
        }).then(resp => {
            setRekin(rekin.filter((data) => (data.id_rencana_kinerja !== id)))
            // setFetchTrigger((prev) => !prev);
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setProses(false);
        })
    };

    if (loading) {
        return <LoadingClock />
    } else if (Error) {
        return <h1 className="text-red-500 py-3 px-5 text-center">Gagal mendapatkan data Rencana Kinerja, periksa koneksi internet atau database server</h1>
    }

    return (
        <>
            <div className="flex items-center justify-between border-b px-5 py-5">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <h1 className="font-bold text-2xl uppercase">Rencana Kinerja</h1>
                        <h1 className="font-bold text-2xl uppercase text-green-500">{branding?.tahun?.label}</h1>
                    </div>
                    <ButtonSkyBorder
                        className="flex items-center justify-center w-full"
                        onClick={() => handleModalRekin("", "baru")}
                    >
                        <TbCirclePlus className="mr-1" />
                        Tambah Rencana kinerja
                    </ButtonSkyBorder>
                </div>
                <div className="flex flex-col items-end">
                    <p>{user?.nama_pegawai || "-"}</p>
                    <p>{user?.nip || "-"}</p>
                    <p>Roles: {user?.roles || "-"}</p>
                </div>
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-700 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Pohon Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Rencana Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Tahun</th>
                            <th className="border-r border-b px-6 py-3 min-w-[400px]">Indikator Rencana Kinerja</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">target / Satuan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Status</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Catatan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            rekin.map((data, index) => (
                                <tr key={data.id_rencana_kinerja}>
                                    <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_pohon ? data.nama_pohon : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_rencana_kinerja ? data.nama_rencana_kinerja : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.tahun ? data.tahun : "-"}</td>
                                    {data.indikator != null ?
                                        <>
                                            {data.indikator.length > 1 ?
                                                <td className="border-r border-b text-center">
                                                    {data.indikator.map((item: indikator, index: number) => (
                                                        <div key={index}>
                                                            {item.nama_indikator ?
                                                                <div className={`flex items-center justify-between gap-2 py-4 px-6 ${index !== data.indikator.length - 1 && 'border-b'}`}>
                                                                    <p className="text-start">{item.nama_indikator}</p>
                                                                    <ButtonGreenBorder
                                                                        halaman_url={`/rencanakinerja/manual_ik/${item.id_indikator}`}
                                                                        className="min-w-[110px]"
                                                                    >
                                                                        Manual IK
                                                                    </ButtonGreenBorder>
                                                                </div>
                                                                :
                                                                "-"
                                                            }
                                                        </div>
                                                    ))}
                                                </td>
                                                :
                                                <td className="border-r border-b text-center">
                                                    {data.indikator.map((item: indikator, index: number) => (
                                                        <div key={index}>
                                                            {item.nama_indikator ?
                                                                <div className={`flex items-center justify-between gap-2 py-4 px-6`}>
                                                                    <p className="text-start">{item.nama_indikator}</p>
                                                                    <ButtonGreenBorder
                                                                        halaman_url={`rencanakinerja/manual_ik/${item.id_indikator}`}
                                                                        className="min-w-[110px]"
                                                                    >
                                                                        Manual IK
                                                                    </ButtonGreenBorder>
                                                                </div>
                                                                :
                                                                "-"
                                                            }
                                                        </div>
                                                    ))}
                                                </td>
                                            }
                                            {data.indikator.length > 1 ?
                                                <td className="border-r border-b text-center">
                                                    {data.indikator.map((item: indikator, index: number) => (
                                                        <React.Fragment key={index}>
                                                            {item.targets ?
                                                                item.targets.map((t: target) => (
                                                                    <p key={t.id_target} className={`${index !== data.indikator.length - 1 && "border-b"} py-4 px-6`}>
                                                                        {t.target ? t.target : "-"} / {t.satuan ? t.satuan : "-"}
                                                                    </p>
                                                                ))
                                                                :
                                                                <p className={`border-b py-4 px-6`}>-</p>
                                                            }
                                                        </React.Fragment>
                                                    ))}
                                                </td>
                                                :
                                                <td className="border-r border-b px-6 py-4 text-center">
                                                    {data.indikator.map((item: indikator, index: number) => (
                                                        <React.Fragment key={index}>
                                                            {item.targets ?
                                                                item.targets.map((t: target) => (
                                                                    <p key={t.id_target}>
                                                                        {t.target ? t.target : "-"} / {t.satuan ? t.satuan : "-"}
                                                                    </p>
                                                                ))
                                                                :
                                                                <p>-</p>
                                                            }
                                                        </React.Fragment>
                                                    ))}
                                                </td>
                                            }
                                        </>
                                        :
                                        <>
                                            <td className="border-r border-b px-6 py-4 text-center">-</td>
                                            <td className="border-r border-b px-6 py-4 text-center">-</td>
                                        </>
                                    }
                                    <td className="border-r border-b px-6 py-4 text-center">{data.status_rencana_kinerja ? data.status_rencana_kinerja : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data.catatan ? data.catatan : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <ButtonSkyBorder
                                                className="w-full"
                                                onClick={() => handleModalRekin(data.id_rencana_kinerja, "lama")}
                                            >
                                                <TbPencil className="mr-1" />
                                                Edit Rekin
                                            </ButtonSkyBorder>
                                            {(user?.roles == 'level_3' || user?.roles == 'level_4') &&
                                                <ButtonGreenBorder
                                                    className="w-full"
                                                    halaman_url={`/rencanakinerja/${data.id_rencana_kinerja}`}

                                                >
                                                    <TbPencilDown className="mr-1" />
                                                    {user?.roles == 'level_4' ?
                                                        "Renaksi"
                                                        :
                                                        "Rincian"
                                                    }
                                                </ButtonGreenBorder>
                                            }
                                            <ButtonRedBorder className="w-full"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Rencana Kinerja yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            hapusRekin(data.id_rencana_kinerja);
                                                        }
                                                    });
                                                }}
                                            >
                                                {Proses ?
                                                    <>
                                                        <LoadingButton />
                                                        Menghapus
                                                    </>
                                                    :
                                                    <>
                                                        <TbTrash className="mr-1" />
                                                        Hapus
                                                    </>
                                                }
                                            </ButtonRedBorder>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <ModalRencanaKinerja
                    id={IdRekin || ""}
                    metode={JenisModal}
                    tahun={String(branding?.tahun?.value) || ""}
                    kode_opd={user?.kode_opd}
                    nip={user?.nip}
                    pegawai_id={user?.pegawai_id}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    isOpen={ModalOpen}
                    onClose={() => handleModalRekin("", "baru")}
                    roles={user?.roles}
                />
            </div>
        </>
    )
}