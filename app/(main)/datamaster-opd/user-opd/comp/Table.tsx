'use client'

import { ButtonGreen, ButtonRed, ButtonSkyBorder } from "@/components/ui/button";
import { HeaderCard, Card } from "@/components/ui/Card";
import { TbCirclePlus, TbSearch } from "react-icons/tb";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { LoadingClip } from "@/lib/loading";
import { useState, useEffect } from "react";
import { GetResponseMasterUser } from "@/app/(main)/datamaster/user/type";
import { GetResponseGlobal } from "@/types";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { apiFetch } from "@/hook/apiFetch";
import { ModalMasterUser } from "@/app/(main)/datamaster/user/comp/ModalMasterUser";

const Table = () => {

    const { branding } = useBrandingContext();
    const opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;
    const nama_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.label : branding?.user?.nama_opd;
    const [User, setUser] = useState<GetResponseMasterUser[]>([]);
    const [error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [DataModal, setDataModal] = useState<GetResponseMasterUser | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await apiFetch<GetResponseGlobal<GetResponseMasterUser[]>>(`${branding?.api_perencanaan}/user/findall?kode_opd=${opd}`, {
                method: "GET",
            }).then((result) => {
                const data = result.data;
                if (data == null) {
                    setDataNull(true);
                    setUser([]);
                } else if (result.code == 500) {
                    setError(true);
                    setUser([]);
                } else if (result.code === 401) {
                    setError(true);
                } else {
                    setError(false);
                    setDataNull(false);
                    setUser(data);
                }
                setUser(data);
            }).catch((err) => {
                setError(true);
                console.error(err)
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchData();
    }, [branding, FetchTrigger]);

    const [SearchParams, setSearchParams] = useState<string>("");
    const FilteredData = User?.filter((item: GetResponseMasterUser) => {
        const params = SearchParams.toLowerCase();
        return (
            item.nama_pegawai.toLowerCase().includes(params) ||
            item.nip.toLowerCase().includes(params)
        )
    });

    const handleModal = (jenis: "tambah" | "edit", data: GetResponseMasterUser | null) => {
        if (ModalOpen) {
            setModalOpen(false);
            setJenisModal(jenis);
            setDataModal(data);
        } else {
            setModalOpen(true);
            setJenisModal(jenis);
            setDataModal(data);
        }
    }

    const hapusUser = async (id: any) => {
        await apiFetch(`${branding?.api_perencanaan}/user/delete/${id}`, {
            method: "DELETE",
        }).then(() => {
            setUser(User.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data User Berhasil Dihapus", "success", 1000);
        }).catch((err) => {
            console.error(err);
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
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
    } else if (branding?.user?.roles == 'super_admin') {
        if (opd == undefined || null) {
            return (
                <div className="border p-5 rounded-xl shadow-xl">
                    <h1 className="mx-5 py-5">Super Admin Wajib Pilih OPD di header terlebih dahulu</h1>
                </div>
            )
        }
    }

    return (
        <Card>
            <HeaderCard>
                <div className="flex flex-col items-start">
                    <h1 className="uppercase font-bold">
                        Daftar User OPD
                    </h1>
                    <h1>{nama_opd}</h1>
                </div>
                <ButtonSkyBorder
                    className='flex items-center gap-1'
                    onClick={() => handleModal("tambah", null)}
                >
                    <TbCirclePlus />
                    Tambah User
                </ButtonSkyBorder>
            </HeaderCard>
            <div className="flex pt-2 px-2 items-center w-full">
                <TbSearch className="absolute ml-2 text-slate-500" />
                <input
                    type="text"
                    placeholder="Cari nama pegawai / NIP"
                    value={SearchParams}
                    onChange={(e) => setSearchParams(e.target.value)}
                    className="py-1 pl-7 border rounded-lg w-full"
                />
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
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull || FilteredData?.length === 0 ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Tidak ada User / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            FilteredData.map((data: GetResponseMasterUser, index: number) => (
                                <tr key={data.id}>
                                    <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                    <td className="border-r border-b px-6 py-4">{data.nama_pegawai ? data.nama_pegawai : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.nip ? data.nip : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.email ? data.email : "-"}</td>
                                    <td className="border-r border-b px-6 py-4 text-center">{data.is_active === true ? 'Aktif' : 'tidak aktif'}</td>
                                    {data.role ?
                                        <td className="border-r border-b px-6 py-4 text-center">
                                            {data.role ? data.role.map((r: any) => r.role).join(", ") : "-"}
                                        </td>
                                        :
                                        <td className="border-r border-b px-6 py-4 text-center">-</td>
                                    }
                                    <td className="border-r border-b px-6 py-4">
                                        <div className="flex flex-col jutify-center items-center gap-2">
                                            <ButtonGreen className="w-full" onClick={() => handleModal("edit", data)}>Edit</ButtonGreen>
                                            <ButtonRed
                                                className="w-full"
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "Hapus User yang dipilih?", "question", "Hapus", "Batal").then((result: any) => {
                                                        if (result.isConfirmed) {
                                                            hapusUser(data.id);
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
                {ModalOpen &&
                    <ModalMasterUser
                        isOpen={ModalOpen}
                        onClose={() => handleModal("tambah", null)}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                        Data={DataModal}
                        jenis={JenisModal}
                        kode_opd={opd}
                    />
                }
            </div>
        </Card>
    )
}

export default Table;