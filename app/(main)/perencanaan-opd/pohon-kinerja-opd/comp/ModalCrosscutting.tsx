'use client'

import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/ui/button';
import { AlertNotification } from "@/lib/alert";
import Select from 'react-select';
import { useBrandingContext } from "@/providers/BrandingProvider";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseMasterOpd } from "@/app/(main)/datamaster/opd/type";

interface OptionTypeString {
    value: string;
    label: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    id?: number | null;
    level?: number;
    nama_pohon: string;
    // onSuccess: () => void;
}
interface FormValue {
    id: number;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: OptionTypeString;
    pelaksana: OptionTypeString[];
    indikator: indikator[];
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};

export const ModalAddCrosscutting: React.FC<modal> = ({ isOpen, onClose, id, nama_pohon }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValue>();
    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);

    const fetchOpd = async () => {
        setIsLoading(true);
        try {
            setIsLoading(true);
            await apiFetch(`${branding?.api_perencanaan}/opd/findall`, {
            }).then((resp: any) => {
                const data = resp.data;
                if (data.length > 0) {
                    const opd = data.map((r: GetResponseMasterOpd) => ({
                        value: r.kode_opd,
                        label: r.nama_opd
                    }))
                    setOpdOption(opd);
                } else {
                    setOpdOption([]);
                }
            }).catch(err => {
                AlertNotification("Gagal", `option opd, ${err}`, "error", 3000, true);
            })
        } catch (err) {
            AlertNotification("Gagal", `option opd, ${err}`, "error", 3000, true);
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        setKodeOpd(null);
        onClose();
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            Keterangan: data.keterangan,
            kode_opd: KodeOpd?.value,
            tahun: branding?.tahun?.value?.toString(),
        };
        if (KodeOpd?.value == null || undefined) {
            AlertNotification("pilih opd terlebih dahulu", "", "warning", 1000);
        } else {
            // console.log(formData);
            setProses(true);
            await apiFetch(`${branding?.api_perencanaan}/crosscutting_opd/create/${id}`, {
                method: "POST",
                body: JSON.stringify(formData),
            }).then((_) => {
                AlertNotification("Berhasil", "Berhasil menambahkan crosscutting", "success", 1000);
                onClose();
            }).catch((err) => {
                AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
                console.error(err);
            }).finally(() => {
                setProses(false)
            })
        }
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className={`fixed inset-0 bg-black opacity-30`} onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-3/5 text-start`}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="w-max-[500px] py-2 border-b text-center">
                            Cross Cutting
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                            >
                                Pohon :
                            </label>
                            <div className="border px-4 py-2 rounded-lg">{nama_pohon || "-"}</div>
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_opd"
                            >
                                Perangkat Daerah
                            </label>
                            <Controller
                                name="kode_opd"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Masukkan Perangkat Daerah"
                                            value={KodeOpd}
                                            options={OpdOption}
                                            isLoading={IsLoading}
                                            isSearchable
                                            isClearable
                                            onMenuOpen={() => {
                                                if (OpdOption.length === 0) {
                                                    fetchOpd();
                                                }
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setKodeOpd(option);
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    textAlign: 'start',
                                                    borderColor: "black"
                                                })
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="keterangan"
                            >
                                Keterangan:
                            </label>
                            <Controller
                                name="keterangan"
                                control={control}
                                rules={{ required: "Keterangan harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="keterangan"
                                            placeholder="masukkan keterangan kebutuhan crosscutting ke OPD lain"
                                        />
                                        {errors.keterangan ?
                                            <h1 className="text-red-500">{errors.keterangan.message}</h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*Keterangan Harus Terisi</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                            Simpan
                        </ButtonSky>
                        <ButtonRed className="w-full my-3" onClick={handleClose} disabled={Proses}>
                            Batal
                        </ButtonRed>
                    </form>
                </div>
            </div>
        )
    }
}