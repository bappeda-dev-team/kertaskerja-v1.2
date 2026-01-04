'use client'

import { useState } from "react";
import { TbCirclePlus, TbDeviceFloppy, TbTrash, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonRedBorder, ButtonSkyBorder } from "@/components/ui/button";
import { AlertNotification } from "@/lib/alert";
import { LoadingButton } from "@/lib/loading";
import { FormValue, Tematiks, Indikator, Target } from "../type";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { OptionTypeString } from "@/types";

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: Tematiks | null
}

export const ModalTematik: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const { branding } = useBrandingContext();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nama_pohon: Data?.tema || '',
            keterangan: Data?.keterangan || '',
            tahun: String(branding?.tahun?.value),
            indikator: Data?.indikator?.map((item: Indikator) => ({
                nama_indikator: item.nama_indikator,
                targets: item.targets.map((t: Target) => ({
                    target: t.target,
                    satuan: t.satuan,
                })),
            })),
        }
    });

    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const [OptionOpd, setOptionOpd] = useState<OptionTypeString[]>([]);

    const handleClose = () => {
        onClose();
        reset();
    }

    const { fields, append, remove } = useFieldArray({
        control,
        name: "indikator",
    });

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            nama_pohon: data.nama_pohon,
            jenis_pohon: "Tematik",
            level_pohon: 0,
            keterangan: data.keterangan,
            tahun: String(branding?.tahun?.value),
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
        };
        // console.log(formData);
        try {
            setProses(true);
            await apiFetch(jenis === "tambah" ? `${branding?.api_perencanaan}/pohon_kinerja_admin/create` : `${branding?.api_perencanaan}/pohon_kinerja_admin/update/${Data?.id}`, {
                method: jenis === "tambah" ? "POST" : "PUT",
                body: formData as any
            }).then(_ => {
                AlertNotification("Berhasil", "Berhasil Menyimpan Tematik", "success", 3000, true);
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
                            <h1 className="text-xl font-semibold uppercase text-center">{jenis} Tematik</h1>
                        </div>
                        <Controller
                            name="nama_pohon"
                            control={control}
                            rules={{ required: "" }}
                            render={({ field }) => {
                                return (
                                    <div className="flex flex-col py-3">
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Nama Tematik : {errors.nama_pohon && "wajib diisi"}
                                        </label>
                                        <input
                                            {...field}
                                            id="nama_pohon"
                                            placeholder="Pilih Nama Tematik"
                                            className="border px-4 py-2 rounded-lg"
                                        />
                                    </div>
                                )
                            }}
                        />
                        <label className="uppercase text-base font-bold text-gray-700 my-2">
                            indikator tematik :
                        </label>
                        {fields.map((field, index) => (
                            <div key={index} className="flex flex-col my-2 py-2 px-5 border rounded-lg">
                                <Controller
                                    name={`indikator.${index}.nama_indikator`}
                                    control={control}
                                    defaultValue={field.nama_indikator}
                                    render={({ field }) => (
                                        <div className="flex flex-col py-3">
                                            <div className="flex items-center justify-between gap-1 mb-2">
                                                <label className="uppercase text-xs font-bold text-gray-700">
                                                    Nama Indikator {index + 1} :
                                                </label>
                                                {index >= 0 && (
                                                    <p className="p-1 rounded-full border border-red-500 text-red-500 cursor-pointer hover:bg-red-800 hover:text-white" onClick={() => remove(index)}>
                                                        <TbTrash />
                                                    </p>
                                                )}
                                            </div>
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                placeholder={`Masukkan nama indikator ${index + 1}`}
                                            />
                                        </div>
                                    )}
                                />
                                {field.targets.map((_, subindex) => (
                                    <>
                                        <Controller
                                            name={`indikator.${index}.targets.${subindex}.target`}
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
                                            name={`indikator.${index}.targets.${subindex}.satuan`}
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
                                    </>
                                ))}
                            </div>
                        ))}
                        <ButtonSkyBorder
                            className="mb-3 mt-2 w-full flex items-center gap-1"
                            type="button"
                            onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                        >
                            <TbCirclePlus />
                            Tambah Indikator
                        </ButtonSkyBorder>
                        <Controller
                            name="keterangan"
                            control={control}
                            rules={{ required: "" }}
                            render={({ field }) => {
                                return (
                                    <div className="flex flex-col py-3">
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Ketarangan : {errors.keterangan && "wajib diisi"}
                                        </label>
                                        <textarea
                                            {...field}
                                            id="keterangan"
                                            placeholder="Pilih Ketarangan"
                                            className="border px-4 py-2 rounded-lg"
                                        />
                                    </div>
                                )
                            }}
                        />
                        <div className="flex flex-col gap-1 mt-3">
                            <ButtonSky type="submit" className="w-full" disabled={Proses}>
                                {Proses ?
                                    <div className="flex items-center gap-1">
                                        <LoadingButton />
                                        <span>menyimpan..</span>
                                    </div>
                                    :
                                    <div className="flex items-center gap-1">
                                        <TbDeviceFloppy />
                                        <span>Simpan</span>
                                    </div>
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