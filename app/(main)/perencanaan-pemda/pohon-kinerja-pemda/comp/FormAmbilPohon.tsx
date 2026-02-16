'use client'

import React, { useState } from 'react';
import { ButtonSky, ButtonRed } from '@/components/ui/button';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AlertNotification } from '@/lib/alert';
import Select from 'react-select';
import { LoadingButton } from '@/lib/loading';
import { Pohon } from './Pohon';
import { TbCheck } from 'react-icons/tb';
import { OptionTypeString } from '@/types';
import { FormValue } from '../type';
import { OptionType } from '@/types';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { apiFetch } from '@/hook/apiFetch';
import { GetResponseMasterOpd } from '@/app/(main)/datamaster/opd/type';

export const FormAmbilPohon: React.FC<{
    id: number;
    level: number;
    onCancel: () => void
}> = ({ id, level, onCancel }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, formState: { errors } } = useForm<FormValue>();

    const [KodeOpd, setKodeOpd] = useState<OptionTypeString | null>(null);
    const [PohonOpd, setPohonOpd] = useState<OptionType | null>(null);
    const [Turunan, setTurunan] = useState<boolean>(false);

    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [PohonOption, setPohonOption] = useState<OptionType[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [IsAdded, setIsAdded] = useState<boolean>(false);
    const [DataAdd, setDataAdd] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);

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
    const fetchPohon = async (SelectedOpd: string) => {
        try {
            const url =
                (level === 0 || level === 1 || level === 2 || level === 3)
                    ? `pohon_kinerja_opd/strategic_no_parent/${SelectedOpd}/${branding?.tahun?.value}`
                    : level === 4
                        ? `pohon_kinerja/tactical/${SelectedOpd}/${branding?.tahun?.value}`
                        : level === 5
                            ? `pohon_kinerja/operational/${SelectedOpd}/${branding?.tahun?.value}`
                            : `unknown`;
            setIsLoading(true);
            await apiFetch(`${branding?.api_perencanaan}/${url}`, {
                method: "GET",
            }).then((resp: any) => {
                if (level === 0 || level === 1 || level === 2 || level === 3) {
                    const pohon = resp.data.map((item: any) => ({
                        value: item.id,
                        label: item.nama_pohon,
                    }));
                    setPohonOption(pohon);
                } else if (level === 4 || level === 5) {
                    const pohon = resp.data.map((item: any) => ({
                        value: item.id,
                        label: item.nama_pohon,
                    }));
                    setPohonOption(pohon);
                }
            })
        } catch (err) {
            console.log('gagal mendapatkan data pohon');
            AlertNotification("Error", "gagal mendapatkan data pohon", "error", 2000);
        } finally {
            setIsLoading(false);
        }
    };
    const handleTurunan = () => {
        if (Turunan) {
            setTurunan(false);
        } else {
            setTurunan(true);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            id: data.pohon?.value,
            turunan: Turunan,
            parent: id,
        };
        // console.log(formData);
        try {
            setProses(true);
            await apiFetch(`${branding?.api_perencanaan}/pohon_kinerja_admin/clone_strategic/create`, {
                method: "POST",
                body: JSON.stringify(formData),
            }).then((result: any) => {
                if (result.code === 200 || result.code === 201) {
                    AlertNotification("Berhasil", "Berhasil mengambil pohon dari OPD", "success", 1000);
                    setIsAdded(true);
                    const data = result.data;
                    setDataAdd(data);
                    console.log(result);
                } else {
                    AlertNotification("Gagal", `${result.data}`, "error", 2000);
                }
            })
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    return (
        <React.Fragment>
            {IsAdded && DataAdd ?
                <Pohon
                    tema={DataAdd}
                    deleteTrigger={() => setDeleted((prev) => !prev)}
                    set_show_all={() => null}
                />
                :
                <li>
                    <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500 form-ambil">
                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                            {(level === 0 || level === 1 || level === 2 || level === 3) &&
                                <h1>Ambil Strategic </h1>
                            }
                            {level === 4 &&
                                <h1>Ambil Tactical </h1>
                            }
                            {level === 5 &&
                                <h1>Ambil Operational </h1>
                            }
                        </div>
                        <div className="flex justify-center my-3 w-full">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className='w-full'
                            >
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
                                                    isLoading={isLoading}
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
                                                        })
                                                    }}
                                                />
                                            </>
                                        )}
                                    />
                                </div>
                                {KodeOpd &&
                                    <>
                                        <div className="flex flex-col py-3">
                                            <label
                                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                                htmlFor="pohon"
                                            >
                                                {(level === 0 || level === 1 || level === 2 || level === 3) &&
                                                    <h1>Strategic</h1>
                                                }
                                                {level == 4 &&
                                                    <h1>Tactical</h1>
                                                }
                                                {level == 5 &&
                                                    <h1>Operational</h1>
                                                }
                                            </label>
                                            <Controller
                                                name="pohon"
                                                control={control}
                                                rules={{ required: "Pohon Harus Terisi" }}
                                                render={({ field }) => (
                                                    <>
                                                        <Select
                                                            {...field}
                                                            placeholder="Pilih Pohon"
                                                            value={PohonOpd}
                                                            options={PohonOption}
                                                            isLoading={isLoading}
                                                            isSearchable
                                                            isClearable
                                                            onMenuOpen={() => {
                                                                if (KodeOpd?.value != null) {
                                                                    fetchPohon(KodeOpd?.value);
                                                                } else if (KodeOpd?.value == null) {
                                                                    setPohonOption([]);
                                                                    setPohonOpd(null);
                                                                }
                                                            }}
                                                            onChange={(option) => {
                                                                field.onChange(option);
                                                                setPohonOpd(option);
                                                            }}
                                                            styles={{
                                                                control: (baseStyles) => ({
                                                                    ...baseStyles,
                                                                    borderRadius: '8px',
                                                                    textAlign: 'start',
                                                                })
                                                            }}
                                                        />
                                                        {errors.pohon ?
                                                            <h1 className="text-red-500">
                                                                {errors.pohon.message}
                                                            </h1>
                                                            :
                                                            <h1 className="text-slate-300 text-xs">*Pohon Harus Terisi</h1>
                                                        }
                                                    </>
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="flex items-center justify-center gap-2 py-3 cursor-pointer">
                                                {Turunan ?
                                                    <button
                                                        type="button"
                                                        onClick={handleTurunan}
                                                        className="w-5 h-5 bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                                    >
                                                        <TbCheck />
                                                    </button>
                                                    :
                                                    <button
                                                        type="button"
                                                        onClick={handleTurunan}
                                                        className="w-5 h-5 border border-black rounded-full"
                                                    ></button>
                                                }
                                                <p onClick={handleTurunan} className={`${Turunan && 'text-emerald-500'}`}>Turunan</p>
                                            </div>
                                            <h1 className="text-slate-400 text-xs">*Jika di centang, turunan pohon tersebut akan ikut terambil</h1>
                                        </div>
                                        <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                                            {Proses ?
                                                <span className="flex">
                                                    <LoadingButton />
                                                    Menyimpan...
                                                </span>
                                                :
                                                "Simpan"
                                            }
                                        </ButtonSky>
                                    </>
                                }
                                <ButtonRed className="w-full my-3" onClick={onCancel} disabled={Proses}>
                                    Batal
                                </ButtonRed>
                            </form>
                        </div>
                    </div>
                </li>
            }
        </React.Fragment>
    );
};