'use client'

import { ButtonGreen, ButtonRed, ButtonSky } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { LoadingClip } from "@/lib/loading";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import Select from 'react-select';
import { useBrandingContext } from "@/providers/BrandingProvider";
import { TbSearch, TbCirclePlus } from "react-icons/tb";
import { GetResponseGlobal, OptionTypeString } from "@/types";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseFindallPegawai } from "../type";
import { GetResponseMasterOpd } from "../../opd/type";
import { Card, HeaderCard } from "@/components/ui/Card";
import { ModalMasterPegawai } from "./ModalMasterPegawai";

const Table = () => {

    const { branding } = useBrandingContext();

    const [Pegawai, setPegawai] = useState<GetResponseFindallPegawai[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [Opd, setOpd] = useState<OptionTypeString | null>(null);
    const [error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [LoadingOpd, setLoadingOpd] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [DataModal, setDataModal] = useState<GetResponseFindallPegawai | null>(null);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");

    useEffect(() => {
        if (branding?.opd?.value != undefined) {
            try {
                setLoadingOpd(true);
                const opd = {
                    value: branding?.opd?.value,
                    label: branding?.opd?.label,
                }
                setOpd(opd);
            } catch (err) {
                console.log("error parsing opd branding ke opd halaman");
            } finally {
                setLoadingOpd(false);
            }
        }
    }, [branding]);

    useEffect(() => {
        const fetchPegawai = async () => {
            setLoading(true)
            await apiFetch<GetResponseGlobal<GetResponseFindallPegawai[]>>(`${branding?.api_perencanaan}/pegawai/findall?kode_opd=${Opd?.value}`, {
                method: "GET",
            }).then((result) => {
                const data = result.data;
                if (data == null) {
                    setDataNull(true);
                    setPegawai([]);
                } else if (result.code === 401) {
                    setError(true);
                } else {
                    setDataNull(false);
                    setPegawai(data);
                    setError(false);
                }
                setPegawai(data);
            }).catch((err) => {
                setError(true);
                console.error(err)
            }).finally(() => {
                setLoading(false);
            })
        }
        if (Opd?.value != undefined) {
            fetchPegawai();
        }
    }, [Opd, branding]);

    const FilteredData = Pegawai?.filter((item: GetResponseFindallPegawai) => {
        const params = searchQuery.toLowerCase();
        return (
            item.nama_pegawai.toLowerCase().includes(params) ||
            item.nip.toLowerCase().includes(params)
        )
    });

    const handleModal = (jenis: "tambah" | "edit", Data: GetResponseFindallPegawai | null) => {
        if (ModalOpen) {
            setModalOpen(false);
            setJenisModal(jenis);
            setDataModal(Data);
        } else {
            setModalOpen(true);
            setJenisModal(jenis);
            setDataModal(Data);
        }
    }

    const fetchOpd = async () => {
        setIsLoading(true);
        await apiFetch<GetResponseGlobal<GetResponseMasterOpd[]>>(`${branding?.api_perencanaan}/opd/findall`, {
            method: "GET",
        }).then((result) => {
            const opd = result.data.map((item: any) => ({
                value: item.kode_opd,
                label: item.nama_opd,
            }));
            setOpdOption(opd);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setIsLoading(false);
        })
    };

    const hapusPegawai = async (id: any) => {
        await apiFetch(`${branding?.api_perencanaan}/pegawai/delete/${id}`, {
            method: "DELETE",
        }).then((_) => {
            setPegawai(Pegawai.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data pegawai Berhasil Dihapus", "success", 1000);
        }).catch((err) => {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.log(err);
        })
    };

    if (Loading || LoadingOpd) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (!Opd) {
        return (
            <>
                <div className="flex flex-wrap gap-2 items-center uppercase px-3 py-2">
                    <Select
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                                minWidth: '320px',
                                maxWidth: '700px',
                                minHeight: '30px'
                            })
                        }}
                        onChange={(option) => setOpd(option)}
                        options={OpdOption}
                        placeholder="Filter by OPD"
                        isClearable
                        value={Opd}
                        isLoading={IsLoading}
                        isSearchable
                        onMenuOpen={() => {
                            if (OpdOption.length == 0) {
                                fetchOpd();
                            }
                        }}
                    />
                </div>
                <div className="border p-1 mx-3 mb-2 rounded-xl">
                    <h1 className="mx-5 py-5">Pilih Filter OPD</h1>
                </div>
            </>
        )
    }

    return (
        <Card>
            <HeaderCard>
                <div className="flex flex-col items-start">
                    <h1 className="font-bold text-lg uppercase">Master Pegawai</h1>
                    <h1>{Opd?.label}</h1>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <ButtonSky
                        className='flex items-center gap-1 w-full'
                        onClick={() => handleModal("tambah", null)}
                    >
                        <TbCirclePlus />
                        Tambah Pegawai
                    </ButtonSky>
                </div>
            </HeaderCard>
            <div className="flex gap-2 items-center uppercase px-3 py-2 w-full">
                <Select
                    styles={{
                        control: (baseStyles) => ({
                            ...baseStyles,
                            borderRadius: '8px',
                            minWidth: '320px',
                            maxWidth: '700px',
                            minHeight: '30px'
                        })
                    }}
                    onChange={(option) => setOpd(option)}
                    options={OpdOption}
                    placeholder="Filter by OPD"
                    isClearable
                    value={Opd}
                    isLoading={IsLoading}
                    isSearchable
                    onMenuOpen={() => {
                        if (OpdOption.length == 0) {
                            fetchOpd();
                        }
                    }}
                />
                <div className="flex px-2 items-center w-full">
                    <TbSearch className="absolute ml-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Cari nama pegawai / NIP"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-2 pl-10 pr-2 border rounded-lg border-gray-300 w-full"
                    />
                </div>
            </div>
            <div className="overflow-auto mx-3 my-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-sky-700 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">NIP</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Kode OPD</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Perangkat Daerah</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull || FilteredData.length === 0 ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            FilteredData.map((data: GetResponseFindallPegawai, index: number) => (
                                <tr key={data?.id}>
                                    <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data?.nama_pegawai ? data.nama_pegawai : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data?.nip ? data.nip : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data?.kode_opd ? data.kode_opd : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">{data?.nama_opd ? data.nama_opd : "-"}</td>
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col jutify-center items-center gap-2">
                                            <ButtonGreen className="w-full" onClick={() => handleModal("edit", data)}>Edit</ButtonGreen>
                                            <ButtonRed
                                                className="w-full"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus Pegawai yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            hapusPegawai(data.id);
                                                        }
                                                    });
                                                }}
                                            >
                                                Hapus
                                            </ButtonRed>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {ModalOpen &&
                <ModalMasterPegawai 
                    isOpen={ModalOpen}
                    onClose={() => handleModal("tambah", null)}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                    Data={DataModal}
                    jenis={JenisModal}
                    kode_opd={branding?.opd?.value ?? ""}
                />
            }
        </Card>
    )
}

export default Table;