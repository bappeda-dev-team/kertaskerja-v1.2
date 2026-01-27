'use client'

import { useBrandingContext } from "@/providers/BrandingProvider";
import React, { useState, useEffect } from "react";
import { TbPencil } from "react-icons/tb";
import { LoadingClip } from "@/lib/loading";
import { ButtonSkyBorder, ButtonGreenBorder } from "@/components/ui/button";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal } from "@/types";
import { TableTotalPagu } from "./TableTotalPagu";
import { GetResponseFindallMatrixRenstra, Renstra, Indikator, Target } from "../type";
import { ModalMatrixRenstra } from "./ModalMatrixRenstra";
import { formatRupiah } from "@/lib/FormatRupiah";

interface table {
    jenis: "laporan" | "opd";
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string[];
    kode_opd: string;
}
export const TableMatrixRenstra: React.FC<table> = ({ jenis, tahun_awal, tahun_akhir, tahun_list, kode_opd }) => {

    const { branding } = useBrandingContext();
    const [Matrix, setMatrix] = useState<GetResponseFindallMatrixRenstra[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [DataNull, setDataNull] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        const fetchMatrix = async () => {
            setLoading(true);
            await apiFetch<GetResponseGlobal<GetResponseFindallMatrixRenstra[]>>(`${branding?.api_perencanaan}/matrix_renstra/opd/${kode_opd}?tahun_awal=${tahun_awal}&tahun_akhir=${tahun_akhir}`, {
                method: "GET"
            }).then((result) => {
                const data = result.data;
                // console.log(data);
                if (result.code === 400) {
                    setDataNull(true);
                    setMatrix([]);
                    console.log(data);
                } else if (result.code === 200) {
                    setDataNull(false);
                    setMatrix(data);
                }
            }).catch((err) => {
                console.error(err);
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchMatrix();
    }, [kode_opd, tahun_awal, tahun_akhir, branding, FetchTrigger]);

    if (DataNull) {
        return (
            <h1 className="p-5 text-red-500 font-semibold">Sub Kegiatan OPD belum di pilih pada periode tahun {tahun_awal} sampai {tahun_akhir}</h1>
        )
    } else if (Loading) {
        return (
            <>
                <LoadingClip />
            </>
        )
    } else {
        return (
            <>
                {Matrix.map((item: GetResponseFindallMatrixRenstra, index: number) => (
                    <React.Fragment key={index}>
                        <div className="overflow-auto m-2 rounded-xl border">
                            <TableTotalPagu
                                tahun_list={tahun_list}
                                pagu_total={item.pagu_total}
                            />
                        </div>
                        <div className="overflow-auto m-2 rounded-t-xl border">
                            {item.urusan.length === 0 ?
                                <h1 className="p-5">Sub Kegiatan di periode {tahun_awal} - {tahun_akhir} belum di gunakan di rencana kinerja</h1>
                                :
                                <table className="w-full">
                                    {item.urusan.map((u: Renstra, u_index: number) => (
                                        <React.Fragment key={u_index}>
                                            <TheadMatrix
                                                tahun_list={tahun_list}
                                                jenis="Urusan"
                                                type={jenis}
                                            />
                                            <tbody>
                                                <TrMatrix
                                                    jenis="Urusan"
                                                    type={jenis}
                                                    indikator={u.indikator}
                                                    kode={u.kode}
                                                    nama={u.nama}
                                                    kode_opd={item.kode_opd}
                                                    fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                />
                                            </tbody>
                                            {u.bidang_urusan &&
                                                <React.Fragment>
                                                    {u.bidang_urusan.map((br: Renstra, br_index: number) => (
                                                        <React.Fragment key={br_index}>
                                                            <TheadMatrix
                                                                tahun_list={tahun_list}
                                                                jenis="Bidang Urusan"
                                                                type={jenis}
                                                            />
                                                            <tbody>
                                                                <TrMatrix
                                                                    jenis="Bidang Urusan"
                                                                    type={jenis}
                                                                    indikator={br.indikator}
                                                                    kode={br.kode}
                                                                    nama={br.nama}
                                                                    kode_opd={kode_opd}
                                                                    fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                />
                                                            </tbody>
                                                            {br.program &&
                                                                <React.Fragment>
                                                                    {br.program.map((p: Renstra, p_index: number) => (
                                                                        <React.Fragment key={p_index}>
                                                                            <TheadMatrix
                                                                                tahun_list={tahun_list}
                                                                                jenis="Program"
                                                                                type={jenis}
                                                                            />
                                                                            <tbody>
                                                                                <TrMatrix
                                                                                    jenis="Program"
                                                                                    type={jenis}
                                                                                    indikator={p.indikator}
                                                                                    kode={p.kode}
                                                                                    nama={p.nama}
                                                                                    kode_opd={kode_opd}
                                                                                    fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                                />
                                                                            </tbody>
                                                                            {p.kegiatan &&
                                                                                <React.Fragment>
                                                                                    {p.kegiatan.map((k: Renstra, k_index: number) => (
                                                                                        <React.Fragment key={k_index}>
                                                                                            <TheadMatrix
                                                                                                tahun_list={tahun_list}
                                                                                                jenis="Kegiatan"
                                                                                                type={jenis}
                                                                                            />
                                                                                            <tbody>
                                                                                                <TrMatrix
                                                                                                    jenis="Kegiatan"
                                                                                                    type={jenis}
                                                                                                    indikator={k.indikator}
                                                                                                    kode={k.kode}
                                                                                                    nama={k.nama}
                                                                                                    kode_opd={kode_opd}
                                                                                                    fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                                                />
                                                                                            </tbody>
                                                                                            {k.subkegiatan &&
                                                                                                <React.Fragment>
                                                                                                    <TheadMatrix
                                                                                                        tahun_list={tahun_list}
                                                                                                        jenis="Sub Kegiatan"
                                                                                                        type={jenis}
                                                                                                    />
                                                                                                    {k.subkegiatan.map((sk: Renstra, sk_index: number) => (
                                                                                                        <React.Fragment key={sk_index}>
                                                                                                            <tbody>
                                                                                                                <TrMatrix
                                                                                                                    jenis="Sub Kegiatan"
                                                                                                                    type={jenis}
                                                                                                                    indikator={sk.indikator}
                                                                                                                    kode={sk.kode}
                                                                                                                    nama={sk.nama}
                                                                                                                    kode_opd={kode_opd}
                                                                                                                    fetchTrigger={() => setFetchTrigger((prev) => !prev)}
                                                                                                                />
                                                                                                            </tbody>
                                                                                                        </React.Fragment>
                                                                                                    ))}
                                                                                                </React.Fragment>
                                                                                            }
                                                                                        </React.Fragment>
                                                                                    ))}
                                                                                </React.Fragment>
                                                                            }
                                                                        </React.Fragment>
                                                                    ))}
                                                                </React.Fragment>
                                                            }
                                                        </React.Fragment>
                                                    ))}
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    ))}
                                </table>
                            }
                        </div>
                    </React.Fragment>
                ))}
            </>
        )
    }

}

interface Thead {
    jenis: "Urusan" | "Bidang Urusan" | "Program" | "Kegiatan" | "Sub Kegiatan";
    tahun_list: string[];
    type: "laporan" | "opd";
}
export const TheadMatrix: React.FC<Thead> = ({ jenis, type, tahun_list }) => {
    return (
        <thead>
            <tr className={` 
                ${jenis === "Urusan" && "bg-white text-black"}
                ${jenis === "Bidang Urusan" && "bg-red-500 text-white"}
                ${jenis === "Program" && "bg-blue-500 text-white"}
                ${jenis === "Kegiatan" && "bg-green-700 text-white"}
                ${jenis === "Sub Kegiatan" && "bg-emerald-500 text-white"}
            `}>
                <td rowSpan={2} className="border-r border-b px-6 py-4 w-[200px]">Kode</td>
                <td rowSpan={2} className="border-r border-b px-6 py-4 min-w-[200px]">{jenis}</td>
                {tahun_list.map((item: any) => (
                    <td key={item} colSpan={type === "opd" ? 5 : 4} className="border-r border-b px-6 py-3 min-w-[100px] text-center">{item}</td>
                ))}

            </tr>
            <tr className={`
                ${jenis === "Urusan" && "bg-white text-black"}
                ${jenis === "Bidang Urusan" && "bg-red-500 text-white"}
                ${jenis === "Program" && "bg-blue-500 text-white"}
                ${jenis === "Kegiatan" && "bg-green-700 text-white"}
                ${jenis === "Sub Kegiatan" && "bg-emerald-500 text-white"}
            `}>
                {(jenis === 'Urusan' || jenis === 'Bidang Urusan') ?
                    tahun_list.map((item: string) => (
                        <React.Fragment key={item}>
                            <td colSpan={type === "opd" ? 5 : 4} className="border-l border-b px-6 py-3 min-w-[200px] text-center">Pagu</td>
                        </React.Fragment>
                    ))
                    :
                    tahun_list.map((item: string) => (
                        <React.Fragment key={item}>
                            <td className="border-l border-b px-6 py-3 min-w-[300px] text-center">indikator</td>
                            <td className="border-l border-b px-6 py-3 min-w-[50px]">Target</td>
                            <td className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</td>
                            <td className="border-l border-b px-6 py-3 min-w-[200px] text-center">Pagu</td>
                            {type === "opd" &&
                                <td className="border-l border-b px-6 py-3 min-w-[50px] text-center">Aksi</td>
                            }
                        </React.Fragment>
                    ))
                }
            </tr>
        </thead>
    )
}

interface Tr {
    indikator: any[];
    nama: string;
    kode: string;
    kode_opd: string;
    jenis: "Urusan" | "Bidang Urusan" | "Program" | "Kegiatan" | "Sub Kegiatan";
    type: "laporan" | "opd";
    fetchTrigger: () => void;
}
export const TrMatrix: React.FC<Tr> = ({ jenis, type, kode_opd, kode, nama, indikator, fetchTrigger }) => {

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"tambah" | "edit">("tambah");
    const [TahunN, setTahunN] = useState<string>('');
    const [IdIndikator, setIdIndikator] = useState<string>('');

    const handleModal = (jenis: 'tambah' | "edit", id: string, tahun: string) => {
        if (ModalOpen) {
            setModalOpen(false);
            setTahunN('');
            setIdIndikator('');
            setJenisModal(jenis);
        } else {
            setTahunN(tahun);
            setModalOpen(true);
            setIdIndikator(id);
            setJenisModal(jenis);
        }
    }

    return (
        // terdapat error hidrasi disini
        <>
            {(jenis === 'Urusan' || jenis === 'Bidang Urusan') ?
                <tr>
                    <td className={`border-r border-b px-6 py-4 font-semibold`}>{kode}</td>
                    <td className={`border-r border-b px-6 py-4 w-full`}>{nama}</td>
                    {indikator.map((i: Indikator, index: number) => (
                        <React.Fragment key={i.id || index}>
                            <td className={`border-b px-6 py-4 w-full text-center`}></td>
                            <td className={`border-b px-6 py-4 w-full text-center`}></td>
                            <td className={`border-r border-b px-6 py-4 w-full text-center`}></td>
                            <td className={`border-b px-6 py-4 w-full`}>Rp.{formatRupiah(i.pagu_anggaran)}</td>
                            {type === "opd" &&
                                <td className={`border-r border-b px-6 py-4 w-full`}></td>
                            }
                        </React.Fragment>
                    ))}
                </tr>
                :
                <tr>
                    <td className={`border-r border-b px-6 py-4 font-semibold`}>{kode}</td>
                    <td className={`border-r border-b px-6 py-4 w-full`}>{nama}</td>
                    {indikator.map((i: Indikator, index: number) => (
                        <React.Fragment key={i.id || index}>
                            <td className={`border-r border-b px-6 py-4 w-full`}>{i.indikator || "-"}</td>
                            {i.target.map((t: Target, sub_index: number) => (
                                <React.Fragment key={sub_index}>
                                    <td className={`border-r border-b px-6 py-4 w-full text-center`}>{t.target || "-"}</td>
                                    <td className={`border-r border-b px-6 py-4 w-full text-center`}>{t.satuan || "-"}</td>
                                </React.Fragment>
                            ))}
                            <td className={`border-r border-b px-6 py-4 w-full`}>Rp.{formatRupiah(i.pagu_anggaran)}</td>
                            {type === "opd" &&
                                <td className={`border-r border-b px-6 py-4 w-full`}>
                                    {i.id !== "" ?
                                        <ButtonGreenBorder
                                            className="flex items-center gap-1"
                                            onClick={() => handleModal("edit", i.id, i.tahun)}
                                        >
                                            <TbPencil />
                                            Edit
                                        </ButtonGreenBorder>
                                        :
                                        <ButtonSkyBorder
                                            className="flex items-center gap-1"
                                            onClick={() => handleModal("tambah", "", i.tahun)}
                                        >
                                            <TbPencil />
                                            Edit
                                        </ButtonSkyBorder>
                                    }
                                </td>
                            }
                        </React.Fragment>
                    ))}
                </tr>
            }
            {ModalOpen &&
                <ModalMatrixRenstra
                    id={IdIndikator}
                    isOpen={ModalOpen}
                    onClose={() => handleModal('tambah', "", "")}
                    metode={JenisModal}
                    nama={nama}
                    jenis={jenis}
                    pagu={jenis === 'Sub Kegiatan' ? 'pagu' : 'non-pagu'}
                    kode={kode}
                    kode_opd={kode_opd}
                    tahun={TahunN}
                    onSuccess={fetchTrigger}
                />
            }
        </>
    )
}