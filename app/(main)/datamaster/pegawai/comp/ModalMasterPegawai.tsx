'use client'

import { useEffect, useState } from "react";
import { TbDeviceFloppy, TbX, TbCheck } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { ButtonSky, ButtonRed } from "@/components/ui/button";
import { AlertNotification } from "@/lib/alert";
import { LoadingButton } from "@/lib/loading";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { FormValue, GetResponseFindallPegawai } from "../type";
import { OptionTypeString } from "@/types";
import { GetResponseGlobal } from "@/types";

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: GetResponseFindallPegawai | null;
    kode_opd: string;
}

export const ModalMasterPegawai: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data, kode_opd }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nama_pegawai: Data?.nama_pegawai,
            nip: Data?.nip,
            kode_opd: {
                value: branding?.opd?.value,
                label: branding?.opd?.label
            }
        }
    });

    const [Nip, setNip] = useState<string>('');

    const [Plt, setPlt] = useState<boolean>(false);
    const [Pbt, setPbt] = useState<boolean>(false);

    const [Proses, setProses] = useState<boolean>(false);

    const handleClose = () => {
        onClose();
        reset();
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formDataTambah = {
            nama_pegawai: `${data.nama_pegawai} ${Plt ? '(PLT)' : ''} ${Pbt ? "(PBT)" : ""}`,
            nip: `${Plt ? `${data.nip}_plt` : Pbt ? `${data.nip}_pbt` : data.nip}`,
            kode_opd: data.kode_opd?.value,
        }
        const formDataEdit = {
            //key : value
            nama_pegawai: data.nama_pegawai,
            nip: data.nip,
            kode_opd: data?.kode_opd.value,
        };
        const getBody = () => {
            if (jenis === "tambah") return formDataTambah;
            if (jenis === "edit") return formDataEdit;
            return {}; // Default jika jenis tidak sesuai
        };
        // console.log(getBody());
        try {
            setProses(true);
            await apiFetch(jenis === "tambah" ? `${branding?.api_perencanaan}/pegawai/create` : `${branding?.api_perencanaan}/pegawai/update/${Data?.id}`, {
                method: jenis === "tambah" ? "POST" : "PUT",
                body: JSON.stringify(getBody()),
            }).then(_ => {
                AlertNotification("Berhasil", "Berhasil Menyimpan Data Pegawai", "success", 3000, true);
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
                        <div className="w-max-[500px] py-2 mb-2 border-b-2 border-gray-300 text-center uppercase font-bold">
                            {jenis === "tambah" ? "Tambah" : "Edit"} Pegawai
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="_pegawai"
                            >
                                Nama :
                            </label>
                            <Controller
                                name="nama_pegawai"
                                control={control}
                                rules={{ required: "Nama Pegawai harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nama_pegawai"
                                            type="text"
                                            placeholder="masukkan Nama Pegawai"
                                            value={field.value}
                                        />
                                        {errors.nama_pegawai ?
                                            <h1 className="text-red-500">
                                                {errors.nama_pegawai.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*Nama Pegawai Harus Terisi</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="flex flex-col flex-wrap gap-2 uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nip"
                            >
                                NIP :
                                {jenis === "tambah" &&
                                    <div className="flex items-center gap-2">
                                        {Plt ?
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPlt(false)
                                                    setPbt(false)
                                                }}
                                                className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                            >
                                                <TbCheck />
                                            </button>
                                            :
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPlt(true)
                                                    setPbt(false)
                                                }}
                                                className="w-[20px] h-[20px] border border-black rounded-full"
                                            ></button>
                                        }
                                        <p className="text-lg">PLT</p>
                                        {Pbt ?
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPbt(false)
                                                    setPlt(false)
                                                }}
                                                className="w-[20px] h-[20px] bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                            >
                                                <TbCheck />
                                            </button>
                                            :
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPbt(true)
                                                    setPlt(false)
                                                }}
                                                className="w-[20px] h-[20px] border border-black rounded-full"
                                            ></button>
                                        }
                                        <p className="text-lg">PBT</p>
                                    </div>
                                }
                            </label>
                            <Controller
                                name="nip"
                                control={control}
                                rules={{ required: "NIP harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nip"
                                            type="text"
                                            maxLength={18}
                                            placeholder="masukkan NIP"
                                            value={field.value || Nip}
                                            onChange={(e) => {
                                                const newValue = e.target.value.replace(/\s/g, ''); // Hilangkan semua spasi
                                                field.onChange(newValue);
                                                setNip(newValue);
                                            }}
                                        />
                                        {errors.nip ?
                                            <h1 className="text-red-500">
                                                {errors.nip.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*NIP Harus Terisi, Max 18 Digit, centang lingkaran PLT jika pegawai PLT</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_opd"
                            >
                                Perangkat Daerah
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{branding?.opd?.label}</div>
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