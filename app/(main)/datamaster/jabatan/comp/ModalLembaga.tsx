'use client'

import { useEffect, useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/ui/button";
import { AlertNotification } from "@/lib/alert";
import { LoadingButton } from "@/lib/loading";
import { GetResponseFindallJabatan } from "../type";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { OptionTypeString } from "@/types";
import Select from 'react-select';

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: GetResponseFindallJabatan | null
}
interface FormValue {
    id: string;
    kode_opd: OptionTypeString | null;
    nama_jabatan: string;
    kode_jabatan: string;
}

export const ModalLembaga: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            id: Data?.id,
            nama_jabatan: Data?.nama_jabatan,
            kode_jabatan: Data?.kode_jabatan,
            kode_opd: Data?.operasional_daerah ? {
                value: Data?.operasional_daerah.kode_opd,
                label: Data?.operasional_daerah.kode_opd,
            }
            : null,
        }
    });

    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);

    const [OptionOpd, setOptionOpd] = useState<OptionTypeString[]>([]);

    const { branding } = useBrandingContext();

    const handleClose = () => {
        onClose();
        reset();
    }

    useEffect(() => {
        const getOpd = async () => {
            setLoading(true);
            await apiFetch<any>(`${branding?.api_perencanaan}/opd/findall`, {
                method: "GET",
            }).then((resp) => {
                const data = resp.data;
                if (resp.code === 200) {
                    const opd = data.map((item: any) => ({
                        value: item.kode_opd,
                        label: item.nama_opd,
                    }));
                    setOptionOpd(opd);
                } else {
                    setOptionOpd([]);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            }).finally(() => {
                setLoading(false);
            })
        }
        getOpd();
    }, [branding])

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            nama_jabatan: data.nama_jabatan,
            kode_jabatan: data.kode_jabatan,
            kode_opd: data.kode_opd?.value,
        };
        // console.log(formData);
        try {
            setProses(true);
            await apiFetch(jenis === "tambah" ? `${branding?.api_perencanaan}/jabatan/create` : `${branding?.api_perencanaan}/jabatan/update/${Data?.id}`, {
                method: jenis === "tambah" ? "POST" : "PUT",
                body: formData as any
            }).then(_ => {
                AlertNotification("Berhasil", "Berhasil Menyimpan Data Jabatan", "success", 3000, true);
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
                            <h1 className="text-xl font-semibold uppercase text-center">{jenis} Jabatan</h1>
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Perangkat Daerah : {errors.kode_opd && "wajib diisi"}
                            </label>
                            <Controller
                                name="kode_opd"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Pilih Perangkat Daerah"
                                        options={OptionOpd}
                                        isLoading={Loading}
                                        isSearchable
                                        isClearable
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                borderColor: "black"
                                            })
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Nama Jabatan : {errors.nama_jabatan && "wajib diisi"}
                            </label>
                            <Controller
                                name="nama_jabatan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="nama_jabatan"
                                        type="text"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Nama Jabatan"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Kode Jabatan : {errors.kode_jabatan && "wajib diisi"}
                            </label>
                            <Controller
                                name="kode_jabatan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="kode_jabatan"
                                        type="text"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Kode Jabatan"
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