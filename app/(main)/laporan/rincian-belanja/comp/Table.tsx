'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/lib/loading";
import { AlertNotification } from "@/lib/alert";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseLaporanRincianBelanja, RincianBelanja, RencanaAksi, IndikatorRencanaKinerja, IndikatorSubKegiatan, Target } from "../type";
import { useBrandingContext } from "@/providers/BrandingProvider";

export const TableLaporan = () => {

    const [Data, setData] = useState<GetResponseLaporanRincianBelanja[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const { branding } = useBrandingContext();
    const opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;

    useEffect(() => {
        const fetchLaporan = async (url: string) => {
            setLoading(true);
            await apiFetch<any>(url, {
                method: "GET",
            }).then((resp) => {
                const data = resp.data;
                if (data == null) {
                    setData([]);
                } else if (resp.code === 401) {
                    setError(true);
                } else {
                    setData(data);
                    setError(false);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        }
        if (branding?.user?.roles != undefined) {
            if (branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'admin_opd' || branding?.user?.roles == 'reviewer') {
                fetchLaporan(`${branding?.api_perencanaan}/rincian_belanja/laporan?kode_opd=${opd}&tahun=${branding?.tahun?.value}`)
            } else {
                fetchLaporan(`${branding?.api_perencanaan}/rincian_belanja/pegawai/${branding?.user?.nip}/${branding?.tahun?.value}`)
            }
        } else {
            setError(true);
        }
    }, [branding]);

    function formatRupiah(angka: number) {
        if (typeof angka !== 'number') {
            return String(angka); // Jika bukan angka, kembalikan sebagai string
        }
        return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
    }

    if (Loading) {
        return (
            <div className="w-full border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="w-full border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else {
        return (
            <div className="overflow-auto m-3 rounded-t-xl border w-full">
                <table className="w-full">
                    <thead className="bg-green-500 text-white">
                        <tr>
                            <th className="border-r border-b border-black px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b border-black px-6 py-3 min-w-[200px]">Pemilik</th>
                            <th className="border-r border-b border-black px-6 py-3 min-w-[300px]">Rencana Kinerja</th>
                            <th className="border-r border-b border-black px-6 py-3 min-w-[300px]">Indikator Kinerja</th>
                            <th className="border-r border-b border-black px-6 py-3 min-w-[100px]">Target/Satuan</th>
                            <th className="border-r border-b border-black px-6 py-3 min-w-[170px]">Anggaran</th>
                        </tr>
                    </thead>
                    {Data.length > 0 ?
                        Data.map((data: GetResponseLaporanRincianBelanja, index: number) => (
                            <tbody key={index}>
                                <tr className="bg-emerald-100 text">
                                    <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                    <td colSpan={2} className="border-r border-b px-6 py-4">Sub Kegiatan: {data.nama_subkegiatan || "-"} ({data.kode_subkegiatan || "tanpa kode"})</td>
                                    {data.indikator_subkegiatan === null ?
                                        <React.Fragment>
                                            <td className="border-r border-b px-6 py-4 text-center">-</td>
                                            <td className="border-r border-b px-6 py-4 text-center">-</td>
                                        </React.Fragment>
                                        :
                                        data.indikator_subkegiatan.map((i: IndikatorSubKegiatan, index_isk: number) => (
                                            <React.Fragment key={index_isk}>
                                                <td className="border-r border-b px-6 py-4">{i.nama_indikator || "-"}</td>
                                                {i.targets.map((t: Target, index_target: number) => (
                                                    <React.Fragment key={index_target}>
                                                        <td className="border-r border-b px-6 py-4 text-center">{t.target || "-"} {t.satuan || "-"}</td>
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))
                                    }
                                    <td className="border-r border-b px-6 py-4">Rp.{formatRupiah(data.total_anggaran)}</td>
                                </tr>
                                {data.rincian_belanja.map((rekin: RincianBelanja, index_rb: number) => (
                                    <React.Fragment key={index_rb}>
                                        <tr>
                                            <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">{index + 1}.{index_rb + 1}</td>
                                            <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">{rekin.nama_pegawai || "-"}</td>
                                            <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">{rekin.rencana_kinerja || "-"}</td>
                                            {/* Kolom indikator pertama */}
                                            {rekin.indikator === null ? (
                                                <React.Fragment>
                                                    <td className="border-r border-b px-6 py-4">-</td>
                                                    <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <td className="border-r border-b px-6 py-4">{rekin.indikator[0].nama_indikator || "-"}</td>
                                                    {rekin.indikator[0].targets.length === 0 || rekin.indikator[0].targets === null ? (
                                                        <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                    ) : (
                                                        rekin.indikator[0].targets.map((t: Target, index_t: number) => (
                                                            <td key={t.id_target || index_t} className="border-r border-b px-6 py-4 text-center">{t.target || "-"} {t.satuan || "-"}</td>
                                                        ))
                                                    )}
                                                </React.Fragment>
                                            )}
                                            <td rowSpan={rekin.indikator ? rekin.indikator.length : 2} className="border-r border-b px-6 py-4">Rp.{formatRupiah(rekin.total_anggaran || 0)}</td>
                                        </tr>
                                        {/* Baris-baris untuk indikator selanjutnya */}
                                        {rekin.indikator ?
                                            rekin.indikator.slice(1).map((i: IndikatorRencanaKinerja, index_i) => (
                                                <tr key={i.id_indikator || index_i}>
                                                    <td className="border-r border-b px-6 py-4">{i.nama_indikator || "-"}</td>
                                                    {i.targets.length === 0 || i.targets === null ? (
                                                        <td className="border-r border-b px-6 py-4 text-center">-</td>
                                                    ) : (
                                                        i.targets.map((t: Target, index_t: number) => (
                                                            <td key={t.id_target || index_t} className="border-r border-b px-6 py-4 text-center">{t.target || "-"} {t.satuan || "-"}</td>
                                                        ))
                                                    )}
                                                </tr>
                                            ))
                                            :
                                            <tr>
                                                <td className="border-r border-b px-6 py-4">-</td>
                                                <td className="border-r border-b px-6 py-4 text-center">-</td>
                                            </tr>
                                        }
                                        {rekin.rencana_aksi === null ?
                                            <tr>
                                                <td colSpan={5} className="border-r border-b px-6 py-4 text-red-500">Renaksi Belum di tambahkan di rencana kinerja</td>
                                                <td className="border-b px-6 py-4">Rp.0</td>
                                            </tr>
                                            :
                                            rekin.rencana_aksi.map((renaksi: RencanaAksi, index_renaksi: number) => (
                                                <tr key={renaksi.renaksi_id || index_renaksi}>
                                                    <td colSpan={5} className="border-r border-b px-6 py-4">Renaksi {index_renaksi + 1}: {renaksi.renaksi}</td>
                                                    <td className="border-b px-6 py-4">Rp.{formatRupiah(renaksi.anggaran || 0)}</td>
                                                </tr>
                                            ))
                                        }
                                    </React.Fragment>
                                ))}
                            </tbody>
                        ))
                        :
                        <tbody>
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        </tbody>
                    }
                </table>
            </div>
        )
    }
}