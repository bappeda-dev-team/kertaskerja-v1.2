'use client'

import { useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/ui/button";
import { AlertNotification } from "@/lib/alert";
import { LoadingButton } from "@/lib/loading";
import { GetResponseFindallLembaga } from "../type";

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: GetResponseFindallLembaga
}
interface FormValue {
    id: string;
    id_lembaga: number;
    nama_lembaga: string;
    kode_lembaga: string;
}

export const ModalClone: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            id: Data?.id,
            id_lembaga: Data?.id_lembaga,
            nama_lembaga: Data?.nama_lembaga,
            kode_lembaga: Data?.kode_lembaga
        }
    });

    const handleClose = () => {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_lembaga: data.nama_lembaga,
            kode_lembaga: data.kode_lembaga,
        };
        // console.log(formData);
        try {
            const response = await fetch(`${API_URL}/lembaga/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menambahkan data master lembaga", "success", 1000);
                router.push("/DataMaster/masterlembaga");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
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
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_lembaga"
                            >
                                Nama Lembaga :
                            </label>
                            <Controller
                                name="nama_lembaga"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="nama_lembaga"
                                        type="text"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Nama Lembaga"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_lembaga"
                            >
                                Kode Lembaga :
                            </label>
                            <Controller
                                name="kode_lembaga"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="kode_lembaga"
                                        type="text"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Kode Lembaga"
                                    />
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full my-3" disabled={proses}>
                            {proses ?
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
                        <ButtonRed className="flex items-center gap-1 w-full my-3" onClick={handleClose} disabled={proses}>
                            <TbX />
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}