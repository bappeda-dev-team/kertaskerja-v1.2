'use client'

import { useState, useEffect } from 'react';
import { ButtonSky, ButtonRed } from '@/components/ui/button';
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { AlertNotification } from '@/lib/alert';
import Select from 'react-select';
import { PohonCascadingEdited } from './PohonCascading';
import { LoadingButton } from '@/lib/loading';
import { apiFetch } from '@/hook/apiFetch';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { OptionType, OptionTypeString } from '@/types';

interface FormValue {
    id: number;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: OptionTypeString;
    kode_opd: OptionTypeString;
    pelaksana: OptionTypeString[];
    pohon?: OptionType;
    indikator: indikator[];
    tagging: Tagging[];
}
interface Tagging {
    nama_tagging: string;
    keterangan_tagging: string;
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};
interface form {
    formId: number;
    onSave: [
        { data: any },
        { id: number }
    ];
    onCancle: () => void;
}

export const FormEditCascading: React.FC<{
    formId: number;
    id: number;
    level: number;
    onCancel: () => void
    pokin: 'pemda' | 'opd';
    EditBerhasil: (data: any) => void;
}> = ({ id, level, onCancel, pokin, EditBerhasil }) => {

    const { branding } = useBrandingContext();
    const kode_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;
    const { control, handleSubmit, reset } = useForm<FormValue>();
    const [Status, setStatus] = useState<string>('');
    const [Parent, setParent] = useState<number | null>(null);
    const [KodeOpd, setKodeOpd] = useState<number | null>(null);
    const [JenisPohon, setJenisPohon] = useState<string | null>(null);
    const [Tagging, setTagging] = useState<Tagging[]>([]);
    const [Pelaksana, setPelaksana] = useState<OptionTypeString[]>([]);
    const [PelaksanaOption, setPelaksanaOption] = useState<OptionTypeString[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [LoadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [IsEdited, setIsEdited] = useState<boolean>(false);
    const [DataEdit, setDataEdit] = useState<any>(null);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);

    const { replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const fetchPelaksana = async (role: string) => {
        setIsLoading(true);
        await apiFetch(`${branding?.api_perencanaan}/user/findbykodeopdandrole?kode_opd=${kode_opd}&role=${role}`, {
            method: "GET"
        }).then((data: any) => {
            if (data == null) {
                setPelaksanaOption([]);
                console.log(`data user dengan ${role} tidak ditemukan`)
            } else {
                const opd = data.data.map((item: any) => ({
                    value: item.pegawai_id,
                    label: item.nama_pegawai,
                }));
                setPelaksanaOption(opd);
            }
        }).catch((err) => {
            console.log(`error saat mendapatkan data user ${role}`);
            console.error(err);
        }).finally(() => {
            setIsLoading(false);
        })
    };
    const fetchPelaksanaAll = async () => {
        setIsLoading(true);
        await apiFetch(`${branding?.api_perencanaan}/pegawai/findall?kode_opd=${kode_opd}`, {
            method: "GET"
        }).then((data: any) => {
            const opd = data.data.map((item: any) => ({
                value: item.id,
                label: item.nama_pegawai,
            }));
            setPelaksanaOption(opd);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setIsLoading(false);
        })
    };

    useEffect(() => {
        const fetchStrategic = async () => {
            setLoadingDetail(true);
            await apiFetch(`${branding?.api_perencanaan}/pohon_kinerja_opd/detail/${id}`, {
                method: "GET"
            }).then((result: any) => {
                const data = result.data;
                if (data.parent) {
                    setParent(data.parent);
                }
                if (data.kode_opd) {
                    setKodeOpd(data.kode_opd);
                }
                if (data.jenis_pohon) {
                    setJenisPohon(data.jenis_pohon);
                }
                if (data.status) {
                    setStatus(data.status);
                }
                if (data.tagging) {
                    setTagging(data.tagging);
                }
                reset({
                    nama_pohon: data.nama_pohon || '',
                    keterangan: data.keterangan || '',
                    parent: data.parent || '',
                    pelaksana: data.pelaksana?.map((item: any) => ({
                        value: item.pegawai_id,
                        label: item.nama_pegawai,
                    })) || [],
                    indikator: data.indikator?.map((item: indikator) => ({
                        nama_indikator: item.nama_indikator,
                        targets: item.targets.map((t: target) => ({
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })),
                    tagging: data.tagging,
                });
                setPelaksana(
                    data.pelaksana?.map((item: any) => ({
                        value: item.pegawai_id,
                        label: item.nama_pegawai,
                    })) || []
                );
            }).catch((err) => {
                console.error(err, 'gagal mengambil data sesuai id pohon')
            }).finally(() => {
                setLoadingDetail(false);
            })
        }
        fetchStrategic();
    }, [id, reset, branding, replace]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const pelaksanaIds = Pelaksana?.map((pelaksana) => ({
            pegawai_id: pelaksana.value, // Ubah `value` menjadi `pegawai_id`
        })) || [];
        const formData = {
            //key : value
            nama_pohon: data.nama_pohon,
            Keterangan: data.keterangan,
            jenis_pohon: JenisPohon,
            level_pohon: level,
            parent: Number(Parent),
            pelaksana: pelaksanaIds,
            tahun: branding?.tahun?.value?.toString(),
            kode_opd: KodeOpd,
            status: Status,
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
            tagging: Tagging,
        };
        // console.log(formData);
        await apiFetch(`${branding?.api_perencanaan}/pohon_kinerja_admin/update/${id}`, {
            method: "PUT",
            body: JSON.stringify(formData),
        }).then((result: any) => {
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil edit pohon", "success", 1000);
                const berhasil = true;
                const data = result.data;
                if (berhasil) {
                    EditBerhasil(data);
                }
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        }).catch((err) => {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            console.log(err);
        }).finally(() => {
            setProses(false);
        })
    };

    return (
        <>
            {IsEdited && DataEdit ?
                <PohonCascadingEdited
                    tema={DataEdit}
                    deleteTrigger={() => setDeleted((prev) => !prev)}
                    set_show_all={() => null}
                />
                :
                <div className="tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg shadow-slate-500">
                    <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                        Edit Pelaksana
                    </div>
                    <div className="flex justify-center my-3 w-full">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className='w-full'
                        >
                            {pokin === 'opd' &&
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="pelaksana"
                                    >
                                        Pelaksana
                                    </label>
                                    <Controller
                                        name="pelaksana"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    placeholder="Pilih Pelaksana (bisa lebih dari satu)"
                                                    value={Pelaksana}
                                                    options={PelaksanaOption}
                                                    isLoading={isLoading}
                                                    isSearchable
                                                    isClearable
                                                    isMulti
                                                    onMenuOpen={() => {
                                                        if (PelaksanaOption.length === 0) {
                                                            if (level === 4) {
                                                                fetchPelaksana('level_1');
                                                            } else if (level === 5) {
                                                                fetchPelaksana('level_2');
                                                            } else if (level === 6) {
                                                                fetchPelaksana('level_3');
                                                            } else if (level >= 7) {
                                                                fetchPelaksana('level_4');
                                                            } else {
                                                                fetchPelaksanaAll();
                                                            }
                                                        }
                                                    }}
                                                    onChange={(option) => {
                                                        field.onChange(option || []);
                                                        setPelaksana(option as OptionTypeString[]);
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
                            }
                            <ButtonSky type="submit" className="w-full my-3" disabled={Proses || LoadingDetail}>
                                {(Proses) ?
                                    <span className="flex">
                                        <LoadingButton />
                                        Menyimpan...
                                    </span>
                                    :
                                    "Simpan"
                                }
                            </ButtonSky>
                            <ButtonRed className="w-full my-3" onClick={onCancel} disabled={Proses || LoadingDetail}>
                                Batal
                            </ButtonRed>
                        </form>
                    </div>
                </div>
            }
        </>
    );
};
