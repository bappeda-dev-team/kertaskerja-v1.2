'use client'

import { useState } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray, Control } from "react-hook-form";
import { ButtonSky, ButtonSkyBorder, ButtonRed } from '@/components/ui/button';
import { LoadingButton } from "@/lib/loading";
import { IsuStrategis, DataDukung, TargetJumlahData } from "../type";
import { PermasalahanOpd } from "../../permasalahan-opd/type";
import Select from "react-select";
import { GetResponseFindallBidangUrusan } from "@/app/(main)/datamaster/programkegiatan/bidang-urusan/type";
import { AlertNotification } from "@/lib/alert";
import { TbCirclePlus, TbDeviceFloppy, TbPlus, TbTrash, TbX } from "react-icons/tb";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal } from "@/types";

interface BidangUrusan extends GetResponseFindallBidangUrusan {
    value: string;
    label: string;
}
interface PermasalahanOpdOption extends PermasalahanOpd {
    value: number;
    label: string;
}
interface FormValue {
    id?: number;
    kode_opd: string;
    nama_opd: string;
    kode_bidang_urusan: BidangUrusan | null;
    tahun_awal: string;
    tahun_akhir: string;
    isu_strategis: string;
    permasalahan_opd: FormPermasalahan[];
}
interface FormPermasalahan {
    data_dukung: FormDataDukung[];
    id_permasalahan?: PermasalahanOpdOption | null;
    jenis_masalah?: string;
    level_pohon?: number;
    masalah?: string;
    id?: number;
}
interface FormDataDukung extends DataDukung {
    jumlah_data: TargetJumlahData[];
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    jenis: 'edit' | 'tambah';
    Data?: IsuStrategis | null;
    kode_opd: string;
    nama_opd: string;
    tahun_list: string[];
    onSuccess: () => void;
}


