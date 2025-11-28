'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSkyBorder, ButtonRed, ButtonGreenBorder, ButtonRedBorder, ButtonGreen } from "@/components/ui/button";
import { OptionType, OptionTypeString } from "@/types";
import { AlertNotification } from "@/lib/alert";
import { TbEyeClosed, TbEye } from "react-icons/tb";
import { getToken } from "@/lib/cookie";
import { TablePohon } from "./TablePohon";
import { pohon } from "../type/rekin";
import Select from 'react-select';
import { LoadingButton, LoadingBeat, LoadingClip } from "@/lib/loading";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    id?: string;
    nip: string;
    pegawai_id?: string;
    kode_opd: string;
    tahun: string;
    metode: "baru" | "lama";
    roles: 'level_1' | 'level_2' | 'level_3' | 'level_4';
    onSuccess: () => void;
}

interface SasaranOpd {
    id: string;
    nama_sasaran_opd: string;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    indikator: IndikatorSasaran[];
}
interface FormValue {
    id?: string;
    id_pohon: OptionType;
    sasaranopd_id?: OptionType;
    nama_rencana_kinerja: string;
    tahun: string;
    status_rencana_kinerja: OptionTypeString;
    catatan: string;
    kode_opd: string;
    pegawai_id: string;
    indikator: indikator[];
}
interface IndikatorSasaran {
    id: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: target[];
}
interface indikator {
    id_indikator?: string;
    nama_indikator: string;
    rumus_perhitungan?: string;
    sumber_data?: string;
    targets: target[];
}
type target = {
    tahun?: string;
    target: string;
    satuan: string;
};

