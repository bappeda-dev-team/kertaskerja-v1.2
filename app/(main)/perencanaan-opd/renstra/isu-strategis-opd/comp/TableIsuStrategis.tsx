'use client'

import React, { useEffect, useState } from "react";
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder } from "@/components/ui/button";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";
import { AlertNotification, AlertQuestion } from "@/lib/alert";
// import { ModalIsu } from "./ModalIsu";
import { LoadingBeat } from "@/lib/loading";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { IsuStrategis, DataDukung, TargetJumlahData, PermasalahanOpd } from "../type";

interface Table {
    kode_opd: string;
    nama_opd: string;
    tahun: number;
}

const TableIsuStrategis:React.FC<Table> = ({ kode_opd, nama_opd, tahun }) => {

    const { branding } = useBrandingContext();
    const [Isu, setIsu] = useState<IsuStrategis[]>([]);

    const [Modal, setModal] = useState<boolean>(false);
    const [DataEdit, setDataEdit] = useState<IsuStrategis | null>(null);
    const [JenisModal, setJenisModal] = useState<"baru" | "edit" | "">("");

    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const PeriodeBelakang = [
        `${tahun}`,
        `${tahun - 1}`,
        `${tahun - 2}`,
        `${tahun - 3}`,
        `${tahun - 4}`,
        `${tahun - 5}`,
    ]

    const handleModal = (jenis: "baru" | "edit" | "", data: IsuStrategis | null) => {
        if (Modal) {
            setJenisModal('');
            setModal(false);
            setDataEdit(null);
        } else {
            setJenisModal(jenis);
            setModal(true);
            setDataEdit(data);
        }
    }

    useEffect(() => {
        let url = "";
        if (branding?.user?.roles == "super_admin") {
            url = `isu_strategis/kebelakang/${branding?.opd?.value}/${branding?.tahun?.value}`
        } else {
            url = `isu_strategis/kebelakang/${branding?.user?.kode_opd}/${branding?.tahun?.value}`
        }
        const fetchIsuStrategis = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${branding?.api_permasalahan}/${url}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (result.code === 200) {
                    setIsu(result.data);
                    setError(false);
                    // console.log(result.data);
                } else {
                    console.log(result.data);
                    setError(true);
                }
            } catch (err) {
                setError(true);
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchIsuStrategis();

    }, [branding, FetchTrigger]);

    const hapusIsu = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN;
        try {
            const response = await fetch(`${API_URL}/isu_strategis/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (result.code === 200 || result.code == 201) {
                setIsu(Isu.filter((data) => (data.id !== id)))
                AlertNotification("Berhasil", `Berhasil menghapus data isu strategis`, "success");
            } else {
                AlertNotification("Gagal", `${result.data}`, "error");
                console.log(result.data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (Error) {
        return (
            <div className="text-red-500">
                Error data permasalahan, Periksa koneksi internet, jika error berlajut silakan hubungi tim developer
            </div>
        )
    } else if (Loading) {
        return (
            <div className="border rounded-lg m-2">
                <LoadingBeat />
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between my-3 mx-3">
                <p className="text-gray-400 text-sm italic">*data isu strategis berdasarkan {branding?.tahun?.label} kebelakang</p>
                <ButtonGreenBorder
                    className="flex items-center gap-1"
                    onClick={() => handleModal("baru", null)}
                >
                    <TbCirclePlus />
                    Tambah Isu Strategis
                </ButtonGreenBorder>
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-3 py-3 w-[50px]">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]">Bidang Urusan</th>
                            <th rowSpan={2} colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Isu Strategis</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]">Permasalahan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]">Nama Data Dukung</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]">Narasi Data Dukung</th>
                            {PeriodeBelakang
                                .slice()
                                .reverse()
                                .map((item: any) => (
                                    <th key={item} colSpan={2} className={`border-r border-b px-6 py-3 ${item === String(tahun) ? "bg-yellow-600" : "bg-emerald-500"}`}>{item}</th>
                                ))}
                        </tr>
                        <tr className={`text-white`}>
                            {PeriodeBelakang.slice().reverse().map((item: any) => (
                                <React.Fragment key={item}>
                                    <th className={`${item === String(tahun) ? "bg-yellow-700" : "bg-emerald-600"} border-r border-b px-6 py-1 min-w-[50px]`}>Jumlah</th>
                                    <th className={`${item === String(tahun) ? "bg-yellow-700" : "bg-emerald-600"} border-r border-b px-6 py-1 min-w-[50px]`}>Satuan</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Isu.length === 0 ?
                            <tr>
                                <td colSpan={19} className="border-x border-b border-emerald-500 py-4 px-5">
                                    Data Isu Strategis Kosong
                                </td>
                            </tr>
                            :
                            Isu.map((i: IsuStrategis, index: number) => {

                                const TotalRow = i.permasalahan_opd?.reduce((total, item) => total + (item.data_dukung.length == 0 ? 1 : item.data_dukung.length), 0) + i.permasalahan_opd?.length + 1;

                                return (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td rowSpan={i.permasalahan_opd ? TotalRow : 2} className="border-x border-b border-emerald-500 py-4 px-3 text-center">{index + 1}</td>
                                            <td rowSpan={i.permasalahan_opd ? TotalRow : 2} className="border-r border-b border-emerald-500 px-6 py-4">{i.kode_bidang_urusan || "no code"} - {i.nama_bidang_urusan || "-"}</td>
                                            <td rowSpan={i.permasalahan_opd ? TotalRow : 2} className="border-r border-b border-emerald-500 px-6 py-4">{i.isu_strategis || "-"}</td>
                                            <td rowSpan={i.permasalahan_opd ? TotalRow : 2} className="border-r border-b border-emerald-500 px-6 py-4">
                                                <div className="flex flex-col jutify-center items-center gap-2">
                                                    <ButtonSkyBorder
                                                        className="flex items-center gap-1 w-full"
                                                        onClick={() => handleModal("edit", i)}
                                                    >
                                                        <TbPencil />
                                                        Edit
                                                    </ButtonSkyBorder>
                                                    <ButtonRedBorder
                                                        className="flex items-center gap-1 w-full"
                                                        onClick={() => {
                                                            AlertQuestion("Hapus?", "Data Isu Strategis akan di hapus?", "question", "Hapus", "Batal").then((result) => {
                                                                if (result.isConfirmed) {
                                                                    hapusIsu(i.id);
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
                                        {!i.permasalahan_opd || i.permasalahan_opd.length === 0 ?
                                            <tr>
                                                <td colSpan={15} className="border-r border-b border-emerald-500 px-6 py-4 bg-red-400 text-white italic">Permasalahan belum di tambahkan</td>
                                            </tr>
                                            :
                                            i.permasalahan_opd.map((p: PermasalahanOpd, sub_index: number) => (
                                                <React.Fragment key={sub_index}>
                                                    <tr>
                                                        <td rowSpan={p.data_dukung ? p.data_dukung.length + 1 : 2} className="border-r border-b border-emerald-500 px-6 py-4">{p.masalah || "-"}</td>
                                                    </tr>
                                                    {(p.data_dukung.length === 0 || !p.data_dukung) ?
                                                        <tr>
                                                            <td colSpan={14} className="border-r border-b border-emerald-500 px-6 py-4 text-red-400 italic">Data Dukung belum di tambahkan</td>
                                                        </tr>
                                                        :
                                                        p.data_dukung.map((dd: DataDukung, dd_index) => (
                                                            <tr key={dd_index}>
                                                                <td className="border-r border-b border-emerald-500 px-6 py-4">{dd.data_dukung || "-"}</td>
                                                                <td className="border-r border-b border-emerald-500 px-6 py-4">{dd.narasi_data_dukung || "-"}</td>
                                                                {dd.jumlah_data.length === 0 ?
                                                                    PeriodeBelakang.map((tl: any, tl_index: number) => (
                                                                        <React.Fragment key={tl_index}>
                                                                            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">-</td>
                                                                            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">-</td>
                                                                        </React.Fragment>
                                                                    ))
                                                                    :
                                                                    dd.jumlah_data.slice().reverse().map((d: TargetJumlahData, d_index: number) => (
                                                                        <React.Fragment key={d_index}>
                                                                            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">{d.jumlah_data || "-"}</td>
                                                                            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">{d.satuan || "-"}</td>
                                                                        </React.Fragment>
                                                                    ))
                                                                }
                                                            </tr>
                                                        ))
                                                    }
                                                </React.Fragment>
                                            ))
                                        }
                                    </React.Fragment>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            {/* {(Modal && PeriodeBelakang)&&
                <ModalIsu
                    isOpen={Modal}
                    onClose={() => handleModal("", null)}
                    metode={JenisModal}
                    tahun_list={PeriodeBelakang}
                    Data={DataEdit ? DataEdit : null}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            } */}
        </>
    )
}

export default TableIsuStrategis;