'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/ui/button';
import { AlertNotification } from "@/lib/alert";
import Select from 'react-select';
import { LoadingButton } from "@/lib/loading";
import { TbCirclePlus, TbCircleX } from "react-icons/tb";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { GetResponseFindallSubKegiatan } from "@/app/(main)/datamaster/programkegiatan/sub-kegiatan/type";
import { GetResponseGlobal, OptionTypeString } from "@/types";
import { FormValue } from "../type";
import { apiFetch } from "@/hook/apiFetch";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    kode_opd: string;
    tahun: string;
    onSuccess: () => void;
    jenis: "opd" | "all";
}

export const ModalSubKegiatanOpd: React.FC<ModalProps> = ({ isOpen, onClose, kode_opd, tahun, jenis, onSuccess }) => {

    const { control, handleSubmit, reset } = useForm<FormValue>();

    const [SubKegiatan, setSubKegiatan] = useState<OptionTypeString[]>([]);
    const [OptionSubKegiatan, setOptionSubKegiatan] = useState<OptionTypeString[]>([]);

    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const handleClose = () => {
        setSubKegiatan([]);
        setOptionSubKegiatan([]);
        onClose();
        reset();
    };

    const fetchOptionSubKegiatan = async (url: string) => {
        setLoadingOption(true);
        await apiFetch<GetResponseGlobal<GetResponseFindallSubKegiatan[]>>(`${branding?.api_perencanaan}/${url}`, {
            method: "GET",
        }).then((result) => {
            if (jenis === "all") {
                const hasil = result.data;
                const data = hasil.map((item: any) => ({
                    value: item.kode_subkegiatan,
                    label: `${item.kode_subkegiatan} - ${item.nama_sub_kegiatan}`,
                }));
                setOptionSubKegiatan(data);
            } else {
                const hasil = result.data;
                const data = hasil.map((item: any) => ({
                    value: item.kode_subkegiatan,
                    label: `${item.kode_subkegiatan} - ${item.nama_sub_kegiatan}`,
                }));
                setOptionSubKegiatan(data);
            }
        }).catch((err) => {
            console.log(err);
            AlertNotification("Gagal", `${err}`, "error", 2000);
        }).finally(() => {
            setLoadingOption(false);
        })
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const sk = SubKegiatan.map(item => item.value);
        const formData = {
            //key : value
            kode_subkegiatan: sk,
            kode_opd: kode_opd,
            tahun: tahun,
        };
        // console.log(formData);
        setProses(true);
        await apiFetch(`${branding?.api_perencanaan}/subkegiatanopd/create`, {
            method: "POST",
            body: JSON.stringify(formData),
        }).then((result: any) => {
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", `${result.data.message || "Berhasil menambahkan sub kegiatan untuk opd"}`, "success", 1000);
                onClose();
                onSuccess();
            } else {
                console.log(result);
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        }).catch((err) => {
            AlertNotification("Gagal", "Cek koneksi internet / terdapat kesalahan pada server", "error", 2000);
            console.error(err);
        }).finally(() => {
            setProses(false);
        })
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
            <div className="bg-white rounded-lg p-8 z-10 w-3/5 max-h-[80%] text-start">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-max-[500px] py-2 border-b font-bold text-center">
                        Tambah Sub Kegiatan OPD {jenis === "all" ? "(Semua OPD)" : ""}
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="kode_subkegiatan"
                        >
                            Sub Kegiatan :
                        </label>
                        <Controller
                            name="kode_subkegiatan"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Sub Kegiatan dari Data Master"
                                        options={OptionSubKegiatan}
                                        isLoading={LoadingOption}
                                        isSearchable
                                        isClearable
                                        isMulti
                                        value={SubKegiatan}
                                        onMenuOpen={() => {
                                            if (jenis === "opd") {
                                                fetchOptionSubKegiatan(`${branding?.api_perencanaan}/subkegiatanopd/bidangurusan/${kode_opd}`);
                                            } else {
                                                fetchOptionSubKegiatan(`${branding?.api_perencanaan}/sub_kegiatan/findall`);
                                            }
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setSubKegiatan(option as OptionTypeString[]);
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            }),
                                            menuPortal: (base) => ({
                                                ...base, zIndex: 9999
                                            })
                                        }}
                                    />
                                </>
                            )}
                        />
                    </div>
                    <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                        {Proses ?
                            <span className="flex items-center gap-1">
                                <LoadingButton />
                                Menambahkan
                            </span>
                            :
                            <span className="flex items-center gap-1">
                                <TbCirclePlus />
                                Simpan
                            </span>
                        }
                    </ButtonSky>
                    <ButtonRed type="button" className="w-full my-3 flex items-center gap-1" onClick={handleClose} disabled={Proses}>
                        <TbCircleX />
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    );
};
