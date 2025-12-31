'use client'

import Link from "next/link";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { LoadingClip } from "@/lib/loading";
import { ButtonGreen, ButtonRed, ButtonBlack, ButtonSky } from "@/components/ui/button";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { useState, useEffect } from "react";
import Select from 'react-select';
import { TbUsers, TbCirclePlus, TbTrash, TbPencil } from "react-icons/tb";
import { apiFetch } from "@/hook/apiFetch";
import { Card, HeaderCard } from "@/components/ui/Card";
import { OptionTypeString } from "@/types";
import { GetResponseMasterUser, Role } from "../type";
import { ModalMasterUser } from "./ModalMasterUser";

const Table = () => {

    const [User, setUser] = useState<GetResponseMasterUser[]>([]);
    const [Opd, setOpd] = useState<OptionTypeString | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean | null>(null);

    const [Data, setData] = useState<GetResponseMasterUser[]>([]);
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [DataModal, setDataModal] = useState<GetResponseMasterUser | null>(null);

    const { branding } = useBrandingContext();

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            await apiFetch<any>(`${branding?.api_perencanaan}/user/findall?kode_opd=${Opd?.value}`, {
                method: "GET",
            }).then((resp) => {
                const data = resp.data;
                if (resp.code === 200) {
                    setUser(data);
                } else {
                    setUser([]);
                    setError(true);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        if (Opd?.value != undefined) {
            getData();
        }
    }, [Opd, branding]);

    const fetchOpd = async () => {
        setIsLoading(true);
        await apiFetch<any>(`${branding?.api_perencanaan}/opd/findall`, {
            method: "GET",
        }).then((resp) => {
            const data = resp.data;
            if (resp.code === 200) {
                const opd = data.map((item: any) => ({
                    value: item.kode_opd,
                    label: item.nama_opd,
                }));
                setOpdOption(opd);
            } else {
                setOpdOption([]);
                setError(true);
            }
        }).catch(err => {
            AlertNotification("Gagal mengambil data opd", `${err}`, "error", 3000, true);
            setError(true);
        }).finally(() => {
            setIsLoading(false);
        })

    };

    const handleModal = (jenis: "tambah" | "edit", data: GetResponseMasterUser | null) => {
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

    const hapusData = async (id: any) => {
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/user/delete/${id}`, {
            method: "DELETE",
        }).then(resp => {
            setData(Data.filter((data) => (data.id !== id)))
            // setFetchTrigger((prev) => !prev);
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setProses(false);
        })
    };


    if (Loading) {
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
            <Card>
                <HeaderCard>
                    <h1 className="font-bold text-lg uppercase">Master User</h1>
                </HeaderCard>
                <div className="flex flex-wrap gap-2 items-center justify-between px-3 py-2">
                    <div className="uppercase">
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
                    <Link href="/datamaster/user/user-admin-opd">
                        <ButtonBlack className="flex items-center gap-1">
                            <TbUsers />
                            Daftar Admin OPD
                        </ButtonBlack>
                    </Link>
                </div>
                <div className="border p-1 rounded-xl mx-3 mb-2">
                    <h1 className="mx-5 py-5">Pilih Filter OPD</h1>
                </div>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <HeaderCard>
                    <h1 className="font-bold text-lg uppercase">Master User</h1>
                    <ButtonSky
                        className='flex items-center gap-1'
                        onClick={() => handleModal("tambah", null)}
                    >
                        <TbCirclePlus />
                        Tambah User
                    </ButtonSky>
                </HeaderCard>
                <div className="flex flex-wrap gap-2 items-center justify-between px-3 py-2">
                    <div className="uppercase">
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
                    <Link href="/datamaster/user/user-admin-opd">
                        <ButtonBlack className="flex items-center gap-1">
                            <TbUsers />
                            Daftar Admin OPD
                        </ButtonBlack>
                    </Link>
                </div>
                <div className="overflow-auto m-2 rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-emerald-500 text-white">
                                <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                                <th className="border-r border-b px-6 py-3 min-w-[300px]">Nama</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">NIP</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Email</th>
                                <th className="border-r border-b px-6 py-3 min-w-[100px]">Status</th>
                                <th className="border-r border-b px-6 py-3 min-w-[100px]">Roles</th>
                                <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DataNull ?
                                <tr>
                                    <td className="px-6 py-3 uppercase" colSpan={13}>
                                        Tidak ada User / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                User.map((data: GetResponseMasterUser, index) => (
                                    <tr key={data.id}>
                                        <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                        <td className="border-r border-b px-6 py-4">{data.nama_pegawai ? data.nama_pegawai : "-"}</td>
                                        <td className="border-r border-b px-6 py-4 text-center">{data.nip ? data.nip : "-"}</td>
                                        <td className="border-r border-b px-6 py-4 text-center">{data.email ? data.email : "-"}</td>
                                        <td className="border-r border-b px-6 py-4 text-center">{data.is_active === true ? 'Aktif' : 'tidak aktif'}</td>
                                        <td className="border-r border-b px-6 py-4 text-center">
                                            {data.role ? data.role.map((r: any) => r.role).join(", ") : "-"}
                                        </td>
                                        <td className="border-l border-b px-6 py-4">
                                            <div className="flex flex-col jutify-center items-center gap-2">
                                                <ButtonGreen
                                                    className="w-full flex items-center gap-1"
                                                    onClick={() => handleModal("edit", data)}
                                                >
                                                    <TbPencil />
                                                    Edit
                                                </ButtonGreen>
                                                <ButtonRed
                                                    className="w-full flex items-center gap-1"
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Hapus urusan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                hapusData(data.id);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <TbTrash />
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
                    <ModalMasterUser
                        isOpen={ModalOpen}
                        onClose={() => handleModal("tambah", null)}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                        Data={DataModal}
                        jenis={JenisModal}
                        kode_opd={Opd.value}
                    />
                }
            </Card>
        </>
    )
}

export default Table;