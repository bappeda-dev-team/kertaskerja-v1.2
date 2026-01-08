'use client'

import { useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from "@/components/ui/button";
import { AlertNotification } from "@/lib/alert";
import { LoadingButton } from "@/lib/loading";
import { GetResponseFindAllVisi, FormValue, OptionPeriode } from "../type";
import { GetResponseGlobal } from "@/types";
import { GetResponseFindallPeriode } from "@/app/(main)/datamaster/periode/type";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";
import Select from "react-select";

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: GetResponseFindAllVisi | null
}

export const ModalVisi: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            id: Data?.id || 0,
            visi: Data?.visi || "",
            periode: Data?.jenis_periode ? {
                label: `${Data?.tahun_awal_periode} - ${Data?.tahun_akhir_periode} (${Data?.jenis_periode})`,
                value: `${Data?.tahun_awal_periode} - ${Data?.tahun_akhir_periode} (${Data?.jenis_periode})`,
                tahun_akhir: Data?.tahun_akhir_periode,
                tahun_awal: Data?.tahun_awal_periode,
                jenis_periode: Data?.jenis_periode,
            } : null,
            keterangan: Data?.keterangan || "",
        }
    });

    const [OptionPeriode, setOptionPeriode] = useState<OptionPeriode[]>([]);

    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const handleClose = () => {
        onClose();
        reset();
    }

    const getOptionPeriode = async () => {
        setLoadingOption(true);
        await apiFetch<GetResponseGlobal<GetResponseFindallPeriode[]>>(`${branding?.api_perencanaan}/periode/findall`, {
            method: "GET",
        }).then((resp) => {
            const data = resp.data;
            if (resp.code === 200) {
                const periode = data.map((p: GetResponseFindallPeriode) => ({
                    ...p,
                    label: `${p.tahun_awal} - ${p.tahun_akhir} (${p.jenis_periode})`,
                    value: `${p.tahun_awal} - ${p.tahun_akhir} (${p.jenis_periode})`,
                }));
                setOptionPeriode(periode);
            } else {
                setOptionPeriode([]);
            }
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setLoadingOption(false);
        })
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            id: Data?.id,
            visi: data.visi,
            tahun_awal_periode: data.periode?.tahun_awal,
            tahun_akhir_periode: data.periode?.tahun_akhir,
            jenis_periode: data.periode?.jenis_periode,
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
                            <h1 className="text-xl font-semibold uppercase text-center">{jenis} Visi Pemda</h1>
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="flex items-center gap-1 uppercase text-xs font-bold text-gray-700 my-2">
                                Visi : {errors.visi && <p className="text-red-400 font-semibold">{errors.visi.message}</p>}
                            </label>
                            <Controller
                                name="visi"
                                control={control}
                                rules={{ required: "wajib diisi" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        id="visi"
                                        type="text"
                                        className="border px-4 py-2 rounded-lg"
                                        placeholder="masukkan Visi"
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label className="flex items-center gap-1 uppercase text-xs font-bold text-gray-700 my-2">
                                Periode (tahun awal/tahun akhir/jenis periode) : {errors.periode && <p className="text-red-400 font-semibold">{errors.periode.message}</p>}
                            </label>
                            <Controller
                                name="periode"
                                control={control}
                                rules={{ required: "wajib diisi" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Pilih Periode"
                                        options={OptionPeriode}
                                        isLoading={LoadingOption}
                                        isSearchable
                                        isClearable
                                        onMenuOpen={() => {
                                            getOptionPeriode();
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