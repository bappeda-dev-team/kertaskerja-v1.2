'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/ui/button';
import Select from 'react-select';
import { LoadingButton, LoadingClip } from "@/lib/loading";
import { AlertNotification } from "@/lib/alert";
import { FormValue, Periode, TujuanOpd } from "../type";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal, OptionTypeString } from "@/types";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseFindallPeriode } from "@/app/(main)/datamaster/periode/type";
import { GetResponseFindallBidangUrusan } from "@/app/(main)/datamaster/programkegiatan/bidang-urusan/type";
import { TbCirclePlus, TbDeviceFloppy, TbTrash, TbX } from "react-icons/tb";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    jenis: 'edit' | 'tambah';
    id?: number;
    periode?: number;
    tahun?: number;
    tahun_list?: string[];
    kode_opd?: string;
    special?: boolean;
    onSuccess: () => void;
}

export const ModalTujuanOpd: React.FC<modal> = ({ isOpen, onClose, id, kode_opd, periode, jenis, tahun, tahun_list, special, onSuccess }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>();

    const [TujuanOpd, setTujuanOpd] = useState<string>('');
    const [Periode, setPeriode] = useState<Periode | null>(null);
    const [PeriodeOption, setPeriodeOption] = useState<Periode[]>([]);
    const [BidangUrusan, setBidangUrusan] = useState<OptionTypeString | null>(null);
    const [OptionBidangUrusan, setOptionBidangUrusan] = useState<OptionTypeString[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const handleTambahIndikator = () => {
        const defaultTarget = Array(special === true ? Periode?.tahun_list.length : (tahun_list && tahun_list.length)).fill({ target: '', satuan: '' });
        append({ indikator: '', rumus_perhitungan: '', sumber_data: '', target: defaultTarget });
    };

    useEffect(() => {
        const fetchDetailTujuan = async () => {
            setLoading(true);
            await apiFetch<GetResponseGlobal<TujuanOpd>>(`${branding?.api_perencanaan}/tujuan_opd/detail/${id}`, {
                method: "GET",
            }).then((result) => {
                const hasil = result.data;
                if (result.code === 200) {
                    if (hasil.tujuan) {
                        setTujuanOpd(hasil.tujuan);
                    }
                    if (hasil.kode_bidang_urusan) {
                        const bd = {
                            value: hasil.kode_bidang_urusan,
                            label: hasil.nama_bidang_urusan || "-",
                        }
                        setBidangUrusan(bd);
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
                } else {
                    setError(true);
                }
            }).catch((err) => {
                console.log(err);
                setError(true);
            }).finally(() => {
                setLoading(false);
            })
        };
        if (jenis === 'edit') {
            fetchDetailTujuan();
        }
    }, [id, branding, isOpen, jenis, reset, replace, tahun, tahun_list, special]);

    const fetchOptionBidangUrusan = async () => {
        let url = `bidang_urusan/findall/${kode_opd}`;
        setLoadingOption(true);
        await apiFetch<GetResponseGlobal<GetResponseFindallBidangUrusan[]>>(`${branding?.api_perencanaan}/${url}`, {
            method: "GET"
        }).then((result) => {
            if (result.code === 200) {
                const data = result.data.map((item: GetResponseFindallBidangUrusan) => ({
                    ...item,
                    value: item.kode_bidang_urusan,
                    label: `(${item.kode_bidang_urusan}) ${item.nama_bidang_urusan}`,
                }));
                setOptionBidangUrusan(data);
            } else {
                console.log(result.data);
                setOptionBidangUrusan([]);
            }
        }).catch((err) => {
            setOptionBidangUrusan([]);
            console.log(err);
        }).finally(() => {
            setLoadingOption(false);
        })
    }
    const fetchOptionPeriode = async () => {
        let url = `periode/findall`;
        setLoadingOption(true);
        await apiFetch<GetResponseGlobal<GetResponseFindallPeriode[]>>(`${branding?.api_perencanaan}/${url}`, {
            method: "GET"
        }).then((result) => {
            if (result.code === 200) {
                const data = result.data;
                const hasil = data.map((item: GetResponseFindallPeriode) => ({
                    ...item,
                    value: item.id,
                    label: `${item.tahun_awal} - ${item.tahun_akhir} (${item.jenis_periode})`,
                }));
                setPeriodeOption(hasil);
            } else {
                console.log(result.data);
                setPeriodeOption([]);
            }
        }).catch((err) => {
            setPeriodeOption([]);
            console.log(err);
        }).finally(() => {
            setLoadingOption(false);
        })
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = {
            //key : value
            ...(jenis === "edit" && {
                id: id,
            }),
            kode_bidang_urusan: BidangUrusan?.value,
            periode_id: periode,
            kode_opd: kode_opd,
            tujuan: TujuanOpd,
            indikator: data.indikator.map((ind) => ({
                indikator: ind.indikator,
                rumus_perhitungan: ind.rumus_perhitungan,
                sumber_data: ind.sumber_data,
                target: ind.target.map((t, index) => ({
                    target: t.target,
                    satuan: t.satuan,
                    tahun: tahun_list && tahun_list[index],
                })),
            })),
        };
        // console.log(payload);
        let url = "";
        if (jenis === "edit") {
            url = `tujuan_opd/update/${id}`;
        } else if (jenis === "tambah") {
            url = `tujuan_opd/create`;
        }
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/${url}`, {
            method: jenis === "edit" ? "PUT" : "POST",
            body: JSON.stringify(payload),
        }).then((result: any) => {
            if (result.code === 201 || result.code === 200) {
                AlertNotification("Berhasil", `Berhasil ${jenis === 'tambah' ? "Menambahkan" : "Mengubah"} Tujuan OPD`, "success", 1000);
                onClose();
                onSuccess();
                reset();
            } else if (result.code === 500) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
                console.error(result);
            }
        }).catch((err) => {
            console.error(err);
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }).finally(() => {
            setProses(false);
        })
    };

    const handleClose = () => {
        onClose();
        setTujuanOpd('');
        setBidangUrusan(null);
        setPeriode(null);
        reset();
    }

    if (!isOpen) {
        return null;
    } else if (Loading) {
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
                        <h1 className="text-xl uppercase text-center">{jenis} Tujuan OPD</h1>
                    </div>
                    {Error ?
                        <div className="flex flex-wrap items-center justify-center">
                            <h1 className="py-5 text-red-500">Error, Gagal mendapatkan data Tujuan OPD, reload halaman, periksa koneksi internet, atau hubungi tim developer</h1>
                            <ButtonRed className="w-full my-2" onClick={handleClose}>
                                Tutup
                            </ButtonRed>
                        </div>
                        :
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mx-5 py-5">
                            <div className="flex flex-col py-1">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="tujuan"
                                >
                                    Tujuan OPD:
                                </label>
                                <Controller
                                    name="tujuan"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="tujuan"
                                            placeholder="masukkan Tujuan OPD"
                                            value={TujuanOpd}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setTujuanOpd(e.target.value);
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex flex-col py-1">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="kode_bidang_urusan"
                                >
                                    Bidang Urusan:
                                </label>
                                <Controller
                                    name="kode_bidang_urusan"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            id="kode_bidang_urusan"
                                            placeholder="Pilih Bidang Urusan"
                                            value={BidangUrusan}
                                            options={OptionBidangUrusan}
                                            isLoading={LoadingOption}
                                            onMenuOpen={() => {
                                                fetchOptionBidangUrusan();
                                            }}
                                            onMenuClose={() => setOptionBidangUrusan([])}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setBidangUrusan(option);
                                            }}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    borderColor: 'black', // Warna default border menjadi merah
                                                    '&:hover': {
                                                        borderColor: '#3673CA', // Warna border tetap merah saat hover
                                                    },
                                                }),
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            {special === true &&
                                <div className="flex flex-col py-1">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="periode_id"
                                    >
                                        Periode:
                                    </label>
                                    <Controller
                                        name="periode_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                id="periode_id"
                                                placeholder="Pilih Periode"
                                                value={Periode}
                                                options={PeriodeOption}
                                                isLoading={LoadingOption}
                                                isClearable
                                                onMenuOpen={() => {
                                                    fetchOptionPeriode();
                                                }}
                                                onMenuClose={() => setPeriodeOption([])}
                                                onChange={(option) => {
                                                    field.onChange(option);
                                                    setPeriode(option);
                                                }}
                                                styles={{
                                                    control: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        borderRadius: '8px',
                                                        borderColor: 'black', // Warna default border menjadi merah
                                                        '&:hover': {
                                                            borderColor: '#3673CA', // Warna border tetap merah saat hover
                                                        },
                                                    }),
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            }
                            {fields.map((field, index) => (
                                <div key={index} className="p-2 border border-sky-500 rounded-lg my-2">
                                    <div className="flex items-center gap-2">
                                        <label className="uppercase text-base font-bold text-sky-700 my-2">
                                            indikator Tujuan OPD {index + 1} :
                                        </label>
                                        {index >= 0 && (
                                            <ButtonRedBorder
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="border border-red-500 text-red-700 rounded-full p-1 hover:bg-red-500 hover:text-white"
                                            >
                                                <TbTrash />
                                            </ButtonRedBorder>
                                        )}
                                    </div>
                                    <div className="flex flex-col rounded-lg">
                                        <Controller
                                            name={`indikator.${index}.indikator`}
                                            control={control}
                                            defaultValue={field.indikator}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-2">
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
                                    <Controller
                                        name={`indikator.${index}.rumus_perhitungan`}
                                        control={control}
                                        defaultValue={field.rumus_perhitungan}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-2">
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
                                    <Controller
                                        name={`indikator.${index}.sumber_data`}
                                        control={control}
                                        defaultValue={field.sumber_data}
                                        render={({ field }) => (
                                            <div className="flex flex-col py-2">
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
                                    <div className="flex flex-wrap justify-between gap-1 target&satuan">
                                        {field.target.map((_, subindex) => (
                                            <div key={`${index}-${subindex}`} className="flex flex-col py-1 px-3 border border-sky-500 rounded-lg">
                                                <label className="font-bold text-center text-sky-700">
                                                    <p>{special === true ? Periode?.tahun_list[subindex] : (tahun_list && tahun_list[subindex])}</p>
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