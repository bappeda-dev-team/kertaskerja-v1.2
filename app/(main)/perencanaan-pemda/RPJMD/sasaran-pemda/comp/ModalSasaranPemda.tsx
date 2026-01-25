'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/ui/button';
import { LoadingButton, LoadingSync, LoadingClip } from "@/lib/loading";
import Select from 'react-select';
import { AlertNotification, AlertQuestion } from "@/lib/alert";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { FormValue } from "../type";
import { OptionType } from "@/types";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal } from "@/types";
import { TujuanPemda } from "../../tujuan-pemda/type";
import { TbTrash, TbDeviceFloppy, TbX } from "react-icons/tb";

interface indikator {
    id_indikator?: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: target[];
}
type target = {
    target: string;
    satuan: string;
    tahun?: string;
};

interface modal {
    isOpen: boolean;
    onClose: () => void;
    jenis: 'edit' | 'tambah';
    id?: number;
    tahun: number;
    tahun_list: string[];
    periode: number;
    jenis_periode: string;
    jenis_pohon: string;
    subtema_id: number;
    nama_pohon: string;
    onSuccess: () => void;
}

export const ModalSasaranPemda: React.FC<modal> = ({ isOpen, onClose, id, tahun, tahun_list, periode, jenis_periode, subtema_id, nama_pohon, jenis_pohon, jenis, onSuccess }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>();

    const [SasaranPemda, setSasaranPemda] = useState<string>('');
    const [TujuanPemda, setTujuanPemda] = useState<OptionType | null>(null);
    const [OptionTujuanPemda, setOptionTujuanPemda] = useState<OptionType[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [LoadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [IdNotFound, setIdNotFound] = useState<boolean>(false);
    const [TujuanNotFound, setTujuanNotFound] = useState<boolean>(false);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const defaultTarget = Array(6).fill({ target: '', satuan: '' });
    const handleTambahIndikator = () => {
        append({ indikator: '', rumus_perhitungan: '', sumber_data: '', target: defaultTarget });
    };

    useEffect(() => {
        const fetchDetailasaranPemda = async () => {
            setLoadingDetail(true);
            await apiFetch(`${branding?.api_perencanaan}/sasaran_pemda/detail/${id}`, {
            }).then((resp: any) => {
                if (resp.code === 200 || resp.code === 201) {
                    setIdNotFound(false);
                    setTujuanNotFound(false);
                    const hasil = resp.data;
                    if (hasil.sasaran_pemda) {
                        setSasaranPemda(hasil.sasaran_pemda);
                    }
                    if (hasil.tujuan_pemda) {
                        const tujuanpemda = {
                            value: hasil.tujuan_pemda_id,
                            label: hasil.tujuan_pemda,
                        }
                        setTujuanPemda(tujuanpemda);
                    }
                    // Mapping data ke form dengan struktur yang sesuai
                    const indikatorData = hasil.indikator?.map((item: any) => ({
                        id: item.id, // Sesuai dengan struktur API
                        indikator: item.indikator,
                        rumus_perhitungan: item.rumus_perhitungan,
                        sumber_data: item.sumber_data,
                        target: item.target.map((t: any) => ({
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })) || [];

                    reset({ indikator: indikatorData });

                    // Mengisi array field di react-hook-form
                    replace(indikatorData);
                } else if (resp.code === 400) {
                    setIdNotFound(true);
                    setTujuanNotFound(false);
                } else if (resp.code === 404) {
                    setIdNotFound(false);
                    setTujuanNotFound(true);
                } else {
                    console.log("error fetch", resp);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            }).finally(() => {
                setLoadingDetail(false);
            })
        };
        const sasaranPemdatambah = () => {
            reset({
                indikator: [{
                    indikator: '', rumus_perhitungan: '', sumber_data: '', target: defaultTarget
                }]
            });
        }
        if (jenis === 'edit') {
            fetchDetailasaranPemda();
        } else if (jenis === 'tambah') {
            sasaranPemdatambah();
        }
    }, [id, branding, isOpen, jenis, tahun]);

    const fetchOptionTujuanPemda = async () => {
        setLoadingOption(true);
        await apiFetch<GetResponseGlobal<TujuanPemda[]>>(`${branding?.api_perencanaan}/tujuan_pemda/findall/${tahun}/${jenis_periode}`, {
            method: "GET",
        }).then((resp) => {
            const data = resp.data;
            if (resp.code === 200) {
                const tujuan = data.map((item: TujuanPemda) => ({
                    value: item.id,
                    label: item.tujuan_pemda,
                }));
                setOptionTujuanPemda(tujuan);
            } else {
                setOptionTujuanPemda([]);
            }
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setLoadingOption(false);
        })
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formDataNew = {
            //key : value
            subtema_id: subtema_id,
            periode_id: periode,
            tujuan_pemda_id: TujuanPemda?.value,
            sasaran_pemda: SasaranPemda,
            indikator: data.indikator.map((ind) => ({
                indikator: ind.indikator,
                rumus_perhitungan: ind.rumus_perhitungan,
                sumber_data: ind.sumber_data,
                target: ind.target.map((t, index) => ({
                    target: t.target,
                    satuan: t.satuan,
                    tahun: tahun_list[index],
                })),
            })),
        };
        const formDataEdit = {
            //key : value
            id: id,
            subtema_id: subtema_id,
            periode_id: periode,
            tujuan_pemda_id: TujuanPemda?.value,
            sasaran_pemda: SasaranPemda,
            indikator: data.indikator.map((ind) => ({
                indikator: ind.indikator,
                rumus_perhitungan: ind.rumus_perhitungan,
                sumber_data: ind.sumber_data,
                target: ind.target.map((t, index) => ({
                    target: t.target,
                    satuan: t.satuan,
                    tahun: tahun_list[index],
                })),
            })),
        };
        const getBody = () => {
            if (jenis === "edit") return formDataEdit;
            if (jenis === "tambah") return formDataNew;
            return {}; // Default jika jenis tidak sesuai
        };
        if (TujuanPemda?.value == null || TujuanPemda?.value == undefined) {
            AlertNotification("", "pilih Tujuan Pemda", "warning", 2000);
        } else if (SasaranPemda === '') {
            AlertNotification("", "Sasaran Pemda wajib Terisi", "warning", 2000);
        } else {
            let url = "";
            if (jenis === "edit") {
                url = `sasaran_pemda/update/${id}`;
            } else if (jenis === "tambah") {
                url = `sasaran_pemda/create`;
            } else {
                url = '';
            }
            // jenis === 'tambah' && console.log("tambah :", formDataNew);
            // jenis === 'edit' && console.log("edit :", formDataEdit);
            try {
                setProses(true);
                await apiFetch(`${branding?.api_perencanaan}/${url}`, {
                    method: jenis === "tambah" ? "POST" : "PUT",
                    body: JSON.stringify(getBody()),
                }).then(_ => {
                    AlertNotification("Berhasil", "Berhasil Menyimpan Data Sasaran  Pemda", "success", 3000, true);
                    onSuccess();
                    handleClose();
                }).catch(err => {
                    AlertNotification("Gagal", `${err}`, "error", 3000, true);
                })
            } catch (err) {
                AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            } finally {
                setProses(false);
            }
        }
    };

    const handleClose = () => {
        onClose();
        setSasaranPemda('');
        setTujuanPemda(null);
        reset();
    }

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
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{jenis} Sasaran Pemda {id ?? "tidak ada id"}</h1>
                    </div>
                    {Loading ?
                        <div className="mt-3">
                            <LoadingSync />
                        </div>
                        : (
                            IdNotFound ?
                                <div className="flex flex-wrap items-center justify-center">
                                    <h1 className="py-5">Sasaran Pemda dengan ID : {id} tidak ditemukan / telah terhapus. disarankan untuk reload haeditn</h1>
                                    <ButtonRed className="w-full my-2" onClick={handleClose}>
                                        Tutup
                                    </ButtonRed>
                                </div>
                                :
                                TujuanNotFound ?
                                    <div className="flex flex-wrap items-center justify-center">
                                        <h1 className="py-5">Tujuan Pemda telah terhapus pada sasaran pemda ini, tambahkan ulang sasaran tambah dengan tujuan pemda yang berbeda</h1>
                                        <ButtonRed className="w-full my-2" onClick={handleClose}>
                                            Tutup
                                        </ButtonRed>
                                    </div>
                                    :
                                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mx-5 py-5">
                                        <div className="flex flex-col py-3">
                                            <label
                                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                                htmlFor="sasaran_pemda"
                                            >
                                                Strategic Pemda ({jenis_pohon}):
                                            </label>
                                            <div className="border px-4 py-2 rounded-lg">{nama_pohon}</div>
                                        </div>
                                        <div className="flex flex-col py-3">
                                            <label
                                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                                htmlFor="tujuan_pemda_id"
                                            >
                                                Tujuan Pemda :
                                            </label>
                                            <Controller
                                                name="tujuan_pemda_id"
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        <Select
                                                            {...field}
                                                            placeholder="Pilih Tujuan Pemda"
                                                            options={OptionTujuanPemda}
                                                            isLoading={LoadingOption}
                                                            isSearchable
                                                            isClearable
                                                            value={TujuanPemda}
                                                            onMenuOpen={() => {
                                                                fetchOptionTujuanPemda();
                                                            }}
                                                            onChange={(option) => {
                                                                field.onChange(option);
                                                                setTujuanPemda(option);
                                                            }}
                                                            styles={{
                                                                control: (baseStyles) => ({
                                                                    ...baseStyles,
                                                                    borderRadius: '8px',
                                                                })
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col py-3">
                                            <label
                                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                                htmlFor="sasaran_pemda"
                                            >
                                                Sasaran Pemda:
                                            </label>
                                            <Controller
                                                name="sasaran_pemda"
                                                control={control}
                                                render={({ field }) => (
                                                    <textarea
                                                        {...field}
                                                        className="border px-4 py-2 rounded-lg"
                                                        id="sasaran_pemda"
                                                        placeholder="masukkan Sasaran Pemda"
                                                        value={SasaranPemda}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setSasaranPemda(e.target.value);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {fields.map((field, index) => (
                                            <div className="border border-sky-700 rounded-lg p-2 mt-2" key={index}>
                                                <div className="flex items-center gap-2">
                                                    <label className="uppercase text-base font-bold text-gray-700 my-2">
                                                        indikator Sasaran Pemda {index + 1}:
                                                    </label>
                                                    {index >= 0 && (
                                                        <ButtonRedBorder
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="border border-red-500 text-red-500 rounded-full p-1 hover:bg-red-500 hover:text-white"
                                                        >
                                                            <TbTrash />
                                                        </ButtonRedBorder>
                                                    )}
                                                </div>
                                                <div className="flex flex-col border my-2 py-2 px-2 rounded-lg">
                                                    <Controller
                                                        name={`indikator.${index}.indikator`}
                                                        control={control}
                                                        defaultValue={field.indikator}
                                                        render={({ field }) => (
                                                            <div className="flex flex-col py-3">
                                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                    Nama Indikator {index + 1} :
                                                                </label>
                                                                <input
                                                                    {...field}
                                                                    className="border px-4 py-2 rounded-lg"
                                                                    placeholder={`Masukkan nama indikator ${index + 1}`}
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex flex-col border my-2 py-2 px-2 rounded-lg">
                                                    <Controller
                                                        name={`indikator.${index}.rumus_perhitungan`}
                                                        control={control}
                                                        defaultValue={field.rumus_perhitungan}
                                                        render={({ field }) => (
                                                            <div className="flex flex-col py-3">
                                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                    Rumus Perhitungan :
                                                                </label>
                                                                <input
                                                                    {...field}
                                                                    className="border px-4 py-2 rounded-lg"
                                                                    placeholder={`Masukkan Rumus Perhitungan`}
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex flex-col border my-2 py-2 px-2 rounded-lg">
                                                    <Controller
                                                        name={`indikator.${index}.sumber_data`}
                                                        control={control}
                                                        defaultValue={field.sumber_data}
                                                        render={({ field }) => (
                                                            <div className="flex flex-col py-3">
                                                                <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                    Sumber Data :
                                                                </label>
                                                                <input
                                                                    {...field}
                                                                    className="border px-4 py-2 rounded-lg"
                                                                    placeholder={`Masukkan Sumber Data`}
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex flex-wrap justify-between gap-1">
                                                    {field.target.map((_, subindex) => (
                                                        <div key={`${index}-${subindex}`} className="flex flex-col py-1 px-3 border border-sky-700 rounded-lg">
                                                            <label className="font-bold text-center text-sky-700">
                                                                <p>{tahun_list[subindex]}</p>
                                                            </label>
                                                            <Controller
                                                                name={`indikator.${index}.target.${subindex}.target`}
                                                                control={control}
                                                                defaultValue={_.target}
                                                                render={({ field }) => (
                                                                    <div className="flex flex-col py-3">
                                                                        <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                            Target :
                                                                        </label>
                                                                        <input
                                                                            {...field}
                                                                            type="text"
                                                                            className="border px-4 py-2 rounded-lg"
                                                                            placeholder="Masukkan target"
                                                                        />
                                                                    </div>
                                                                )}
                                                            />
                                                            <Controller
                                                                name={`indikator.${index}.target.${subindex}.satuan`}
                                                                control={control}
                                                                defaultValue={_.satuan}
                                                                render={({ field }) => (
                                                                    <div className="flex flex-col py-3">
                                                                        <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                            Satuan :
                                                                        </label>
                                                                        <input
                                                                            {...field}
                                                                            className="border px-4 py-2 rounded-lg"
                                                                            placeholder="Masukkan satuan"
                                                                        />
                                                                    </div>
                                                                )}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <ButtonSkyBorder
                                            className="mb-3 mt-3"
                                            type="button"
                                            onClick={handleTambahIndikator}
                                        >
                                            Tambah Indikator
                                        </ButtonSkyBorder>
                                        {(!IdNotFound && !TujuanNotFound) &&
                                            <ButtonSky className="w-full mt-3" type="submit">
                                                {Proses ?
                                                    <span className="flex items-center gap-1">
                                                        <LoadingButton />
                                                        Menyimpan...
                                                    </span>
                                                    :
                                                    <span className="flex items-center gap-1">
                                                        <TbDeviceFloppy />
                                                        Simpan
                                                    </span>
                                                }
                                            </ButtonSky>
                                        }
                                        <ButtonRed className="w-full my-2" onClick={handleClose}>
                                            <span className="flex items-center gap-1">
                                                <TbX />
                                                Batal
                                            </span>
                                        </ButtonRed>
                                    </form>
                        )}
                </div>
            </div>
        )
    }
}