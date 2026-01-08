'use client'

import { useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/ui/button";
import { AlertNotification } from "@/lib/alert";
import { LoadingButton } from "@/lib/loading";
import { GetResponseFindallPeriode, FormValue } from "../type";
import { GetResponseGlobal } from "@/types";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: GetResponseFindallPeriode | null
}

export const ModalPeriode: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            tahun_awal: Data?.tahun_awal || "",
            tahun_akhir: Data?.tahun_akhir || "",
            jenis_periode: Data?.jenis_periode || "RPJMD"
        }
    });

    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const handleClose = () => {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            tahun_awal: data.tahun_awal,
            tahun_akhir: data.tahun_akhir,
            jenis_periode: data.jenis_periode,
        };
        // console.log(formData);
        if(data.tahun_awal === data.tahun_akhir){
            AlertNotification("Tahun Sama", "Tahun Awal dengan Tahun Akhir tidak boleh sama", "warning", 2000);
        } else {
            try {
                setProses(true);
                await apiFetch(jenis === "tambah" ? `${branding?.api_perencanaan}/periode/create` : `${branding?.api_perencanaan}/periode/update/${Data?.id}`, {
                    method: jenis === "tambah" ? "POST" : "PUT",
                    body: formData as any
                }).then(_ => {
                    AlertNotification("Berhasil", "Berhasil Menyimpan Data periode", "success", 3000, true);
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
                            <h1 className="text-xl font-semibold uppercase text-center">{jenis} Master Periode</h1>
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="flex items-center gap-1 uppercase text-xs font-bold text-gray-700 my-2">
                                Tahun Awal: {errors.tahun_awal && <p className="text-red-400 font-semibold">{errors.tahun_awal.message}</p>}
                            </label>
                            <Controller
                                name="tahun_awal"
                                control={control}
                                rules={{ required: "wajib terisi" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tahun_awal"
                                        type="text"
                                        placeholder="masukkan Tahun Awal"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="flex items-center gap-1 uppercase text-xs font-bold text-gray-700 my-2">
                                Tahun Akhir: {errors.tahun_akhir && <p className="text-red-400 font-semibold">{errors.tahun_akhir.message}</p>}
                            </label>
                            <Controller
                                name="tahun_akhir"
                                control={control}
                                rules={{ required: "wajib terisi" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="tahun_akhir"
                                        type="text"
                                        placeholder="masukkan Tahun Akhir"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="flex items-center gap-1 uppercase text-xs font-bold text-gray-700 my-2">
                                Jenis Periode: {errors.jenis_periode && <p className="text-red-400 font-semibold">{errors.jenis_periode.message}</p>}
                            </label>
                            <Controller
                                name="jenis_periode"
                                control={control}
                                rules={{ required: "wajib terisi" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="jenis_periode"
                                        type="text"
                                        placeholder="masukkan Jenis Periode"
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