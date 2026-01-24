'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/ui/button';
import { LoadingButton } from "@/lib/loading";
import { AlertNotification } from "@/lib/alert";
import Select from 'react-select';
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal, OptionType } from "@/types";
import { GetResponseFindAllVisi } from "../../visi/type";
import { GetResponseMisiPemdaByIdVisi, FormValue, TujuanPemda } from "../type";
import { Misi } from "../../misi/type";
import { useBrandingContext } from "@/providers/BrandingProvider";

interface modal {
    isOpen: boolean;
    onClose: () => void;
    jenis: 'edit' | 'tambah';
    Data: TujuanPemda | null;
    tema_id?: number;
    periode: number; // id periode
    tahun: number;
    jenis_periode: string;
    tahun_list: string[]; // tahun value header
    onSuccess: () => void;
}

export const ModalTujuanPemda: React.FC<modal> = ({ isOpen, onClose, Data, tema_id, periode, jenis_periode, jenis, tahun, tahun_list, onSuccess }) => {

    const { branding } = useBrandingContext();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();

    const [TujuanPemda, setTujuanPemda] = useState<string>('');
    const [NamaPohon, setNamaPohon] = useState<string>('');
    const [Visi, setVisi] = useState<OptionType | null>(null);
    const [Misi, setMisi] = useState<OptionType | null>(null);

    const [VisiOption, setVisiOption] = useState<OptionType[]>([]);
    const [MisiOption, setMisiOption] = useState<OptionType[]>([]);

    const [Proses, setProses] = useState<boolean>(false);
    const [IsLoading, setIsLoading] = useState<boolean>(false);

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const handleTambahIndikator = () => {
        const defaultTarget = Array(5).fill({ target: '', satuan: '' });
        append({ indikator: '', rumus_perhitungan: '', sumber_data: '', target: defaultTarget });
    };

    useEffect(() => {
        const fetchDetailTujuan = async () => {
            try {
                await apiFetch(`${branding?.api_perencanaan}/tujuan_pemda/detail/${Data?.id}`, {
                }).then((resp: any) => {
                    // console.log("option lembaga", resp)
                    const hasil = resp.data;
                    if (hasil.tujuan_pemda) {
                        setTujuanPemda(hasil.tujuan_pemda);
                    }
                    if (hasil.nama_tematik) {
                        setNamaPohon(hasil.nama_tematik);
                    }
                    if (hasil.id_visi) {
                        const visi = {
                            label: hasil.visi,
                            value: hasil.id_visi,
                        }
                        setVisi(visi);
                    }
                    if (hasil.id_misi) {
                        const misi = {
                            value: hasil.id_misi,
                            label: hasil.misi,
                        }
                        setMisi(misi);
                    }
    
                    // Mapping data ke form dengan struktur yang sesuai
                    const indikatorData = hasil.indikator?.map((item: any) => ({
                        id: item.id,
                        indikator: item.indikator,
                        rumus_perhitungan: item.rumus_perhitungan,
                        sumber_data: item.sumber_data,
                        target: item.target.map((t: any) => ({
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })) || [];
    
                    reset({ indikator: indikatorData });
                    
                }).catch(err => {
                    AlertNotification("Gagal", `${err}`, "error", 3000, true);
                })
            } catch (err) {
                console.log(err);
            }
        };
        const fetchPokintambah = async () => {
            try {
                await apiFetch(`${branding?.api_perencanaan}/pohon_kinerja/pokin_with_periode/${tema_id}/${jenis_periode}`, {
                }).then((resp: any) => {
                    const hasil = resp.data;
                    if (hasil.nama_pohon) {
                        setNamaPohon(hasil.nama_pohon);
                    }

                    const indikatorData = hasil.indikator?.map((item: any) => ({
                        id: item.id,
                        indikator: item.indikator,
                        rumus_perhitungan: item.rumus_perhitungan,
                        sumber_data: item.sumber_data,
                        target: item.target.map((t: any) => ({
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })) || [];
                    reset({ indikator: indikatorData });
                }).catch(err => {
                    AlertNotification("Gagal", `${err}`, "error", 3000, true);
                })
            } catch (err) {
                console.log(err);
            }
        };
        if (jenis === 'edit' && isOpen) {
            fetchDetailTujuan();
        } else if (jenis === "tambah" && isOpen) {
            fetchPokintambah();
        }
    }, [Data, branding, isOpen, jenis, reset, replace, tahun, tema_id, jenis_periode]);

    const fetchVisiOption = async () => {
        setIsLoading(true);
        await apiFetch<GetResponseGlobal<GetResponseFindAllVisi[]>>(`${branding?.api_perencanaan}/visi_pemda/findall/tahun/${branding?.tahun?.value}/jenisperiode/${jenis_periode}`, {
            method: "GET",
        }).then((resp) => {
            const data = resp.data;
            if (resp.code === 200) {
                const visi = data.map((v: GetResponseFindAllVisi) => ({
                    ...v,
                    value: v.id,
                    label: `${v.visi} (${v.tahun_awal_periode} - ${v.tahun_akhir_periode} ${v.jenis_periode})`,
                }));
                setVisiOption(visi);
            } else {
                setVisiOption([]);
            }
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setIsLoading(false);
        })
    }
    const fetchMisiOption = async (id: number) => {
        setIsLoading(true);
        await apiFetch<GetResponseGlobal<GetResponseMisiPemdaByIdVisi>>(`${branding?.api_perencanaan}/misi_pemda/findbyvisi${id}`, {
            method: "GET",
        }).then((resp) => {
            const data = resp.data.misi_pemda;
            if (resp.code === 200) {
                const misi = data.map((m: Misi) => ({
                    ...m,
                    value: m.id,
                    label: m.misi,
                }));
                setMisiOption(misi);
            } else {
                setMisiOption([]);
            }
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const payload = {
            //key : value
            ...(jenis === "tambah" ? {
                tema_id: tema_id,
            } : {
                id: Data?.id,
            }),
            periode_id: periode,
            tujuan_pemda: TujuanPemda,
            id_visi: Visi?.value,
            id_misi: Misi?.value,
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
        try {
            setProses(true);
            await apiFetch(jenis === "tambah" ? `${branding?.api_perencanaan}/tujuan_pemda/create` : `${branding?.api_perencanaan}/tujuan_pemda/update/${Data?.id}`, {
                method: jenis === "tambah" ? "POST" : "PUT",
                body: payload as any
            }).then(_ => {
                AlertNotification("Berhasil", "Berhasil Menyimpan Data Tujuan Pemda", "success", 3000, true);
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
    };

    const handleClose = () => {
        onClose();
        reset();
        setTujuanPemda('');
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{jenis === 'tambah' ? "Tambah" : "Edit"} Tujuan Pemda</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tujuan_pemda"
                            >
                                Tema:
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{NamaPohon}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="tujuan_pemda"
                            >
                                Tujuan Pemda:
                            </label>
                            <Controller
                                name="tujuan_pemda"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tujuan_pemda"
                                        placeholder="masukkan Tujuan Pemda"
                                        value={TujuanPemda}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setTujuanPemda(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="visi"
                            >
                                Visi :
                            </label>
                            <Controller
                                name="visi"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Visi"
                                            isLoading={IsLoading}
                                            options={VisiOption}
                                            isSearchable
                                            value={Visi}
                                            isClearable
                                            onMenuOpen={() => {
                                                fetchVisiOption();
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setVisi(option);
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
                                htmlFor="misi"
                            >
                                Misi :
                            </label>
                            <Controller
                                name="misi"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Pilih Misi"
                                            isLoading={IsLoading}
                                            options={MisiOption}
                                            isSearchable
                                            value={Misi}
                                            isDisabled={!Visi}
                                            isClearable
                                            onMenuOpen={() => {
                                                if (Visi) {
                                                    fetchMisiOption(Visi?.value);
                                                }
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setMisi(option);
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
                        <label className="uppercase text-base font-bold text-gray-700 my-2">
                            indikator Tujuan Pemda :
                        </label>
                        {fields.map((field, index) => (
                            <React.Fragment key={index}>
                                <div className="flex flex-col bg-gray-300 my-2 py-2 px-2 rounded-lg">
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
                                <div key={index} className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
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
                                <div key={index} className="flex flex-col border border-gray-200 my-2 py-2 px-2 rounded-lg">
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
                                        <div key={`${index}-${subindex}`} className="flex flex-col py-1 px-3 border border-gray-200 rounded-lg">
                                            <label className="text-base text-center text-gray-700">
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
                                {index >= 0 && (
                                    <ButtonRedBorder
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="w-[200px] mt-3"
                                    >
                                        Hapus
                                    </ButtonRedBorder>
                                )}
                            </React.Fragment>
                        ))}
                        <ButtonSkyBorder
                            className="mb-3 mt-3"
                            type="button"
                            onClick={handleTambahIndikator}
                        >
                            Tambah Indikator
                        </ButtonSkyBorder>
                        <ButtonSky className="w-full mt-3" type="submit" disabled={Proses}>
                            {Proses ?
                                <span className="flex">
                                    <LoadingButton />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonSky>
                        <ButtonRed className="w-full my-2" onClick={handleClose}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}