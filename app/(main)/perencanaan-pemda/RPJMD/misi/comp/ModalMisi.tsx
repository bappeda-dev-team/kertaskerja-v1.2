'use client'

import { useEffect, useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/ui/button";
import { AlertNotification } from "@/lib/alert";
import { LoadingButton } from "@/lib/loading";
import { Misi, FormValue, OptionVisi } from "../type";
import { GetResponseGlobal } from "@/types";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseFindAllVisi } from "../../visi/type";
import Select from 'react-select';

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: Misi | null;
    periode: string;
}

export const ModalVisi: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data, periode }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            id: Data?.id || 0,
            id_visi: null,
            misi: Data?.misi,
            urutan: Data?.urutan ? {
                value: Data?.urutan,
                label: String(Data?.urutan),
            } : null,
            keterangan: Data?.keterangan || "",
        }
    });

    const [OptionVisi, setOptionVisi] = useState<OptionVisi[]>([]);

    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const handleClose = () => {
        onClose();
        reset();
    }

    useEffect(() => {
        const fetchDetailMisi = async () => {
            await apiFetch<GetResponseGlobal<GetResponseFindAllVisi>>(`${branding?.api_perencanaan}/misi_pemda/detail/${Data?.id}`, {
                method: "GET",
            }).then((resp) => {
                setLoading(true);
                const data = resp.data;
                if (resp.code === 200) {
                    reset({
                        id_visi: {
                            ...data,
                            value: data.id,
                            label: `${data.visi} (${data.tahun_awal_periode} - ${data.tahun_akhir_periode} ${data.jenis_periode})`,
                        }
                    })
                } else {
                    AlertNotification("Gagal", `${data}`, "error", 3000, true);
                }
            }).catch(err => {
                AlertNotification("Gagal fetch data detail misi", `${err}`, "error", 3000, true);
            }).finally(() => {
                setLoading(false);
            })
        }
        if (jenis === "edit") {
            fetchDetailMisi();
        }
    }, [Data, jenis, branding, isOpen])

    const getOptionVisi = async () => {
        setLoadingOption(true);
        await apiFetch<GetResponseGlobal<GetResponseFindAllVisi[]>>(`${branding?.api_perencanaan}/visi_pemda/findall/tahun/${branding?.tahun?.value}/jenisperiode/${periode}`, {
            method: "GET",
        }).then((resp) => {
            const data = resp.data;
            if (resp.code === 200) {
                const visi = data.map((v: GetResponseFindAllVisi) => ({
                    ...v,
                    value: v.id,
                    label: `${v.visi} (${v.tahun_awal_periode} - ${v.tahun_akhir_periode} ${v.jenis_periode})`,
                }));
                setOptionVisi(visi);
            } else {
                setOptionVisi([]);
            }
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setLoadingOption(false);
        })
    }

    const urutanOption = Array.from({ length: 20 }, (_, i) => ({
        label: (i + 1).toString(),
        value: i + 1
    }));

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            id: Data?.id,
            misi: data.misi,
            tahun_awal_periode: data.id_visi?.tahun_awal_periode,
            tahun_akhir_periode: data.id_visi?.tahun_akhir_periode,
            jenis_periode: data.id_visi?.jenis_periode,
            urutan: data.urutan?.value,
            keterangan: data.keterangan,
        };
        // console.log(formData);
        try {
            setProses(true);
            await apiFetch(jenis === "tambah" ? `${branding?.api_perencanaan}/visi_pemda/create` : `${branding?.api_perencanaan}/visi_pemda/update/${Data?.id}`, {
                method: jenis === "tambah" ? "POST" : "PUT",
                body: formData as any
            }).then(_ => {
                AlertNotification("Berhasil", "Berhasil Menyimpan Data Visi Pemda", "success", 3000, true);
                onSuccess();
                handleClose();
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            })
        } catch (err) {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
            console.log(err)
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-4/5 max-h-[80%] text-start overflow-auto`}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="border-b">
                            <h1 className="text-xl font-semibold uppercase text-center">{jenis} Misi Pemda</h1>
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Misi : {errors.misi && <p className="text-red-400 font-semibold">{errors.misi.message}</p>}
                            </label>
                            <Controller
                                name="misi"
                                control={control}
                                rules={{ required: "wajib terisi" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="misi"
                                        type="text"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Misi"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="flex items-center gap-1 uppercase text-xs font-bold text-gray-700 my-2">
                                Visi : {errors.id_visi && <p className="text-red-400 font-semibold">{errors.id_visi.message}</p>}
                            </label>
                            <Controller
                                name="id_visi"
                                control={control}
                                rules={{ required: "wajib diisi" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Pilih Visi"
                                        options={OptionVisi}
                                        isLoading={LoadingOption || Loading}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            getOptionVisi();
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            })
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="flex items-center gap-1 uppercase text-xs font-bold text-gray-700 my-2">
                                Urutan : {errors.urutan && <p className="text-red-400 font-semibold">{errors.urutan.message}</p>}
                            </label>
                            <Controller
                                name="urutan"
                                control={control}
                                rules={{ required: "wajib diisi" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Pilih Urutan"
                                        options={urutanOption}
                                        isSearchable
                                        isClearable
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            })
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Keterangan :
                            </label>
                            <Controller
                                name="keterangan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        id="keterangan"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Keterangan"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-1 mt-3">
                            <ButtonSky type="submit" className="w-full" disabled={Proses}>
                                {Proses ?
                                    <>
                                        <LoadingButton />
                                        <span>menyimpan..</span>
                                    </>
                                    :
                                    <>
                                        <TbDeviceFloppy />
                                        <span>Simpan</span>
                                    </>
                                }
                            </ButtonSky>
                            <ButtonRed className="flex items-center gap-1 w-full" onClick={handleClose} disabled={Proses}>
                                <TbX />
                                Batal
                            </ButtonRed>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}