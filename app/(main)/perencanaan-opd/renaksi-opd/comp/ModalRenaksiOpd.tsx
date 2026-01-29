'use client'

import React, { useEffect, useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/ui/button';
import { AlertNotification } from "@/lib/alert";
import { LoadingButton, LoadingClip } from "@/lib/loading";
import Select from 'react-select';
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseGlobal, GetResponseRencanaKinerja, OptionTypeString } from "@/types";
import { RenaksiOpdDetail, IndikatorSasaranOpd, FormValue, RekinOption } from "../type";
import { apiFetch } from "@/hook/apiFetch";

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    id?: number;
    id_rekin: string;
    id_sasaran?: number;
    rekin: string;
    kode_opd: string;
    indikator: IndikatorSasaranOpd[];
    tahun: string;
    onSuccess: () => void;
}

export const ModalRenaksiOpd: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, id, id_sasaran, id_rekin, rekin, kode_opd, indikator, tahun }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit } = useForm<FormValue>();

    const [Catatan, setCatatan] = useState<string>('');
    const [Renaksi, setRenaksi] = useState<OptionTypeString | null>(null);
    const [RenaksiOption, setRenaksiOption] = useState<OptionTypeString[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [LoadingDetail, setLoadingDetail] = useState<boolean>(false);

    const handleClose = () => {
        onClose();
        setRenaksi(null);
        setCatatan('');
    }

    useEffect(() => {
        const fetchDetailRenaksiOpd = async () => {
            setLoadingDetail(true);
            await apiFetch<GetResponseGlobal<RenaksiOpdDetail>>(`${branding?.api_renaksi_opd}/renaksi-opd/detail/${id}`, {
                method: "GET",
            }).then((result) => {
                const hasil = result.data;
                // console.log(hasil);
                if (hasil.keterangan) {
                    setCatatan(hasil.keterangan);
                }
                if (hasil.id_renaksiopd) {
                    const rekin = {
                        value: hasil.rekin_id,
                        label: hasil.nama_rencana_kinerja,
                    }
                    setRenaksi(rekin);
                }
            }).catch((err) => {
                console.log(err);

            }).finally(() => {
                setLoadingDetail(false);
            })
        };
        if (jenis === 'edit') {
            fetchDetailRenaksiOpd();
        }
    }, [id, branding, jenis]);


    const fetchOptionRekin = async () => {
        setIsLoading(true);
        await apiFetch<GetResponseRencanaKinerja<any>>(`${branding?.api_perencanaan}/rencana_kinerja_level3/${kode_opd}/${tahun}`, {
            method: "GET",
        }).then((result) => {
            const data = result.rencana_kinerja;
            if (result.code === 200) {
                const rekin = data.map((s: RekinOption) => ({
                    value: s.id_rencana_kinerja,
                    label: s.nama_rencana_kinerja,
                }));
                setRenaksiOption(rekin);
            }
        }).catch((err) => {
            console.log(err);
            setRenaksiOption([]);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL_RENAKSI_OPD = process.env.NEXT_PUBLIC_API_URL_RENAKSI_OPD;
        const formDataNew = {
            //key : value
            sasaranopd_id: id_sasaran,
            rekin_id: Renaksi?.value,
            tahun: tahun,
            keterangan: Catatan
        };
        const formDataEdit = {
            //key : value
            id: id,
            rekin_id: Renaksi?.value,
            keterangan: Catatan
        };
        const getBody = () => {
            if (jenis === "tambah") return formDataNew;
            if (jenis === "edit") return formDataEdit;
            return {}; // Default jika jenis tidak sesuai
        };
        // jenis === 'tambah' && console.log("tambah :", formDataNew);
        // jenis === 'edit' && console.log("edit :", formDataEdit);
        let url = "";
        if (jenis === "edit") {
            url = `rencana-aksi-opd/update/${id}`;
        } else if (jenis === "tambah") {
            url = `rencana-aksi-opd/create`;
        } else {
            url = '';
        }
        setProses(true);
        await apiFetch(`${branding?.api_renaksi_opd}/${url}`, {
            method: jenis === "edit" ? "PUT" : "POST",
            body: JSON.stringify(getBody()),
        }).then((result: any) => {
            if (result.code === 201 || result.code === 200) {
                AlertNotification("Berhasil", `Berhasil ${jenis === 'tambah' ? "Menambahkan" : "Mengubah"} Renaksi OPD`, "success", 1000);
                onClose();
                onSuccess();
            } else if (result.code === 500) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
                console.error(result);
            }
        }).catch((err) => {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        }).finally(() => {
            setProses(false);
        })
    };

    if (!isOpen) {
        return null;
    } else if (LoadingDetail) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30"></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <LoadingClip />
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="w-max-[500px] py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                            {jenis === "tambah" ? "Tambah" : "Edit"} Rencana Aksi OPD
                        </div>
                        <div className="flex flex-col pt-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_pohon"
                            >
                                Rencana Kinerja OPD
                            </label>
                            <div className="border px-4 py-2 rounded-lg bg-gray-200">{rekin || "-"}</div>
                        </div>
                        {indikator.length != 0 ?
                            indikator.map((i: IndikatorSasaranOpd, index_indikator: number) => (
                                <React.Fragment key={index_indikator}>
                                    <div className="flex flex-col justify-center">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="nama_pohon"
                                        >
                                            indikator ke {index_indikator + 1}
                                        </label>
                                        <div className="border px-4 py-2 rounded-lg bg-gray-200">{i.indikator || "-"}</div>
                                        <div className="flex flex-wrap w-full gap-2 pt-2">
                                            <div className="border px-4 py-2 rounded-lg bg-gray-200">{i.target.target || "-"}</div>
                                            <div className="border px-4 py-2 rounded-lg bg-gray-200">{i.target.satuan || "-"}</div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                            :
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="nama_pohon"
                                >
                                    Indikator
                                </label>
                                <div className="border px-4 py-2 rounded-lg italic">tidak ada indikator</div>
                            </div>
                        }
                        <div className="flex flex-col justify-center pr-2 pb-5">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="id_renaksi"
                            >
                                Rencana Aksi OPD
                            </label>
                            <Controller
                                name="id_renaksi"
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Rencana Aksi OPD"
                                            value={Renaksi}
                                            options={RenaksiOption}
                                            isLoading={IsLoading}
                                            isSearchable
                                            isClearable
                                            // menuShouldBlockScroll={true}
                                            // menuPlacement="top"
                                            menuPortalTarget={document.body} // Render menu ke document.body
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setRenaksi(option);
                                            }}
                                            onMenuOpen={() => {
                                                if (RenaksiOption.length === 0) {
                                                    fetchOptionRekin();
                                                }
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    textAlign: 'start',
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base, zIndex: 9999
                                                })
                                            }}
                                        />
                                    </React.Fragment>
                                )}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="catatan"
                            >
                                Keterangan :
                            </label>
                            <Controller
                                name="catatan"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="catatan"
                                            placeholder="masukkan Catatan"
                                            value={Catatan}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setCatatan(e.target.value);
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full my-3 gap-1" disabled={Proses}>
                            {Proses ?
                                <>
                                    <LoadingButton />
                                    <span>menyimpan</span>
                                </>
                                :
                                <>
                                    <TbDeviceFloppy />
                                    <span>Simpan</span>
                                </>
                            }
                        </ButtonSky>
                        <ButtonRed className="flex items-center gap-1 w-full my-3" onClick={handleClose} disabled={Proses}>
                            <TbX />
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}