export const ModalIsu: React.FC<modal> = ({ isOpen, onClose, Data, kode_opd, nama_opd, jenis, tahun_list, onSuccess }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            id: Data?.id,
            kode_opd: Data?.kode_opd,
            nama_opd: Data?.nama_opd,
            kode_bidang_urusan: Data?.kode_bidang_urusan ? {
                value: Data?.kode_bidang_urusan,
                label: `(${Data?.kode_bidang_urusan}) ${Data?.nama_bidang_urusan}`,
                kode_bidang_urusan: Data?.kode_bidang_urusan,
                nama_bidang_urusan: Data?.nama_bidang_urusan
            } : null,
            tahun_awal: Data?.tahun_awal,
            tahun_akhir: Data?.tahun_akhir,
            isu_strategis: Data?.isu_strategis,
            permasalahan_opd: Data?.permasalahan_opd?.map((po: FormPermasalahan) => ({
                id_permasalahan: {
                    value: po.id,
                    label: po.masalah,
                },
                data_dukung: po.data_dukung?.map((dd: FormDataDukung) => ({
                    id: dd.id,
                    data_dukung: dd.data_dukung,
                    narasi_data_dukung: dd.narasi_data_dukung,
                    jumlah_data: dd.jumlah_data?.map((jd: TargetJumlahData) => ({
                        id: jd.id,
                        id_data_dukung: jd.id_data_dukung,
                        tahun: jd.tahun,
                        jumlah_data: jd.jumlah_data,
                        satuan: jd.satuan
                    })) || [],
                })) || [],
            })) || []
        }
    });

    const { fields: PermasalahanField, append: PermasalahanAppend, remove: PermasalahanRemove } = useFieldArray({
        control,
        name: 'permasalahan_opd'
    });

    const [BidangUrusanOption, setBidangUrusanOption] = useState<BidangUrusan[]>([]);
    const [PermasalahanOption, setPermasalahanOption] = useState<PermasalahanOpdOption[]>([]);

    const [User, setUser] = useState<any>(null);
    // const [Periode, setPeriode] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);

    const { branding } = useBrandingContext();
    const Tahun = branding?.tahun ? branding?.tahun.value : 0;

    const fetchBidangUrusanOption = async () => {
        let url = `bidang_urusan_opd/findall/${kode_opd}`;
        setLoadingOption(true);
        await apiFetch<GetResponseGlobal<GetResponseFindallBidangUrusan[]>>(`${branding?.api_perencanaan}/${url}`, {
            method: "GET"
        }).then((result) => {
            if (result.code === 200) {
                const data = result.data.map((item: GetResponseFindallBidangUrusan) => ({
                    ...item,
                    value: item.kode_bidang_urusan,
                    label: `(${item.kode_bidang_urusan}) ${item.nama_bidang_urusan}`,
                }));
                setBidangUrusanOption(data);
            } else {
                console.log(result.data);
                setBidangUrusanOption([]);
            }
        }).catch((err) => {
            setBidangUrusanOption([]);
            console.log(err);
        }).finally(() => {
            setLoadingOption(false);
        })
    }
    const fetchPermasalahanOption = async () => {
        let url = `permasalahan_terpilih/findall?kode_opd=${kode_opd}&tahun=${Tahun}`;
        setLoadingOption(true);
        await apiFetch<GetResponseGlobal<PermasalahanOpdOption[]>>(`${branding?.api_permasalahan}/${url}`, {
            method: "GET",
        }).then((result) => {
            if (result.code === 200 || result.code === 201) {
                const data = result.data.map((item: PermasalahanOpdOption) => ({
                    ...item,
                    value: item.id_permasalahan,
                    label: item.nama_pohon,
                }));
                setPermasalahanOption(data);
            } else {
                console.log(result.data);
                setPermasalahanOption([]);
            }
        }).catch((err) => {
            setPermasalahanOption([]);
            console.log(err);
        }).finally(() => {
            setLoadingOption(false);
        })
    }
    const handleTambahPermasalahan = () => {
        const defaultData = Array((tahun_list && tahun_list.length)).fill({ jumlah_data: "", satuan: "" });
        PermasalahanAppend({
            id_permasalahan: null,
            data_dukung: [
                { data_dukung: "", narasi_data_dukung: "", jumlah_data: defaultData }
            ]
        });
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formDataNew = {
            //key : value
            nama_opd: nama_opd,
            kode_opd: kode_opd,
            kode_bidang_urusan: data.kode_bidang_urusan?.value,
            nama_bidang_urusan: data.kode_bidang_urusan?.nama_bidang_urusan,
            tahun_awal: "",
            tahun_akhir: "",
            isu_strategis: data.isu_strategis,
            permasalahan_opd: data.permasalahan_opd.map((p) => ({
                data_dukung: p.data_dukung.map((dd) => ({
                    data_dukung: dd.data_dukung,
                    narasi_data_dukung: dd.narasi_data_dukung,
                    permasalahan_opd_id: p.id_permasalahan?.value,
                    jumlah_data: dd.jumlah_data.map((jd, index) => ({
                        jumlah_data: Number(jd.jumlah_data),
                        satuan: jd.satuan,
                        tahun: tahun_list[index],
                    })),
                })),
                id_permasalahan: p.id_permasalahan?.value,
            }))
        };
        const formDataEdit = {
            //key : value
            id: Data?.id,
            nama_opd: Data?.nama_opd,
            kode_opd: Data?.kode_opd,
            kode_bidang_urusan: data.kode_bidang_urusan?.value,
            nama_bidang_urusan: data.kode_bidang_urusan?.nama_bidang_urusan,
            tahun_awal: "",
            tahun_akhir: "",
            isu_strategis: data.isu_strategis,
            permasalahan_opd: data.permasalahan_opd.map((p) => ({
                data_dukung: p.data_dukung.map((dd) => ({
                    id: dd.id,
                    data_dukung: dd.data_dukung,
                    narasi_data_dukung: dd.narasi_data_dukung,
                    permasalahan_opd_id: p.id_permasalahan?.value,
                    jumlah_data: dd.jumlah_data.map((jd, index) => ({
                        id: jd.id,
                        id_data_dukung: jd.id_data_dukung,
                        tahun: tahun_list[index],
                        jumlah_data: Number(jd.jumlah_data),
                        satuan: jd.satuan
                    })),
                })),
                id_permasalahan: p.id_permasalahan?.value,
            }))
        };
        const getBody = () => {
            if (jenis === "edit") return formDataEdit;
            if (jenis === "tambah") return formDataNew;
            return {}; // Default jika jenis tidak sesuai
        };
        // jenis === 'baru' && console.log("baru :", formDataNew);
        // jenis === 'edit' && console.log("edit :", formDataEdit);
        setProses(true);
        let url = "";
        if (jenis === "edit") {
            url = `isu_strategis/${Data?.id}`
        } else if (jenis) {
            url = "isu_strategis"
        }
        await apiFetch(`${branding?.api_permasalahan}/${url}`, {
            method: jenis === "tambah" ? "POST" : "PUT",
            body: JSON.stringify(getBody()),
        }).then((result: any) => {
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menyimpan data", "success", 1000);
                onClose();
                onSuccess();
                reset();
            } else {
                console.log(result);
                AlertNotification("Error", `${result.data}`, "error", 10000, true);
            }
        }).catch((err) => {
            console.error(err);
            AlertNotification("Error", "Cek koneksi internet, jika error berlanjut hubungi tim developer", "error", 2000, true);
        }).finally(() => {
            setProses(false);
        })
    };

    const handleClose = () => {
        onClose();
        reset();
    }

    interface DataDukungListProps {
        control: Control<FormValue>; // Tipe Control dari useForm
        permasalahan_index: number; // Indeks alasan di mana data_terukur ini berada
    }

    const DataTerukurList: React.FC<DataDukungListProps> = ({ control, permasalahan_index }) => {
        // useFieldArray untuk mengelola array 'data_terukur' yang bersarang
        const {
            fields: dataTerukurFields,
            append: appendDataTerukur,
            remove: removeDataTerukur,
        } = useFieldArray({
            control,
            name: `permasalahan_opd.${permasalahan_index}.data_dukung`, // Kunci di sini adalah path lengkap ke array bersarang
        });

        const handleTambahDataDukung = () => {
            const defaultData = Array((tahun_list && tahun_list.length)).fill({ jumlah_data: "", satuan: "" });
            appendDataTerukur({ data_dukung: "", narasi_data_dukung: "", jumlah_data: defaultData });
        }

        return (
            <>
                {dataTerukurFields.map((dataTerukurField, dataTerukurIndex) => (
                    <div key={dataTerukurIndex} className="ml-4 pl-4 border border-cyan-400 rounded-xl mt-4 p-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs uppercase font-semibold text-gray-700 my-2">Data Dukung:</label>
                            <button
                                type="button"
                                onClick={() => removeDataTerukur(dataTerukurIndex)}
                                className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
                                title="Hapus Data Terukur Ini"
                            >
                                <TbTrash size={14} />
                            </button>
                        </div>
                        <div key={dataTerukurField.id} className="flex flex-col items-center gap-2 mb-2">
                            <Controller
                                name={`permasalahan_opd.${permasalahan_index}.data_dukung.${dataTerukurIndex}.data_dukung`}
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-3 py-1 rounded-lg grow w-full "
                                        type="text"
                                        placeholder={`Masukkan Data Dukung`}
                                    />
                                )}
                            />
                            <Controller
                                name={`permasalahan_opd.${permasalahan_index}.data_dukung.${dataTerukurIndex}.narasi_data_dukung`}
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        className="border px-3 py-1 rounded-lg grow w-full "
                                        type="text"
                                        placeholder={`Masukkan Narasi Data Dukung`}
                                    />
                                )}
                            />
                            <div className="flex flex-wrap justify-between gap-1">
                                {dataTerukurField.jumlah_data.map((_, subindex) => (
                                    <div
                                        key={`${permasalahan_index}-${subindex}`}
                                        className={`flex flex-col py-1 px-3 border rounded-lg
                                            ${Number(tahun_list[subindex]) === branding?.tahun?.value ?
                                                "border-yellow-600"
                                                :
                                                "border-sky-600"
                                            } 
                                        `}
                                    >
                                        <label className="text-base text-center text-gray-700">
                                            <p className={`font-bold text-sky-600 ${Number(tahun_list[subindex]) === branding?.tahun?.value ? "text-yellow-600" : "text-sky-600"}`}>{tahun_list[subindex]}</p>
                                        </label>
                                        <Controller
                                            name={`permasalahan_opd.${permasalahan_index}.data_dukung.${dataTerukurIndex}.jumlah_data.${subindex}.jumlah_data`}
                                            control={control}
                                            defaultValue={_.jumlah_data}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-semibold text-gray-700 mb-2">
                                                        Jumlah Data :
                                                    </label>
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        className="border px-4 py-2 rounded-lg"
                                                        placeholder="Masukkan jumlah data"
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name={`permasalahan_opd.${permasalahan_index}.data_dukung.${dataTerukurIndex}.jumlah_data.${subindex}.satuan`}
                                            control={control}
                                            defaultValue={_.satuan}
                                            render={({ field }) => (
                                                <div className="flex flex-col py-3">
                                                    <label className="uppercase text-xs font-semibold text-gray-700 mb-2">
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
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {/* Tombol Tambah Data Terukur */}
                <ButtonSky
                    type="button"
                    onClick={handleTambahDataDukung}
                    className="flex items-center justify-center gap-1 ml-4 my-2"
                >
                    <TbPlus size={12} /> Tambah Data Dukung
                </ButtonSky>
            </>
        );
    };

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[90%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{jenis} Isu Strategis</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_bidang_urusan"
                            >
                                Bidang Urusan:
                                {errors.kode_bidang_urusan ?
                                    <span className="text-red-500">{errors.kode_bidang_urusan.message}</span>
                                    :
                                    <span className="text-slate-500 font-thin italic ml-1">Bidang Urusan diambil dari master opd bidang urusan</span>
                                }
                            </label>
                            <Controller
                                name="kode_bidang_urusan"
                                control={control}
                                rules={{ required: "wajib diisi" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="kode_bidang_urusan"
                                        options={BidangUrusanOption}
                                        isLoading={LoadingOption}
                                        onMenuOpen={() => {
                                            if (BidangUrusanOption.length == 0) {
                                                fetchBidangUrusanOption();
                                            } else {
                                                null
                                            }
                                        }}
                                        placeholder="Pilih Bidang Urusan"
                                        noOptionsMessage={() => `bidang urusan kosong, tambahkan di data master opd`}
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                borderColor: 'black',
                                                '&:hover': {
                                                    borderColor: '#3673CA',
                                                },
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="isu_strategis"
                            >
                                Isu Strategis:
                            </label>
                            <Controller
                                name="isu_strategis"
                                rules={{ required: "Isu Strategis Wajib Diisi" }}
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <>
                                            <textarea
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                id="isu_strategis"
                                                placeholder="masukkan Isu Strategis"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                }}
                                            />
                                            {errors.isu_strategis ?
                                                <p className="text-red-400 text-sm italic">*Isu Strategis Wajib Terisi</p>
                                                :
                                                <></>
                                            }
                                        </>
                                    )
                                }}
                            />
                        </div>
                        {/* PERMASALAHAN ARRAY */}
                        {PermasalahanField.map((field, index) => (
                            <div key={index} className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
                                <Controller
                                    name={`permasalahan_opd.${index}.id_permasalahan`}
                                    control={control}
                                    defaultValue={field.id_permasalahan}
                                    render={({ field }) => (
                                        <div className="flex flex-col py-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="flex uppercase text-xs font-bold text-gray-700 items-center">
                                                    Permasalahan ke {index + 1} :
                                                </label>
                                                {index >= 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => PermasalahanRemove(index)}
                                                        className="border border-red-500 text-red-500 rounded-full p-1 hover:bg-red-500 hover:text-white"
                                                    >
                                                        <TbTrash />
                                                    </button>
                                                )}
                                            </div>
                                            <Select
                                                {...field}
                                                id={`permasalahan_opd.${index}.id_permasalahan`}
                                                options={PermasalahanOption}
                                                placeholder="pilih permasalahan"
                                                isLoading={LoadingOption}
                                                noOptionsMessage={() => `Permasalahan Terpilih kosong, pilih permasalahan di menu renstra/permasalahan`}
                                                onMenuOpen={() => {
                                                    if (PermasalahanOption.length === 0) {
                                                        fetchPermasalahanOption()
                                                    } else {
                                                        null
                                                    }
                                                }}
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderRadius: '8px',
                                                        borderColor: 'black',
                                                        '&:hover': {
                                                            borderColor: '#3673CA',
                                                        },
                                                    }),
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                                <DataTerukurList control={control} permasalahan_index={index} />
                            </div>
                        ))}
                        <ButtonSkyBorder
                            className="flex items-center gap-1 mb-3 mt-2 w-full"
                            type="button"
                            onClick={handleTambahPermasalahan}
                        >
                            <TbCirclePlus />
                            Tambah Pemasalahan
                        </ButtonSkyBorder>
                        <div className="flex flex-col gap-2 my-3">
                            <ButtonSky className="w-full" type="submit" disabled={Proses}>
                                {Proses ?
                                    <span className="flex items-center gap-1">
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
                            <ButtonRed className="w-full flex items-center gap-1" onClick={handleClose}>
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