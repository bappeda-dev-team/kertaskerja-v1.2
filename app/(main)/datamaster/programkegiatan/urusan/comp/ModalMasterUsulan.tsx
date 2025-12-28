'use client'

import { useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/ui/button";
import { AlertNotification } from "@/lib/alert";
import { LoadingButton } from "@/lib/loading";
import { GetResponseFindallUrusan } from "../type";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: GetResponseFindallUrusan | null
}
interface FormValue {
    id: string;
    nama_urusan: string;
    kode_urusan: number;
}

export const ModalUrusan: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            id: Data?.id,
            nama_urusan: Data?.nama_urusan,
            kode_urusan: Data?.kode_urusan,
        }
    });

    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const handleClose = () => {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            id: Data?.id,
            nama_urusan: data.nama_urusan,
            kode_urusan: data.kode_urusan,
        };
        // console.log(formData);
        try {
            setProses(true);
            await apiFetch(jenis === "tambah" ? `${branding?.api_perencanaan}/urusan/create` : `${branding?.api_perencanaan}/urusan/update/${Data?.id}`, {
                method: jenis === "tambah" ? "POST" : "PUT",
                body: formData as any
            }).then(_ => {
                AlertNotification("Berhasil", "Berhasil Menyimpan Data Urusan", "success", 3000, true);
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
                            <h1 className="text-xl font-semibold uppercase text-center">{jenis} Urusan</h1>
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Nama Urusan : {errors.nama_urusan && "wajib diisi"}
                            </label>
                            <Controller
                                name="nama_urusan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="nama_urusan"
                                        type="text"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Nama Urusan"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                Kode Urusan : {errors.kode_urusan && "wajib diisi"}
                            </label>
                            <Controller
                                name="kode_urusan"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="kode_urusan"
                                        type="text"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Kode Urusan"
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