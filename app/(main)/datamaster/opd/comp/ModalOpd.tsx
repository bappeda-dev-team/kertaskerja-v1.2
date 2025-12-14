'use client'

import { useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { ButtonSky, ButtonRed } from "@/components/ui/button";
import { AlertNotification } from "@/lib/alert";
import { LoadingButton } from "@/lib/loading";
import { GetResponseMasterOpd } from "../type";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { FormValue } from "../type";
import { OptionTypeString } from "@/types";
import { GetResponseFindallLembaga } from "../../lembaga/type";

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: GetResponseMasterOpd | null
}

export const ModalOpd: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            id: Data?.id,
            kode_opd: Data?.kode_opd,
            nama_opd: Data?.nama_opd,
            singkatan: Data?.singkatan,
            alamat: Data?.alamat,
            telepon: Data?.telepon,
            fax: Data?.fax,
            email: Data?.email,
            website: Data?.website,
            nama_kepala_opd: Data?.nama_kepala_opd,
            nip_kepala_opd: Data?.nip_kepala_opd,
            pangkat_kepala: Data?.pangkat_kepala,
            id_lembaga: {
                value: Data?.id_lembaga.id,
                label: Data?.id_lembaga.nama_lembaga
            },
        }
    });

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [LembagaOption, setLembagaOption] = useState<OptionTypeString[]>([]);
    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const handleClose = () => {
        onClose();
        reset();
    }

    const fetchLembaga = async () => {
        try {
            setIsLoading(true);
            await apiFetch(`${branding?.api_perencanaan}/lembaga/findall`, {
            }).then((resp: any) => {
                // console.log("option lembaga", resp)
                const data = resp.data;
                if (data.length > 0) {
                    const lembaga = data.map((l: GetResponseFindallLembaga) => ({
                        value: l.id,
                        label: l.nama_lembaga
                    }))
                    setLembagaOption(lembaga);
                } else {
                    setLembagaOption([]);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            })
        } catch (err) {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            kode_opd: data.kode_opd,
            nama_opd: data.nama_opd,
            singkatan: data.singkatan,
            alamat: data.alamat,
            telepon: data.telepon,
            fax: data.fax,
            email: data.email,
            website: data.website,
            nama_kepala_opd: data.nama_kepala_opd,
            nip_kepala_opd: data.nip_kepala_opd,
            pangkat_kepala: data.pangkat_kepala,
            id_lembaga: data?.id_lembaga.value,
        };
        // console.log(formData);
        try {
            setProses(true);
            await apiFetch(jenis === "tambah" ? `${branding?.api_perencanaan}/opd/create` : `${branding?.api_perencanaan}/opd/update/${Data?.id}`, {
                method: jenis === "tambah" ? "POST" : "PUT",
                body: formData as any
            }).then(_ => {
                AlertNotification("Berhasil", "Berhasil Menyimpan Data OPD", "success", 3000, true);
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
                            <h1 className="text-xl font-semibold uppercase text-center">{jenis} OPD</h1>
                        </div>
                        <Controller
                            name="nama_opd"
                            control={control}
                            rules={{required: ""}}
                            render={({ field }) => {
                                return (
                                    <>
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Nama OPD : {errors.nama_opd && <span className="text-red-400 italic">wajib terisi</span>}
                                        </label>
                                        <input
                                            {...field}
                                            id="nama_opd"
                                            type="text"
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder="masukkan Nama OPD"
                                        />
                                    </>
                                )
                            }
                            }
                        />
                        <Controller
                            name="kode_opd"
                            control={control}
                            rules={{required: ""}}
                            render={({ field }) => {
                                return (
                                    <>
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Kode OPD : {errors.kode_opd && <span className="text-red-400 italic">wajib terisi</span>}
                                        </label>
                                        <input
                                            {...field}
                                            id="kode_opd"
                                            type="text"
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder="masukkan kode OPD"
                                        />
                                    </>
                                )
                            }
                            }
                        />
                        <Controller
                            name="nama_kepala_opd"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <>
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Nama Kepala OPD :
                                        </label>
                                        <input
                                            {...field}
                                            id="nama_kepala_opd"
                                            type="text"
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder="masukkan Nama Kepala OPD"
                                        />
                                    </>
                                )
                            }
                            }
                        />
                        <Controller
                            name="nip_kepala_opd"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <>
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            NIP Kepala OPD :
                                        </label>
                                        <input
                                            {...field}
                                            id="nip_kepala_opd"
                                            type="text"
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder="masukkan NIP Kepala OPD"
                                        />
                                    </>
                                )
                            }
                            }
                        />
                        <Controller
                            name="pangkat_kepala"
                            control={control}
                            render={({ field }) => {
                                return (
                                    <>
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Pangkat Kepala OPD :
                                        </label>
                                        <input
                                            {...field}
                                            id="pangkat_kepala"
                                            type="text"
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder="masukkan Pangkat Kepala OPD"
                                        />
                                    </>
                                )
                            }
                            }
                        />
                        <Controller
                            name="id_lembaga"
                            rules={{required: ""}}
                            control={control}
                            render={({ field }) => {
                                return (
                                    <>
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Lembaga : {errors.id_lembaga && <span className="text-red-400 italic">wajib terisi</span>}
                                        </label>
                                        <Select
                                            {...field}
                                            id="id_lembaga"
                                            options={LembagaOption}
                                            onMenuOpen={() => fetchLembaga()}
                                            isLoading={IsLoading}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    borderColor: 'black',
                                                })
                                            }}
                                        />
                                    </>
                                )
                            }
                            }
                        />
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