export const ModalRencanaKinerja: React.FC<ModalProps> = ({ isOpen, onClose, id, metode, tahun, nip, pegawai_id, kode_opd, onSuccess, roles }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();
    const [Rekin, setRekin] = useState<string>('');
    const [PreviewPohon, setPreviewPohon] = useState<boolean>(false);
    const [Pokin, setPokin] = useState<pohon | null>(null);
    const [DetailPokin, setDetailPokin] = useState<pohon | null>(null);
    const [catatan, setCatatan] = useState<string>('');
    const [statusRekin, setStatusRekin] = useState<OptionTypeString | null>(null);
    const [PokinOption, setPokinOption] = useState<pohon[]>([]);

    const [Sasaran, setSasaran] = useState<SasaranOpd | null>(null);
    const [SasaranOption, setSasaranOption] = useState<SasaranOpd[]>([]);

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [DetailLoading, setDetailLoading] = useState<boolean>(false);
    const [LoadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "indikator",
    });

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchIdLevel3 = async () => {
            try {
                setLoadingDetail(true);
                const response = await fetch(`${API_URL}/detail-rencana_kinerja/${id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                const result = await response.json();
                const data = result.rencana_kinerja;
                if (data) {
                    if (data.nama_rencana_kinerja) {
                        setRekin(data.nama_rencana_kinerja);
                    }
                    if (data.catatan) {
                        setCatatan(data.catatan);
                    }
                    if (data.status_rencana_kinerja) {
                        const status = {
                            value: data.status_rencana_kinerja,
                            label: data.status_rencana_kinerja,
                        }
                        setStatusRekin(status);
                    }
                    if (data.id_pohon) {
                        const detail = {
                            value: data.id_pohon,
                            label: data.nama_pohon,
                            id: data.id_pohon,
                            parent: {
                                value: 0,
                                label: '',
                            },
                            nama_pohon: data.nama_pohon,
                            jenis_pohon: '',
                            level_pohon: 0,
                            tahun: {
                                value: tahun,
                                label: tahun,
                            },
                            status: '',
                            kode_opd: kode_opd,
                            nama_opd: '',
                            pelaksana: [],
                            indikator: [],
                            tagging: []
                        }
                        setPokin(detail);
                        setDetailPokin(detail);
                    }

                    reset({
                        id_pohon: {
                            value: data.id_pohon,
                            label: data.nama_pohon,
                        },
                        nama_rencana_kinerja: data.nama_rencana_kinerja,
                        catatan: data.catatan,
                        status_rencana_kinerja: {
                            value: data.status_rencana_kinerja,
                            label: data.status_rencana_kinerja,
                        },
                        indikator: data.indikator?.map((item: indikator) => ({
                            id_indikator: item.id_indikator,
                            nama_indikator: item.nama_indikator,
                            targets: item.targets.map((t: target) => ({
                                target: t.target,
                                satuan: t.satuan,
                            })),
                        })),
                    });
                    if (data.indikator) {
                        // Replace the fields to avoid duplication
                        replace(data.indikator.map((item: indikator) => ({
                            id_indikator: item.id_indikator,
                            nama_indikator: item.nama_indikator,
                            targets: item.targets,
                        })));
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDetail(false);
            }
        };
        const fetchIdLevel1 = async () => {
            try {
                setLoadingDetail(true);
                const response = await fetch(`${API_URL}/rencana_kinerja_level1/${id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data) {
                    if (data.nama_rencana_kinerja) {
                        setRekin(data.nama_rencana_kinerja);
                    }
                    if (data.catatan) {
                        setCatatan(data.catatan);
                    }
                    if (data.status_rencana_kinerja) {
                        const status = {
                            value: data.status_rencana_kinerja,
                            label: data.status_rencana_kinerja,
                        }
                        setStatusRekin(status);
                    }
                    if (data.sasaran_opd_id) {
                        const sasaran = {
                            id: data.sasaran_opd_id,
                            nama_sasaran_opd: data.nama_sasaran_opd,
                            tahun_awal: data.tahun_awal,
                            tahun_akhir: data.tahun_akhir,
                            jenis_periode: data.jenis_periode,
                            indikator: [],
                        }
                        setSasaran(sasaran);
                    }
                    if (data.id_pohon) {
                        const detail = {
                            value: data.id_pohon,
                            label: data.nama_pohon,
                            id: data.id_pohon,
                            parent: {
                                value: 0,
                                label: '',
                            },
                            nama_pohon: data.nama_pohon,
                            jenis_pohon: '',
                            level_pohon: 0,
                            tahun: {
                                value: tahun,
                                label: tahun,
                            },
                            status: '',
                            kode_opd: kode_opd,
                            nama_opd: '',
                            pelaksana: [],
                            indikator: [],
                            tagging: []
                        }
                        setPokin(detail);
                    }

                    reset({
                        id_pohon: {
                            value: data.id_pohon,
                            label: data.nama_pohon,
                        },
                        nama_rencana_kinerja: data.nama_rencana_kinerja,
                        catatan: data.catatan,
                        status_rencana_kinerja: {
                            value: data.status_rencana_kinerja,
                            label: data.status_rencana_kinerja,
                        },
                        indikator: data.indikator?.map((item: any) => ({
                            id_indikator: item.id_indikator,
                            rumus_perhitungan: item.rumus_perhitungan,
                            sumber_data: item.sumber_data,
                            nama_indikator: item.nama_indikator,
                            targets: item.targets.map((t: target) => ({
                                target: t.target,
                                satuan: t.satuan,
                            })),
                        })),
                    });
                    if (data.indikator) {
                        // Replace the fields to avoid duplication
                        replace(data.indikator.map((item: any) => ({
                            id_indikator: item.id_indikator,
                            nama_indikator: item.nama_indikator,
                            rumus_perhitungan: item.rumus_perhitungan,
                            sumber_data: item.sumber_data,
                            targets: item.targets,
                        })));
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDetail(false);
            }
        };
        if (isOpen && metode === "lama") {
            if (roles == 'level_1') {
                fetchIdLevel1();
            } else {
                fetchIdLevel3();
            }
        }
    }, [id, replace, reset, metode, token, kode_opd, isOpen, roles, tahun]);

    const fetchPokinByPelaksana = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/rencana_kinerja_pokin/pokin_by_pelaksana/${nip}/${tahun}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('cant fetch data opd');
            }
            const data = await response.json();
            const pokin = data.data.map((item: any) => ({
                value: item.id,
                label: `${item.nama_pohon} - ${item.jenis_pohon}`,
                nama_pohon: item.nama_pohon,
                jenis_pohon: item.jenis_pohon,
                level_pohon: item.level_pohon,
                keterangan: item.keterangan,
                indikator: item.indikator,
                nama_opd: item.nama_opd,
                tahun: item.tahun,
            }));
            setPokinOption(pokin);
        } catch (err) {
            console.log('gagal mendapatkan data dropdown pokin by pelaksana');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchDetailPohon = async (id: number) => {
        setDetailLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/pohon_kinerja_opd/detail/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('gagal mendapatkan detail pohon dengan error !reponse.ok');
            }
            const result = await response.json();
            const data = result.data;
            if (data) {
                setDetailPokin(data);
            } else {
                setDetailPokin(null);
            }
        } catch (err) {
            console.log('gagal mendapatkan detail pohon, terdapat kesalahan backend server / koneksi internet');
        } finally {
            setDetailLoading(false);
        }
    }
    const fetchOptionSasaranOpd = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/sasaran_opd/pokin/${id}/tahun/${tahun}`, {
                headers: {
                    "Authorization": `${token}`
                }
            });
            const result = await response.json();
            const data = result.data.sasaran_opd;
            if (result.code === 200) {
                const sasaran = data.map((s: SasaranOpd) => ({
                    value: s.id,
                    label: `${s.nama_sasaran_opd} - (${s.tahun_awal} - ${s.tahun_akhir})`,
                    id: s.id,
                    nama_sasaran_opd: s.nama_sasaran_opd,
                    tahun_awal: s.tahun_awal,
                    tahun_akhir: s.tahun_akhir,
                    jenis_periode: s.jenis_periode,
                    indikator: s.indikator.map((ind) => ({ // Map data indikator dari respons
                        id_indikator: ind.id,
                        rumus_perhitungan: ind.rumus_perhitungan,
                        sumber_data: ind.sumber_data,
                        nama_indikator: ind.indikator, // Sesuaikan nama properti jika perlu
                        targets: ind.target.map((t) => ({
                            tahun: t.tahun,
                            target: t.target,
                            satuan: t.satuan,
                        })),
                    })),
                }));
                setSasaranOption(sasaran);
            } else {
                console.log("code: ", result.code, "data: ", result.data);
                setSasaranOption([]);
            }
        } catch (err) {
            console.log("error saat fetch option sasaran opd", err);
        } finally {
            setIsLoading(false);
        }
    }

    const formatOptionLabel = (option: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'black', marginRight: '5px' }}>
                {option.nama_sasaran_opd}
            </span>
            <span style={{ color: 'grey' }}>
                ({option.tahun_awal} - {option.tahun_akhir})
            </span>
        </div>
    );

    const statusOption: OptionTypeString[] = [
        { label: "aktif", value: "aktif" },
        { label: "tidak aktif", value: "tidak aktif" },
    ];

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataNew = {
            //key : value
            id_pohon: data.id_pohon?.value,
            ...(roles == 'level_1' && {
                sasaranopd_id: Number(Sasaran?.id),
            }),
            nama_rencana_kinerja: Rekin,
            status_rencana_kinerja: "aktif",
            catatan: data.catatan,
            tahun: String(tahun),
            kode_opd: kode_opd,
            pegawai_id: nip,
            indikator: (data.indikator || []).map((ind) => ({
                nama_indikator: ind.nama_indikator,
                ...(roles == "level_1" && {
                    rumus_perhitungan: ind.rumus_perhitungan,
                    sumber_data: ind.sumber_data,
                }),
                target: ind.targets.map((t) => ({
                    target: t.target,
                    satuan: t.satuan,
                })),
            })),
        };
        const formDataEdit = {
            //key : value
            id_pohon: data.id_pohon?.value,
            ...(roles == 'level_1' && {
                sasaranopd_id: Number(Sasaran?.id),
            }),
            nama_rencana_kinerja: Rekin,
            status_rencana_kinerja: data.status_rencana_kinerja?.value,
            catatan: data.catatan,
            tahun: String(tahun),
            kode_opd: kode_opd,
            pegawai_id: nip,
            indikator: (data.indikator || []).map((ind) => ({
                id_indikator: ind.id_indikator,
                nama_indikator: ind.nama_indikator,
                ...(roles == "level_1" && {
                    rumus_perhitungan: ind.rumus_perhitungan,
                    sumber_data: ind.sumber_data,
                }),
                target: ind.targets.map((t) => ({
                    target: t.target,
                    satuan: t.satuan,
                })),
            })),
        };
        const getBody = () => {
            if (metode === "lama") return formDataEdit;
            if (metode === "baru") return formDataNew;
            return {}; // Default jika metode tidak sesuai
        };
        if (Rekin === '') {
            AlertNotification('Rencana Kinerja', 'rencana kinerja wajib terisi', 'warning', 2000);
        } else {
            // metode === 'baru' && console.log("baru :", formDataNew);
            // metode === 'lama' && console.log("lama :", formDataEdit);
            try {
                let url = "";
                if (metode === "lama" && roles != 'level_1') {
                    url = `rencana_kinerja/update/${id}`;
                } else if (metode === "baru" && roles != 'level_1') {
                    url = `rencana_kinerja/create`;
                } else if (metode === "baru" && roles == 'level_1') {
                    url = `rencana_kinerja/create_level1`;
                } else if (metode === "lama" && roles == 'level_1') {
                    url = `rencana_kinerja/update_level1/${id}`;
                } else {
                    url = '';
                }
                setProses(true);
                const response = await fetch(`${API_URL}/${url}`, {
                    method: metode === 'lama' ? "PUT" : "POST",
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(getBody()),
                });
                const result = await response.json();
                if (result.code === 200 || result.code === 201) {
                    AlertNotification("Berhasil", "Berhasil menambahkan rencana kinerja", "success", 1000);
                    onClose();
                    onSuccess();
                } else {
                    AlertNotification("Gagal", `${result.rencana_kinerja}`, "error", 2000);
                    console.log(result);
                }
            } catch (err) {
                console.log(err);
                AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
            } finally {
                setProses(false);
            }
        }
    };

    const handleClose = () => {
        setRekin('');
        setCatatan('');
        setPreviewPohon(false);
        reset({ indikator: [] });
        onClose();
        setPokin(null);
        setSasaran(null);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
            <div className="bg-white rounded-lg p-5 z-10 w-3/5 text-start max-h-[90%] overflow-auto">
                <div className="w-max-[500px] py-2 border-b">
                    <h1 className="text-xl font-semibold uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Rencana Kinerja</h1>
                </div>
                {LoadingDetail ?
                    <LoadingBeat />
                    :
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="id_pohon"
                            >
                                Pohon :
                            </label>
                            <Controller
                                name="id_pohon"
                                control={control}
                                rules={{ required: "Pohon Harus Dipilih" }}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Masukkan Pohon"
                                            value={Pokin}
                                            options={PokinOption}
                                            isLoading={IsLoading}
                                            isSearchable
                                            isClearable
                                            onMenuOpen={() => {
                                                if (nip != undefined) {
                                                    fetchPokinByPelaksana();
                                                }
                                            }}
                                            onChange={(option) => {
                                                field.onChange(option);
                                                setPokin(option);
                                                if (option) {
                                                    setRekin(option?.nama_pohon);
                                                    setPreviewPohon(false);
                                                }
                                            }}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                })
                                            }}
                                        />
                                        {errors.id_pohon ?
                                            <h1 className="text-red-500">
                                                {errors.id_pohon.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*Pohon Harus Dipilih</h1>
                                        }
                                    </>
                                )}
                            />
                        </div>
                        {Pokin?.value != null &&
                            <>
                                <div className="flex">
                                    <ButtonGreenBorder className="mb-2" type="button"
                                        onClick={() => {
                                                fetchDetailPohon(Pokin?.value);
                                                setPreviewPohon((prev) => !prev);
                                        }}
                                    >
                                        {PreviewPohon ?
                                            <>
                                                <TbEye className="mr-2" />
                                                <p>Sembunyikan Detail Pohon</p>
                                            </>
                                            :
                                            <>
                                                <TbEyeClosed className="mr-2" />
                                                <p>Tampilkan Detail Pohon</p>
                                            </>
                                        }</ButtonGreenBorder>
                                </div>
                                {PreviewPohon === true &&
                                    <div className="flex flex-col w-full justify-center items-center">
                                        <div
                                            className={`flex flex-col rounded-lg shadow-lg px-2
                                                ${DetailPokin?.jenis_pohon === "Strategic Pemda" && 'border'}
                                                ${DetailPokin?.jenis_pohon === "Tactical Pemda" && 'border'}
                                                ${DetailPokin?.jenis_pohon === "OperationalPemda" && 'border'}
                                                ${DetailPokin?.jenis_pohon === "Strategic" && 'bg-red-700'}
                                                ${DetailPokin?.jenis_pohon === "Tactical" && 'bg-blue-500'}
                                                ${DetailPokin?.jenis_pohon === "Operational" && 'bg-green-500'}
                                                ${DetailPokin?.jenis_pohon === "Operational N" && 'bg-white'}
                                                ${(DetailPokin?.jenis_pohon === "Strategic Crosscutting" || DetailPokin?.jenis_pohon === "Tactical Crosscutting" || DetailPokin?.jenis_pohon === "Operational Crosscutting" || DetailPokin?.jenis_pohon === "Operational N Crosscutting") && 'bg-yellow-700'}
                                            `}
                                        >
                                            <div
                                                className={`flex py-3 justify-center font-bold text-sm uppercase border my-3 rounded-lg bg-white
                                                    ${DetailPokin?.jenis_pohon === "Strategic Pemda" && 'border-red-500 text-white bg-linear-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                                                    ${DetailPokin?.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-linear-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                                                    ${DetailPokin?.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-linear-to-r from-[#007982] from-40% to-[#2DCB06]'}
                                                    ${(DetailPokin?.jenis_pohon === "Strategic" || DetailPokin?.jenis_pohon === 'Strategic Crosscutting') && 'border-red-500 text-red-500'}
                                                    ${(DetailPokin?.jenis_pohon === "Tactical" || DetailPokin?.jenis_pohon === 'Tactical Crosscutting') && 'border-blue-500 text-blue-500'}
                                                    ${(DetailPokin?.jenis_pohon === "Operational" || DetailPokin?.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                                                    ${(DetailPokin?.jenis_pohon === "Operational Crosscutting" || DetailPokin?.jenis_pohon === "Operational N Crosscutting") && 'border-green-500 text-green-500'}
                                                `}
                                            >
                                                {DetailPokin?.jenis_pohon}
                                            </div>
                                            <div className="mb-3">
                                                {DetailPokin &&
                                                    <TablePohon item={DetailPokin} />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </>
                        }
                        {(roles == 'level_1' && Pokin?.value != null) &&
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="sasaranopd_id"
                                >
                                    Sasaran OPD :
                                </label>
                                <Controller
                                    name="sasaranopd_id"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                {...field}
                                                placeholder="Masukkan Sasaran OPD"
                                                value={Sasaran}
                                                options={SasaranOption}
                                                isLoading={IsLoading}
                                                isSearchable
                                                isClearable
                                                formatOptionLabel={formatOptionLabel}
                                                noOptionsMessage={() => "Sasaran OPD belum di tambahkan di pohon ini"}
                                                onMenuOpen={() => {
                                                    if (Pokin?.value != undefined) {
                                                        fetchOptionSasaranOpd(Pokin?.value);
                                                    }
                                                }}
                                                onChange={(option) => {
                                                    field.onChange(option);
                                                    setSasaran(option);
                                                    if (option) {
                                                        setRekin(option?.nama_sasaran_opd);
                                                    }
                                                }}
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderRadius: '8px',
                                                    })
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </div>
                        }
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="nama_rencana_kinerja"
                            >
                                Rencana Kinerja :
                            </label>
                            <Controller
                                name="nama_rencana_kinerja"
                                control={control}
                                // rules={{ required: "Nama Rencana Kinerja harus terisi" }}
                                render={({ field }) => (
                                    <>
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="nama_rencana_kinerja"
                                            type="text"
                                            placeholder="masukkan nama rencana kinerja"
                                            value={Rekin}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setRekin(e.target.value);
                                            }}
                                        />
                                        {/* {errors.nama_rencana_kinerja ?
                                            <h1 className="text-red-500">
                                                {errors.nama_rencana_kinerja.message}
                                            </h1>
                                            :
                                            <h1 className="text-slate-300 text-xs">*Nama Rencana Kinerja Harus Terisi</h1>
                                        } */}
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="catatan"
                            >
                                Catatan :
                            </label>
                            <Controller
                                name="catatan"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="catatan"
                                        placeholder="masukkan catatan jika ada"
                                        value={field.value || catatan}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setCatatan(e.target.value);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {metode === 'lama' &&
                            <div className="flex flex-col py-3">
                                <label
                                    className="uppercase text-xs font-bold text-gray-700 my-2"
                                    htmlFor="status_rencana_kinerja"
                                >
                                    Status Rencana Kinerja:
                                </label>
                                <Controller
                                    name="status_rencana_kinerja"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Select
                                                {...field}
                                                id="Status Rencana Kinerja"
                                                placeholder="pilih Status Rencana"
                                                value={statusRekin}
                                                options={statusOption}
                                                onChange={(option) => {
                                                    setStatusRekin(option);
                                                    field.onChange(option);
                                                }}
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderRadius: '8px',
                                                    })
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </div>
                        }

                        <label className="uppercase text-base font-bold text-gray-700 my-2">
                            indikator rencana kinerja :
                        </label>
                        {fields.map((field, index) => (
                            <div key={index} className="flex flex-col bg-gray-100 my-2 py-2 px-2 rounded-lg">
                                <Controller
                                    name={`indikator.${index}.nama_indikator`}
                                    control={control}
                                    defaultValue={field.nama_indikator}
                                    render={({ field }) => (
                                        <div className="flex flex-col py-3">
                                            <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                Nama Indikator ke - {index + 1} :
                                            </label>
                                            <input
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                placeholder={`Masukkan nama indikator ${index + 1}`}
                                            />
                                        </div>
                                    )}
                                />
                                {roles == 'level_1' &&
                                    <React.Fragment>
                                        <Controller
                                            name={`indikator.${index}.rumus_perhitungan`}
                                            control={control}
                                            defaultValue={field.rumus_perhitungan}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Rumus Perhitungan ke - {index + 1} :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder={`Masukkan Rumus Perhitungan`}
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name={`indikator.${index}.sumber_data`}
                                            control={control}
                                            defaultValue={field.sumber_data}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-bold text-gray-700 mb-2">
                                                        Sumber Data ke - {index + 1} :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder={`Masukkan Sumber Data`}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </React.Fragment>
                                }
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
                                        className="w-[200px] mt-3"
                                    >
                                        Hapus
                                    </ButtonRedBorder>
                                )}
                            </div>
                        ))}
                        <ButtonSkyBorder
                            className="mb-3"
                            type="button"
                            disabled={Proses}
                            onClick={() => {
                                if (roles == 'level_1') {
                                    append({ nama_indikator: "", rumus_perhitungan: "", sumber_data: "", targets: [{ target: "", satuan: "" }] });
                                } else {
                                    append({ nama_indikator: "", targets: [{ target: "", satuan: "" }] });
                                }
                            }}
                        >
                            Tambah Indikator
                        </ButtonSkyBorder>
                        <ButtonGreen type="submit" className="my-4" disabled={Proses}>
                            {Proses ?
                                <span className="flex">
                                    <LoadingButton />
                                    Menyimpan...
                                </span>
                                :
                                "Simpan"
                            }
                        </ButtonGreen>
                        <ButtonRed type="button" onClick={handleClose} disabled={Proses}>
                            Kembali
                        </ButtonRed>
                    </form>
                }
            </div>
        </div>
    );
};
