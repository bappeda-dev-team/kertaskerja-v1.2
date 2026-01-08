'use client'

import React, { useState, useEffect } from 'react';
import { ButtonSky, ButtonRed, ButtonRedBorder, ButtonSkyBorder } from '@/components/ui/button';
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { AlertNotification } from '@/lib/alert';
import Select from 'react-select';
import { Pohon } from './Pohon';
import { LoadingButton, LoadingSync } from '@/lib/loading';
import { TbCheck, TbDeviceFloppy, TbCircleX, TbCirclePlus } from 'react-icons/tb';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { apiFetch } from '@/hook/apiFetch';
import { GetResponseMasterOpd } from '@/app/(main)/datamaster/opd/type';
import { eventNames } from 'process';

interface OptionTypeString {
    value: string;
    label: string;
}
interface OptionType {
    value: number;
    label: string;
}
interface FormValue {
    id: number;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: OptionTypeString | null;
    pelaksana: OptionTypeString[];
    pohon?: OptionType;
    indikator: indikator[];
    tagging: Tagging[];
}
interface Tagging {
    nama_tagging: string;
    keterangan_tagging_program: KeteranganTaggingProgram[];
}
interface KeteranganTaggingProgram {
    kode_program_unggulan: OptionTypeString | null;
    tahun: string;
}
interface indikator {
    nama_indikator: string;
    targets: target[];
}
type target = {
    target: string;
    satuan: string;
};

