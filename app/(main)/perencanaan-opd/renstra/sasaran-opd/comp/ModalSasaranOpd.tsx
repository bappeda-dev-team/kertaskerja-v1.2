'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/ui/button';
import { LoadingButton, LoadingSync } from "@/lib/loading";
import { AlertNotification } from "@/lib/alert";
import Select from 'react-select';
import { useBrandingContext } from "@/providers/BrandingProvider";
import { TbCirclePlus, TbDeviceFloppy, TbTrash, TbX } from "react-icons/tb";
import { GetResponseGlobal, OptionType, OptionTypeString } from "@/types";
import { GetResponseFindallSasaranOpd } from "../type";

interface FormValue {
    id_pohon: OptionType;
    nama_rencana_kinerja: string;
    id_tujuan_opd: OptionType;
    tahun: string;
    status_rencana_kinerja: string;
    catatan: string;
    tahun_awal: string,
    tahun_akhir: string,
    jenis_periode: string,
    kode_opd: string;
    pegawai_id: OptionTypeString;
    indikator: indikator[];
}

interface indikator {
    id?: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: target[];
}
type target = {
    id_target: string;
    id_indikator: string;
    target: string;
    satuan: string;
    tahun?: string;
};

interface modal {
    isOpen: boolean;
    onClose: () => void;
    jenis: 'edit' | 'tambah';
    kode_opd: string;
    id: string;
    Data: GetResponseFindallSasaranOpd | null;
    tahun: number;
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string[];
    periode: number;
    jenis_periode: string;
    onSuccess: () => void;
}

