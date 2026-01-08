'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseFindallMisi, Misi } from "../type";
import { GetResponseGlobal, OptionTypeString } from "@/types";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { apiFetch } from "@/hook/apiFetch";
import { ButtonSkyBorder, ButtonRedBorder } from "@/components/ui/button";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { Card, HeaderCard } from "@/components/ui/Card";
import Select from 'react-select';
import { ModalVisi } from "./ModalMisi";

const Table = () => {

    const [Data, setData] = useState<GetResponseFindallMisi[]>([]);
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [DataModal, setDataModal] = useState<Misi | null>(null);
    const [Periode, setPeriode] = useState<OptionTypeString | null>(null);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const handleModal = (jenis: "tambah" | "edit", data: Misi | null) => {
        if (ModalOpen) {
            setModalOpen(false);
            setDataModal(null);
            setJenisModal("tambah");
        } else {
            setModalOpen(true);
            setDataModal(data);
            setJenisModal(jenis);
        }
    }

    const PeriodeOption = [
        { value: "RPJMD", label: "RPJMD" },
        { value: "RPD", label: "RPD" }
    ]

    useEffect(() => {
        const getMisi = async () => {
            setLoading(true);
            await apiFetch<GetResponseGlobal<GetResponseFindallMisi[]>>(`${branding?.api_perencanaan}/misi_pemda/findall/tahun/${branding?.tahun?.value}/jenisperiode/${Periode?.value}`, {
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
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        getMisi();
    }, [branding, FetchTrigger, Periode]);

    const hapusData = async (id: any) => {
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/misi_pemda/delete/${id}`, {
            method: "DELETE",
        }).then(resp => {
            setData(Data.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Misi Berhasil Dihapus", "success", 2000);
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setProses(false);
        })
    };

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
                <Card>
                    <HeaderCard>
                        <div className="flex flex-wrap items-center gap-5">
                            <h1 className="font-bold text-lg uppercase">Visi {branding?.tahun?.label || "tahun kosong"}</h1>
                            <ButtonSkyBorder
                                className='flex items-center gap-1'
                                onClick={() => handleModal("tambah", null)}
                            >
                                <TbCirclePlus />
                                Tambah Misi
                            </ButtonSkyBorder>
                        </div>
                        <Select
                            styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    minWidth: '157.562px',
                                    minHeight: '38px'
                                })
                            }}
                            isClearable
                            options={PeriodeOption}
                            onChange={(option) => {
                                setPeriode(option);
                            }}
                            placeholder="pilih Jenis Periode"
                            value={Periode}
                            isSearchable
                        />
                    </HeaderCard>
                    {Periode ?
                        <div className="flex flex-wrap m-2">
                            <div className="overflow-auto m-2 rounded-t-xl border border-gray-200 w-full">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-emerald-500 text-white">
                                            <th className="border-r border-b border-gray-200 px-6 py-3 w-[50px] text-center">No</th>
                                            <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">Visi/Misi</th>
                                            <th className="border-r border-b border-gray-200 px-6 py-3 w-[200px]">Periode</th>
                                            <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">Keterangan</th>
                                            <th className="border-l border-b border-gray-200 px-6 py-3 w-[100px]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Data === null ?
                                            <tr>
                                                <td className="px-6 py-3" colSpan={30}>
                                                    Data Kosong / Belum Ditambahkan
                                                    <ButtonSkyBorder
                                                        className='mt-1 flex items-center gap-1'
                                                        onClick={() => handleModal("tambah", null)}
                                                    >
                                                        <TbCirclePlus />
                                                        Tambah Visi
                                                    </ButtonSkyBorder>
                                                </td>
                                            </tr>
                                            :
                                            Data.map((data: GetResponseFindallMisi, index: number) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <tr>
                                                            <td className="border border-emerald-500 px-4 py-4 text-center bg-slate-200 font-semibold">{index + 1}</td>
                                                            <td className="border-x border-b border-emerald-500 px-6 py-4 bg-slate-200 font-semibold" colSpan={30}>Visi : {data.visi || "-"}</td>
                                                        </tr>
                                                        {data.misi_pemda.map((item: Misi) => (
                                                            <React.Fragment key={item.id}>
                                                                <tr>
                                                                    <td className="border border-emerald-500 px-4 py-4 text-center">{index + 1}.{item.urutan}</td>
                                                                    <td className="border-x border-b border-emerald-500 px-6 py-4">{item.misi}</td>
                                                                    <td className="border-x border-b border-emerald-500 px-6 py-4 text-center">{item.tahun_akhir_periode ? `${item.tahun_awal_periode} - ${item.tahun_akhir_periode} (${item.jenis_periode})` : "-"}</td>
                                                                    <td className="border-x border-b border-emerald-500 px-6 py-4">{item.keterangan || "-"}</td>
                                                                    <td className="border-x border-b border-emerald-500 px-6 py-4">
                                                                        <div className="flex flex-col justify-center items-center gap-2">
                                                                            <ButtonSkyBorder
                                                                                className="flex items-center gap-1 w-full"
                                                                                onClick={() => handleModal("edit", item)}
                                                                            >
                                                                                <TbPencil />
                                                                                Edit
                                                                            </ButtonSkyBorder>
                                                                            <ButtonRedBorder className="flex items-center gap-1 w-full" onClick={() => {
                                                                                AlertQuestion("Hapus?", `Hapus Misi "${item.misi || "yang dipilih"}" ?`, "question", "Hapus", "Batal").then((result) => {
                                                                                    if (result.isConfirmed) {
                                                                                        hapusData(item.id);
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
                                                            </React.Fragment>
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        :
                        <h1 className="p-5 m-5 font-bold border rounded-lg">❕ Pilih Jenis Periode terlebih dahulu</h1>
                    }
                </Card>
                {ModalOpen &&
                    <ModalVisi
                        isOpen={ModalOpen}
                        onClose={() => handleModal("tambah", null)}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                        Data={DataModal}
                        jenis={JenisModal}
                    />
                }
            </>
        )
    }
}

export default Table;