export const FormPohonPemda: React.FC<{
    formId: number;
    id: number | null;
    level: number;
    onCancel?: () => void
    jenis: "tambah" | "edit";
    EditBerhasil: (data: any) => void;
}> = ({ id, level, formId, onCancel, jenis, EditBerhasil }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValue>();
    const [BupatiValue, setBupatiValue] = useState<OptionTypeString[]>([]);
    const [HariKerjaValue, setHariKerjaValue] = useState<OptionTypeString[]>([]);
    const [PusatValue, setPusatValue] = useState<OptionTypeString[]>([]);
    const [OpdOption, setOpdOption] = useState<OptionTypeString[]>([]);
    const [ProgramOption, setProgramOption] = useState<OptionTypeString[]>([]);
    const [DataAdd, setDataAdd] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [UnggulanBupati, setUnggulanBupati] = useState<boolean>(false);
    const [HariKerja, setHariKerja] = useState<boolean>(false);
    const [UnggulanPusat, setUnggulanPusat] = useState<boolean>(false);
    const [IsAdded, setIsAdded] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);

    const [Proses, setProses] = useState<boolean>(false);
    const [ProsesDetail, setProsesDetail] = useState<boolean>(false);
    const [ErrorDetail, setErrorDetail] = useState<boolean>(false);

    const { branding } = useBrandingContext();

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    const fetchOpd = async () => {
        setIsLoading(true);
        try {
            setIsLoading(true);
            await apiFetch(`${branding?.api_perencanaan}/opd/findall`, {
            }).then((resp: any) => {
                // console.log("option role", resp)
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
    const fetchProgramUnggulan = async () => {
        try {
            setIsLoading(true);
            await apiFetch(`${branding?.api_perencanaan}/program_unggulan/findbytahun/${branding?.tahun?.value}`, {
            }).then((resp: any) => {
                if (resp == null) {
                    setProgramOption([]);
                    console.log(`data program unggulan belum di tambahkan / kosong`)
                } else {
                    const program = resp.data.map((item: any) => ({
                        value: item.kode_program_unggulan,
                        label: `${item.nama_program_unggulan} - ${item.rencana_implementasi}`,
                    }));
                    setProgramOption(program);
                }
            }).catch(err => {
                AlertNotification("Gagal", `option program unggulan, ${err}`, "error", 3000, true);
            })
        } catch (err) {
            AlertNotification("Gagal", `option program unggulan, ${err}`, "error", 3000, true);
            console.log(err)
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const fetchPokinById = async () => {
            try {
                setProsesDetail(true);
                await apiFetch(`${branding?.api_perencanaan}/pohon_kinerja_admin/detail/${id}`, {
                }).then((resp: any) => {
                    // console.log("option role", resp)
                    const data = resp.data;
                    if (data.tagging != null) {
                        const { tagging } = data;
                        const unggulanBupatiTag = tagging?.find((t: Tagging) => t.nama_tagging === "Program Unggulan Bupati");
                        const hariKerjaTag = tagging?.find((t: Tagging) => t.nama_tagging === "100 Hari Kerja Bupati");
                        const unggulanPusatTag = tagging?.find((t: Tagging) => t.nama_tagging === "Program Unggulan Pemerintah Pusat");

                        if (unggulanBupatiTag) {
                            if (unggulanBupatiTag.keterangan_tagging_program != null) {
                                const tag = unggulanBupatiTag.keterangan_tagging_program.map((ktg: any) => ({
                                    value: ktg.kode_program_unggulan,
                                    label: ktg.keterangan_tagging_program,
                                }));
                                setBupatiValue(tag);
                            } else {
                                setBupatiValue([]);
                            }
                        }
                        if (hariKerjaTag) {
                            if (hariKerjaTag.keterangan_tagging_program != null) {
                                const tag = hariKerjaTag.keterangan_tagging_program.map((ktg: any) => ({
                                    value: ktg.kode_program_unggulan,
                                    label: ktg.keterangan_tagging_program,
                                }));
                                setHariKerjaValue(tag);
                            } else {
                                setHariKerjaValue([]);
                            }
                        }
                        if (unggulanPusatTag) {
                            if (unggulanPusatTag.keterangan_tagging_program != null) {
                                const tag = unggulanPusatTag.keterangan_tagging_program.map((ktg: any) => ({
                                    value: ktg.kode_program_unggulan,
                                    label: ktg.keterangan_tagging_program,
                                }));
                                setPusatValue(tag);
                            } else {
                                setPusatValue([]);
                            }
                        }
                        setUnggulanBupati(!!unggulanBupatiTag);
                        setHariKerja(!!hariKerjaTag);
                        setUnggulanPusat(!!unggulanPusatTag);
                    }

                    reset({
                        nama_pohon: data.nama_pohon || '',
                        keterangan: data.keterangan || '',
                        parent: data.parent || '',
                        status: data.status,
                        kode_opd: data.kode_opd ? {
                            value: data.kode_opd,
                            label: data.nama_opd,
                        } : null,
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
                    });
                    if (data.indikator) {
                        replace(data.indikator.map((item: indikator) => ({
                            indikator: item.nama_indikator,
                            targets: item.targets,
                        })));
                    }
                }).catch(err => {
                    AlertNotification("Gagal", `Error data detail pohon, ${err}`, "error", 2000, true);
                    setErrorDetail(true);
                })
            } catch (err) {
                console.error(err, 'gagal mengambil data sesuai id pohon')
                setErrorDetail(true);
            } finally {
                setProsesDetail(false);
            }
        }
        if (jenis === "edit") {
            fetchPokinById();
        }
    }, [id, reset, branding, replace, jenis]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const pelaksanaIds = data.pelaksana?.map((pelaksana) => ({
            pegawai_id: pelaksana.value,
        })) || [];
        const bupatiValue = BupatiValue?.map((dt) => ({
            kode_program_unggulan: dt.value,
            tahun: String(branding?.tahun?.value ?? ""),
        })) || [];
        const hariValue = HariKerjaValue?.map((dt) => ({
            kode_program_unggulan: dt.value,
            tahun: String(branding?.tahun?.value ?? ""),
        })) || [];
        const pusatValue = PusatValue?.map((dt) => ({
            kode_program_unggulan: dt.value,
            tahun: String(branding?.tahun?.value ?? ""),
        })) || [];
        const taggingData = [
            ...(UnggulanBupati ? [{
                nama_tagging: "Program Unggulan Bupati",
                keterangan_tagging_program: bupatiValue,
            }] : []),
            ...(HariKerja ? [{
                nama_tagging: "100 Hari Kerja Bupati",
                keterangan_tagging_program: hariValue,
            }] : []),

            ...(UnggulanPusat ? [{
                nama_tagging: "Program Unggulan Pemerintah Pusat",
                keterangan_tagging_program: pusatValue,
            }] : []),
        ];
        const formData = {
            //key : value
            ...(jenis === "tambah" && {
                parent: id,
                jenis_pohon: level === 0 ? "Sub Tematik" :
                level === 1 ? "Sub Sub Tematik" :
                        level === 2 ? "Super Sub Tematik" :
                        level === 3 ? "Strategic Pemda" :
                                level === 4 ? "Tactical Pemda" :
                                    level === 5 ? "Operational Pemda" : "Unknown",
                level_pohon: level === 0 ? 1 :
                    level === 1 ? 2 :
                        level === 2 ? 3 :
                            level === 3 ? 4 :
                                level === 4 ? 5 :
                                    level === 5 ? 6 : "Unknown",
                kode_opd: (level === 0 || level === 1 || level === 2) ? null : data.kode_opd?.value,
                status: (level === 0 || level === 1 || level === 2) ? '' : 'menunggu_disetujui',
            }),
            ...(jenis === "edit" && {
                parent: data.parent,
                jenis_pohon: level === 0 ? "Tematik" :
                    level === 1 ? "Sub Tematik" :
                        level === 2 ? "Sub Sub Tematik" :
                            level === 3 ? "Super Sub Tematik" :
                                level === 4 ? "Strategic Pemda" :
                                    level === 5 ? "Tactical Pemda" :
                                        level === 6 ? "Operational Pemda" : "Unknown",
                level_pohon: level,
                kode_opd: (level === 0 || level === 1 || level === 2 || level === 3) ? null : data.kode_opd?.value,
                pelaksana: pelaksanaIds,
                status: data.status,
            }),
            nama_pohon: data.nama_pohon,
            Keterangan: data.keterangan,
            tahun: branding?.tahun?.value?.toString(),
            ...(data.indikator && {
                indikator: data.indikator.map((ind) => ({
                    indikator: ind.nama_indikator,
                    target: ind.targets.map((t) => ({
                        target: t.target,
                        satuan: t.satuan,
                    })),
                })),
            }),
            tagging: taggingData,
        };
        // console.log(formData);
        try {
            setProses(true);
            let url = ""
            if (jenis === "edit") {
                url = `${branding?.api_perencanaan}/pohon_kinerja_admin/update/${id}`;
            } else {
                url = `${branding?.api_perencanaan}/pohon_kinerja_admin/create`;
            }
            setProses(true);
            await apiFetch(url, {
                method: jenis === "edit" ? "PUT" : "POST",
                body: JSON.stringify(formData)
            }).then((resp: any) => {
                if (resp.code === 200 || resp.code === 201) {
                    AlertNotification("Berhasil", "Berhasil menyimpan pohon", "success", 1000);
                    if (jenis === "tambah") {
                        setIsAdded(true);
                        const data = resp.data;
                        setDataAdd(data);
                    } else {
                        const berhasil = true;
                        const data = resp.data;
                        if (berhasil) {
                            EditBerhasil(data ?? null);
                        }
                    }
                } else {
                    AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
                }
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

    if (ProsesDetail) {
        return (
            <div className="tf-nc tf flex flex-col w-[600px] min-h-[400px] items-center justify-center rounded-lg shadow-lg shadow-slate-500">
                <LoadingSync />
            </div>
        )
    } else if (ErrorDetail && jenis === "edit") {
        return (
            <div className="tf-nc tf flex flex-col w-[600px] min-h-[400px] items-center justify-center rounded-lg shadow-lg shadow-slate-500">
                <p className='text-red-500 font-semibold'>Error saat mendapatkan data pohon, hubungi tim developer</p>
                <ButtonRed className="flex items-center gap-1  w-full my-3" onClick={onCancel}>
                    <TbCircleX />
                    Batal
                </ButtonRed>
            </div>
        )
    } else {
        return (
            <React.Fragment>
                {IsAdded && DataAdd ?
                    <Pohon
                        tema={DataAdd}
                        deleteTrigger={() => setDeleted((prev) => !prev)}
                        set_show_all={() => null}
                        idForm={formId}
                    />
                    :
                    <div
                        className={`
                            tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg form-pohon
                            ${shadowJenisPohon(jenis, level)}
                        `}
                    >
                        <div className="flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 border-black rounded-lg">
                            {jenis} {LabelJenisPohon(jenis, level)}
                        </div>
                        <div className="flex justify-center my-3 w-full">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className='w-full'
                            >
                                <div className="flex flex-col py-3">
                                    <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                        {LabelJenisPohon(jenis, level)}
                                    </label>
                                    <Controller
                                        name="nama_pohon"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                value={field.value ?? ""}
                                                id="nama_pohon"
                                                type="text"
                                                placeholder="masukkan Pohon"
                                                maxLength={255}
                                            />
                                        )}
                                    />
                                </div>
                                {/* TAGGING */}
                                {level > 2 &&
                                    <>
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Tagging :
                                        </label>
                                        <div className="border border-sky-500 rounded-lg p-3">
                                            <div className="grid grid-flow-col gap-2 items-center">
                                                <div className="flex flex-col items-center">
                                                    {UnggulanBupati ?
                                                        <button
                                                            type="button"
                                                            onClick={() => setUnggulanBupati(false)}
                                                            className="border w-5 h-5 bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                                        >
                                                            <TbCheck />
                                                        </button>
                                                        :
                                                        <button
                                                            type="button"
                                                            onClick={() => setUnggulanBupati(true)}
                                                            className="w-5 h-5 border border-black rounded-full"
                                                        ></button>
                                                    }
                                                    <p onClick={() => setUnggulanBupati((prev) => !prev)} className={`cursor-pointer ${UnggulanBupati && 'text-emerald-500'}`}>Program Bupati</p>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    {HariKerja ?
                                                        <button
                                                            type="button"
                                                            onClick={() => setHariKerja(false)}
                                                            className="border w-5 h-5 bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                                        >
                                                            <TbCheck />
                                                        </button>
                                                        :
                                                        <button
                                                            type="button"
                                                            onClick={() => setHariKerja(true)}
                                                            className="w-5 h-5 border border-black rounded-full"
                                                        ></button>
                                                    }
                                                    <p onClick={() => setHariKerja((prev) => !prev)} className={`cursor-pointer ${HariKerja && 'text-emerald-500'}`}>100 Hari Kerja Bupati</p>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    {UnggulanPusat ?
                                                        <button
                                                            type="button"
                                                            onClick={() => setUnggulanPusat(false)}
                                                            className="border w-5 h-5 bg-emerald-500 rounded-full text-white p-1 flex justify-center items-center"
                                                        >
                                                            <TbCheck />
                                                        </button>
                                                        :
                                                        <button
                                                            type="button"
                                                            onClick={() => setUnggulanPusat(true)}
                                                            className="w-5 h-5 border border-black rounded-full"
                                                        ></button>
                                                    }
                                                    <p onClick={() => setUnggulanPusat((prev) => !prev)} className={`cursor-pointer ${UnggulanPusat && 'text-emerald-500'}`}>Program Pusat</p>
                                                </div>
                                            </div>
                                            {UnggulanBupati &&
                                                <Controller
                                                    name={`tagging.0.keterangan_tagging_program.0.kode_program_unggulan`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col py-3 border border-emerald-500 mt-1 px-2 rounded-lg">
                                                            <label className="uppercase text-xs font-bold text-gray-700 mb-1">
                                                                Keterangan Program Unggulan Bupati :
                                                            </label>
                                                            <Select
                                                                {...field}
                                                                placeholder="Pilih Program Unggulan"
                                                                value={BupatiValue}
                                                                options={ProgramOption}
                                                                isSearchable
                                                                isClearable
                                                                isMulti
                                                                onChange={(option) => {
                                                                    field.onChange(option || []);
                                                                    setBupatiValue(option as OptionTypeString[]);
                                                                }}
                                                                onMenuOpen={() => {
                                                                    if (ProgramOption.length === 0) {
                                                                        fetchProgramUnggulan();
                                                                    }
                                                                }}
                                                                styles={{
                                                                    control: (baseStyles) => ({
                                                                        ...baseStyles,
                                                                        borderRadius: '8px',
                                                                        textAlign: 'start',
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            }
                                            {HariKerja &&
                                                <Controller
                                                    name={`tagging.1.keterangan_tagging_program.0.kode_program_unggulan`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col py-3">
                                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                Keterangan 100 Hari Kerja Bupati :
                                                            </label>
                                                            <Select
                                                                {...field}
                                                                placeholder="Pilih Program Unggulan"
                                                                value={HariKerjaValue}
                                                                options={ProgramOption}
                                                                isSearchable
                                                                isClearable
                                                                isMulti
                                                                onMenuOpen={() => {
                                                                    if (ProgramOption.length === 0) {
                                                                        fetchProgramUnggulan();
                                                                    }
                                                                }}
                                                                onChange={(option) => {
                                                                    field.onChange(option || []);
                                                                    setHariKerjaValue(option as OptionTypeString[]);
                                                                }}
                                                                styles={{
                                                                    control: (baseStyles) => ({
                                                                        ...baseStyles,
                                                                        borderRadius: '8px',
                                                                        textAlign: 'start',
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            }
                                            {UnggulanPusat &&
                                                <Controller
                                                    name={`tagging.2.keterangan_tagging_program.0.kode_program_unggulan`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="flex flex-col py-3">
                                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                                Keterangan Program Unggulan Pemerintah Pusat :
                                                            </label>
                                                            <Select
                                                                {...field}
                                                                placeholder="Pilih Program Unggulan"
                                                                value={PusatValue}
                                                                options={ProgramOption}
                                                                isSearchable
                                                                isClearable
                                                                isMulti
                                                                onMenuOpen={() => {
                                                                    if (ProgramOption.length === 0) {
                                                                        fetchProgramUnggulan();
                                                                    }
                                                                }}
                                                                onChange={(option) => {
                                                                    field.onChange(option || []);
                                                                    setPusatValue(option as OptionTypeString[]);
                                                                }}
                                                                styles={{
                                                                    control: (baseStyles) => ({
                                                                        ...baseStyles,
                                                                        borderRadius: '8px',
                                                                        textAlign: 'start',
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                />
                                            }
                                        </div>
                                    </>
                                }
                                {(level === 3 || level === 4 || level === 5 || level === 6) &&
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
                                                        options={OpdOption}
                                                        isLoading={isLoading}
                                                        isSearchable
                                                        isClearable
                                                        onMenuOpen={() => {
                                                            if (OpdOption.length === 0) {
                                                                fetchOpd();
                                                            }
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
                                <label className="uppercase text-base font-bold text-sky-700 my-2">
                                    Indikator {LabelJenisPohon(jenis, level)}
                                </label>
                                {fields.map((field, index) => (
                                    <div key={index} className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
                                        <Controller
                                            name={`indikator.${index}.nama_indikator`}
                                            control={control}
                                            defaultValue={field.nama_indikator}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Nama Indikator {index + 1} :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        maxLength={255}
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder={`Masukkan nama indikator ${index + 1}`}
                                                    />
                                                </div>
                                            )}
                                        />
                                        {field.targets.map((_, subindex) => (
                                            <React.Fragment key={subindex}>
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
                                            </React.Fragment>
                                        ))}
                                        {index >= 0 && (
                                            <ButtonRedBorder
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="w-[200px] my-3"
                                            >
                                                Hapus
                                            </ButtonRedBorder>
                                        )}
                                    </div>
                                ))}
                                <ButtonSkyBorder
                                    className="flex items-center gap-1 mb-3 mt-2 w-full"
                                    type="button"
                                    onClick={() => append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] })}
                                >
                                    <TbCirclePlus />
                                    Tambah Indikator
                                </ButtonSkyBorder>
                                <div className="flex flex-col pb-3 pt-1 border-t-2">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="keterangan"
                                    >
                                        Keterangan:
                                    </label>
                                    <Controller
                                        name="keterangan"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                id="keterangan"
                                                placeholder="masukkan keterangan"
                                            />
                                        )}
                                    />
                                </div>
                                <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                                    {Proses ?
                                        <span className="flex">
                                            <LoadingButton />
                                            Menyimpan...
                                        </span>
                                        :
                                        <span className="flex items-center gap-1">
                                            <TbDeviceFloppy />
                                            Simpan
                                        </span>
                                    }
                                </ButtonSky>
                                <ButtonRed className="flex items-center gap-1  w-full my-3" onClick={onCancel}>
                                    <TbCircleX />
                                    Batal
                                </ButtonRed>
                            </form>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
};

export const LabelJenisPohon = (jenis: "edit" | "tambah", level: number) => {
    switch (`${jenis}-${level}`) {
        case "edit-0":
            return "Tematik";
        case "tambah-0":
            return "Sub Tematik";

        case "edit-1":
            return "Sub Tematik";
        case "tambah-1":
            return "Sub Sub Tematik";

        case "edit-2":
            return "Sub Sub Tematik";
        case "tambah-2":
            return "Super Sub Tematik";

        case "edit-3":
            return "Super Sub Tematik";
        case "tambah-3":
            return "Strategic Pemda";

        case "edit-4":
            return "Strategic Pemda";
        case "tambah-4":
            return "Tactical Pemda";

        case "edit-5":
            return "Tactical Pemda";
        case "tambah-5":
            return "Operational Pemda";

        case "edit-6":
            return "Operational Pemda";
        case "tambah-6":
            return "Operational N Pemda";

        default:
            return `Pohon Level ${level}`;
    }
};
export const shadowJenisPohon = (jenis: "edit" | "tambah", level: number) => {
    switch (`${jenis}-${level}`) {
        case "edit-0":
            return "shadow-slate-500";
        case "tambah-0":
            return "shadow-slate-500";

        case "edit-1":
            return "shadow-slate-500";
        case "tambah-1":
            return "shadow-slate-500";

        case "edit-2":
            return "shadow-slate-500";
        case "tambah-2":
            return "shadow-slate-500";

        case "edit-3":
            return "shadow-slate-500";
        case "tambah-3":
            return "shadow-red-400";

        case "edit-4":
            return "shadow-red-400";
        case "tambah-4":
            return "shadow-blue-500";

        case "edit-5":
            return "shadow-blue-500";
        case "tambah-5":
            return "shadow-green-500";

        case "edit-6":
            return "shadow-green-500";
        case "tambah-6":
            return "shadow-emerald-500";

        default:
            return `shadow-slate-800`;
    }
};