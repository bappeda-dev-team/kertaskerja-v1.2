'use client'

import { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { FiHome } from "react-icons/fi";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseFindallJabatan } from "../type";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { ButtonSkyBorder, ButtonRedBorder } from "@/components/ui/button";
import { TbPencil, TbTrash, TbCirclePlus } from "react-icons/tb";
import { ModalMasterJabatan } from "./ModalMasterJabatan";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal } from "@/types";

interface Table {
    nama_opd: string;
    kode_opd: string;
    tahun: number;
}

const Table: React.FC<Table> = ({ nama_opd, kode_opd, tahun }) => {

    const [Data, setData] = useState<GetResponseFindallJabatan[]>([]);
    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [DataModal, setDataModal] = useState<GetResponseFindallJabatan | null>(null);

    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const [Error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const handleModal = (jenis: "tambah" | "edit", data: GetResponseFindallJabatan | null) => {
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

    useEffect(() => {
        const fetchJabatan = async () => {
            setLoading(true);
            await apiFetch<GetResponseGlobal<GetResponseFindallJabatan[]>>(`${branding?.api_perencanaan}/jabatan/findall/${kode_opd}`, {
                method: "GET",
            }).then((result) => {
                const data = result.data;
                if (result.code === 200) {
                    if (data === null) {
                        setData([]);
                    } else {
                        setData(data);
                    }
                } else {
                    setData([]);
                    setError(true);
                }
            }).catch((err) => {
                setError(true);
                console.error(err)
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchJabatan();
    }, [kode_opd, branding, FetchTrigger]);

    const handleSuccess = (result: GetResponseFindallJabatan, jenis: "tambah" | "edit") => {
        if (jenis === "tambah") {
            setData(prev => [...prev, result]);
        } else {
            setData(prev => prev.map(item => item.id === result.id ? result : item));
        }
    }

    const hapusJabatan = async (id: any) => {
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/jabatan/delete/${id}`, {
            method: "DELETE",
        }).then((result: any) => {
            if (result.data === 200) {
                setData(Data.filter((data) => (data.id !== id)))
                AlertNotification("Berhasil", "Data jabatan Berhasil Dihapus", "success", 1000);
            } else {
                alert("gagal menghapus data");
            }
        }).catch((err) => {
            console.error(err);
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
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
    } else if (branding?.user?.roles == 'super_admin') {
        if (branding?.opd?.value == undefined || null) {
            return (
                <div className="border p-5 rounded-xl shadow-xl">
                    <h1 className="mx-5 py-5">Super Admin Wajib Pilih OPD di header terlebih dahulu</h1>
                </div>
            )
        }
    }
    return (
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master OPD</p>
                <p className="mr-1">/ Master Jabatan OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">
                    <h1 className="uppercase font-bold">Daftar Jabatan di {nama_opd || ""}</h1>
                    <ButtonSkyBorder
                        className='flex items-center gap-1'
                        onClick={() => handleModal("tambah", null)}
                    >
                        <TbCirclePlus />
                        Tambah Jabatan
                    </ButtonSkyBorder>
                </div>
                <div className="flex flex-wrap m-2">
                    <div className="overflow-auto m-2 rounded-t-xl border border-gray-200 w-full">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-orange-500 text-white">
                                    <th className="border-r border-b border-gray-200 px-6 py-3 w-[50px] text-center">No</th>
                                    <th className="border-r border-b border-gray-200 px-6 py-3 min-w-[200px]">Nama Jabatan</th>
                                    <th className="border-r border-b border-gray-200 px-6 py-3 w-[200px]">Kode Jabatan</th>
                                    <th className="border-r border-b border-gray-200 px-6 py-3 w-[150px]">Perangkat Daerah</th>
                                    <th className="border-l border-b border-gray-200 px-6 py-3 w-[100px]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Data.length > 0 ?
                                    Data.map((item: GetResponseFindallJabatan, index: number) => (
                                        <tr key={index}>
                                            <td className="border-x border-b border-orange-500 py-4 px-3 text-center">{index + 1}</td>
                                            <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.nama_jabatan || "-"}</td>
                                            <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.kode_jabatan || "-"}</td>
                                            <td className="border-r border-b border-orange-500 px-6 py-4 text-center">{item.operasional_daerah.kode_opd || "-"}</td>
                                            <td className="border-r border-b border-orange-500 px-6 py-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <ButtonSkyBorder
                                                        disabled={Proses}
                                                        className="w-full flex items-center gap-1"
                                                        onClick={() => handleModal("edit", item)}
                                                    >
                                                        <TbPencil />
                                                        Edit
                                                    </ButtonSkyBorder>
                                                    <ButtonRedBorder
                                                        disabled={Proses}
                                                        className="w-full flex items-center gap-1"
                                                        onClick={() => {
                                                            AlertQuestion("Hapus?", "Hapus Jabatan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                if (result.isConfirmed) {
                                                                    hapusJabatan(item.id);
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        <TbTrash />
                                                        Delete
                                                    </ButtonRedBorder>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td className="px-6 py-3" colSpan={30}>
                                            Data Kosong / Belum Ditambahkan
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {ModalOpen &&
                <ModalMasterJabatan
                    isOpen={ModalOpen}
                    onClose={() => handleModal("tambah", null)}
                    onSuccess={handleSuccess}
                    Data={DataModal}
                    jenis={JenisModal}
                    nama_opd={nama_opd}
                    kode_opd={kode_opd}
                />
            }
        </>
    )

}

export default Table;
