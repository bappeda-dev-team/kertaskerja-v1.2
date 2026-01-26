'use client'
import React, { useEffect, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { ButtonRedBorder, ButtonGreenBorder } from "@/components/ui/button"
import { TbCircleX, TbDeviceFloppy } from "react-icons/tb"
import { useBrandingContext } from "@/providers/BrandingProvider"
import { AlertNotification } from "@/lib/alert"
import { Childs } from "./Table"
import { apiFetch } from "@/hook/apiFetch"
import { LoadingButton } from "@/lib/loading"

interface FormPermasalahan {
    data?: Childs;
    rowSpan: number;
    tahun: string;
    jenis: "edit" | "baru" | "";
    editing: () => void;
}
interface Childs {
    id: number;
    id_permasalahan: number;
    nama_pohon: string;
    level_pohon: number;
    perangkat_daerah: {
        kode_opd: string;
        nama_opd: string;
    }
    is_permasalahan: boolean;
    jenis_masalah: string;
}
interface FormValue {
    pokin_id: number;
    permasalahan: string;
    level_pohon: number;
    jenis_masalah: string;
    kode_opd: string;
    nama_opd: string;
    tahun: string;
}

export const FormPermasalahan: React.FC<FormPermasalahan> = ({ data, tahun, jenis, rowSpan, editing }) => {

    const { branding } = useBrandingContext();
    const [Proses, setProses] = useState<boolean>(false);
    const [Success, setSuccess] = useState<boolean>(false);
    const [DataResult, setDataResult] = useState<any>(null);
    const kode_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;
    const nama_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.label : branding?.user?.nama_opd;

    const { control, reset, handleSubmit } = useForm<FormValue>({
        defaultValues: {
            pokin_id: data?.id || 0,
            permasalahan: data?.nama_pohon || "-",
            level_pohon: data?.level_pohon || 0,
            jenis_masalah: data?.jenis_masalah || "-",
            kode_opd: branding?.opd?.value,
            tahun: tahun,
        }
    })

    const onSubmit: SubmitHandler<FormValue> = async (dataForm) => {
        const formData = {
            ...(jenis === "baru" && {
                pokin_id: data?.id,
            }),
            ...(jenis === "edit" && {
                id: data?.id_permasalahan,
            }),
            permasalahan: dataForm.permasalahan,
            level_pohon: data?.level_pohon,
            jenis_masalah: data?.level_pohon === 4 ? "MASALAH_POKOK" :
                data?.level_pohon === 5 ? "MASALAH" :
                    data?.level_pohon === 6 ? "AKAR_MASALAH" : "",
            kode_opd: kode_opd,
            nama_opd: nama_opd,
            tahun: tahun,
        }
        // console.log(formData);
        let url = '';
        if (jenis === 'baru') {
            url = `permasalahan`
        } else if (jenis === 'edit') {
            url = `permasalahan/${data?.id_permasalahan}`
        }
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/${url}`, {
            method: jenis === "baru" ? "POST" : "PUT",
            body: JSON.stringify(formData),
        }).then((result: any) => {
            if (result.code === 200) {
                setSuccess(true);
                setDataResult(result.data);
                AlertNotification("Berhasil", `data permasalahan berhasil di simpan`, "success", 1000);
            } else {
                setSuccess(false);
                setDataResult(null);
                AlertNotification("Gagal", `${result.data}`, "error", 5000, true);
            }
        }).catch((err) => {
            AlertNotification("Gagal", `${err}`, "error", 5000, true);
            console.error(err);
        }).finally(() => {
            setProses(false);
        })
    }

    const handleClose = () => {
        reset();
        editing();
    }

    return (
        <React.Fragment>
            {Success && DataResult ?
                <Childs
                    data={DataResult}
                    rowSpan={rowSpan}
                    tahun={tahun}
                />
                :
                <td rowSpan={rowSpan} colSpan={2} className="border-r border-b border-black px-6 py-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="permasalahan"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    id="permasalahan"
                                    className="w-full p-3 rounded-lg mb-3 border border-black"
                                />
                            )}
                        />
                        <div className="flex justify-center items-center gap-2">
                            <ButtonGreenBorder
                                className="w-full"
                                type="submit"
                                disabled={Proses}
                            >
                                <div className="flex items-center gap-1">
                                    {Proses ?
                                        <>
                                            <LoadingButton />
                                            Menyimpan
                                        </>
                                        :
                                        <>
                                            <TbDeviceFloppy className="mr-1" />
                                            Simpan
                                        </>
                                    }
                                </div>
                            </ButtonGreenBorder>
                            <ButtonRedBorder
                                className="w-full"
                                type="button"
                                onClick={handleClose}
                                disabled={Proses}
                            >
                                <TbCircleX className="mr-1" />
                                Batal
                            </ButtonRedBorder>
                        </div>
                    </form>
                </td>
            }
        </React.Fragment>
    )
}