export const ModalSasaranOpd: React.FC<modal> = ({ isOpen, onClose, Data, id, jenis_periode, kode_opd, tahun, tahun_akhir, tahun_awal, tahun_list, periode, jenis, onSuccess }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>();

    const [SasaranOpd, setSasaranOpd] = useState<string>('');
    const [OptionTujuan, setOptionTujuan] = useState<OptionType[]>([]);
    const [TujuanOpd, setTujuanOpd] = useState<OptionType | null>(null);

    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const handleTambahIndikator = () => {
        const defaultTarget = Array((tahun_list && tahun_list.length)).fill({ target: '', satuan: '' }); // Buat array 5 target kosong
        append({ indikator: '', rumus_perhitungan: '', sumber_data: '', target: defaultTarget });
    };

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchDetailasaranOpd = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/sasaran_opd/detail/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data.sasaran_opd[0];
                // console.log(hasil);
                if (hasil.nama_sasaran_opd) {
                    setSasaranOpd(hasil.nama_sasaran_opd);
                }
                if (hasil.id_tujuan_opd) {
                    const tujuan = {
                        value: hasil.id_tujuan_opd,
                        label: hasil.nama_tujuan_opd
                    }
                    setTujuanOpd(tujuan);
                }
                reset({
                    indikator: hasil.indikator?.map((item: indikator) => ({
                        id: item.id,
                        indikator: item.indikator,
                        rumus_perhitungan: item.rumus_perhitungan,
                        sumber_data: item.sumber_data,
                        target: item.target.map((t: target) => ({
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })),
                });

                // Replace the fields to avoid duplication
                replace(hasil.indikator.map((item: indikator) => ({
                    id: item.id,
                    indikator: item.indikator,
                    rumus_perhitungan: item.rumus_perhitungan,
                    sumber_data: item.sumber_data,
                    target: item.target,
                })));
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        const fetchPokinBaru = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/pohon_kinerja/pokin_with_periode/${Data?.id_pohon}/${jenis_periode}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const hasil = result.data;
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
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        if (isOpen && jenis === 'edit') {
            fetchDetailasaranOpd();
        } else if (isOpen && jenis === 'tambah') {
            fetchPokinBaru();
        }
    }, [branding, isOpen, jenis, tahun, id, replace, reset, Data, jenis_periode]);

    const fetchOptionTujuanOpd = async () => {
        setIsLoading(true)
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/tujuan_opd/findall_only_name/${kode_opd}/tahunawal/${tahun_awal}/tahunakhir/${tahun_akhir}/jenisperiode/${jenis_periode}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            const data = result.data;
            if (data.length == 0) {
                setOptionTujuan([]);
            } else if (result.code == 500) {
                setOptionTujuan([]);
            } else {
                const hasil = data.map((item: any) => ({
                    label: item.tujuan,
                    value: item.id_tujuan_opd,
                }));
                setOptionTujuan(hasil);
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            id_pohon: Data?.id_pohon,
            nama_sasaran: SasaranOpd,
            id_tujuan_opd: TujuanOpd?.value,
            tahun_awal: tahun_awal,
            tahun_akhir: tahun_akhir,
            jenis_periode: jenis_periode,
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
            id: Data?.id_pohon,
            nama_sasaran: SasaranOpd,
            id_tujuan_opd: TujuanOpd?.value,
            tahun_awal: tahun_awal,
            tahun_akhir: tahun_akhir,
            jenis_periode: jenis_periode,
            indikator: data.indikator.map((ind) => ({
                id: ind.id,
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
        // jenis === 'tambah' && console.log("baru :", formDataNew);
        // jenis === 'edit' && console.log("edit :", formDataEdit);
        if (SasaranOpd === '') {
            AlertNotification("", "Sasaran OPD wajib Terisi", "warning", 2000);
        } else {
            try {
                let url = "";
                if (jenis === "edit") {
                    url = `sasaran_opd/update/${id}`;
                } else if (jenis === "tambah") {
                    url = `sasaran_opd/create`;
                } else {
                    url = '';
                }
                setProses(true);
                const response = await fetch(`${API_URL}/${url}`, {
                    method: jenis === 'edit' ? "PUT" : "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(getBody()),
                });
                const result = await response.json();
                if (result.code === 200 || result.code === 201) {
                    AlertNotification("Berhasil", `Berhasil ${jenis === 'tambah' ? "Menambahkan" : "Mengubah"} Sasaran OPD`, "success", 1000);
                    onClose();
                    onSuccess();
                    reset();
                } else {
                    AlertNotification("Gagal", `${result.data}`, "error", 2000);
                    console.log(result);
                }
            } catch (err) {
                AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
                console.error(err);
            } finally {
                setProses(false);
            }
        }
    };

    const handleClose = () => {
        onClose();
        setSasaranOpd('');
        reset();
        setTujuanOpd(null);
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{jenis === 'tambah' ? "Tambah" : "Edit"} Sasaran OPD</h1>
                    </div>
                    {Loading ?
                        <div className="py-5">
                            <LoadingSync />
                        </div>
                        :
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col mx-5 py-5"
                        >
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                >
                                    Strategic OPD :
                                </label>
                                <div className="border px-4 py-2 rounded-lg">{Data?.nama_pohon}</div>
                            </div>
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="nama_rencana_kinerja"
                                >
                                    Sasaran OPD:
                                </label>
                                <Controller
                                    name="nama_rencana_kinerja"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nama_rencana_kinerja"
                                            placeholder="masukkan Sasaran OPD"
                                            value={SasaranOpd}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setSasaranOpd(e.target.value);
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="id_tujuan_opd"
                                >
                                    Tujuan OPD :
                                </label>
                                <Controller
                                    name="id_tujuan_opd"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                {...field}
                                                placeholder="Pilih Tujuan OPD"
                                                isLoading={IsLoading}
                                                options={OptionTujuan}
                                                isSearchable
                                                value={TujuanOpd}
                                                isClearable
                                                onMenuOpen={() => {
                                                    fetchOptionTujuanOpd();
                                                }}
                                                onChange={(option: any) => {
                                                    field.onChange(option);
                                                    setTujuanOpd(option);
                                                }}
                                                styles={{
                                                    control: (baseStyles: any) => ({
                                                        ...baseStyles,
                                                        borderRadius: '8px',
                                                    })
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </div>
                            <label className="uppercase text-base font-bold text-gray-700 my-2">
                                indikator Sasaran OPD :
                            </label>
                            {fields.map((field, index_indikator: number) => (
                                <React.Fragment key={index_indikator}>
                                    <div className="flex flex-col border border-gray-300 my-2 py-2 px-2 rounded-lg">
                                        <Controller
                                            name={`indikator.${index_indikator}.indikator`}
                                            control={control}
                                            defaultValue={field.indikator}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Nama Indikator {index_indikator + 1} :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder={`Masukkan nama indikator ${index_indikator + 1}`}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
                                        <Controller
                                            name={`indikator.${index_indikator}.rumus_perhitungan`}
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
                                    <div className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
                                        <Controller
                                            name={`indikator.${index_indikator}.sumber_data`}
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
                                            <div key={`${index_indikator}-${subindex}`} className="flex flex-col py-1 px-3 border border-gray-200 rounded-lg">
                                                <label className="text-base text-center text-gray-700">
                                                    <p>{tahun_list[subindex]}</p>
                                                </label>
                                                <Controller
                                                    name={`indikator.${index_indikator}.target.${subindex}.target`}
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
                                                    name={`indikator.${index_indikator}.target.${subindex}.satuan`}
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
                                    {index_indikator >= 0 && (
                                        <ButtonRedBorder
                                            type="button"
                                            onClick={() => remove(index_indikator)}
                                            className="w-[200px] mt-3"
                                        >
                                            Hapus
                                        </ButtonRedBorder>
                                    )}
                                </React.Fragment>
                            ))}
                            <ButtonSkyBorder
                                className="mb-3 mt-3 flex items-center gap-1"
                                type="button"
                                onClick={handleTambahIndikator}
                            >
                                <TbCirclePlus />
                                Tambah Indikator
                            </ButtonSkyBorder>
                            <ButtonSky className="w-full mt-3 flex items-center gap-1" type="submit">
                                {Proses ?
                                    <>
                                        <LoadingButton />
                                        Menyimpan...
                                    </>
                                    :
                                    <>
                                        <TbDeviceFloppy />
                                        Simpan
                                    </>
                                }
                            </ButtonSky>
                            <ButtonRed className="w-full my-2 flex items-center gap-1" onClick={handleClose}>
                                <TbX />
                                Batal
                            </ButtonRed>
                        </form>
                    }
                </div>
            </div>
        )
    }
}