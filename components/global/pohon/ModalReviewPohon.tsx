'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/ui/button';
import { AlertNotification } from "@/lib/alert";
import { LoadingClip, LoadingButton } from "@/lib/loading";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    id?: number | null;
    idPohon: number;
    jenis?: "tambah" | "edit";
    pokin: "pemda" | "opd";
    onSuccess: () => void;
}

interface FormValue {
    id: number;
    id_pohon_kinerja: number;
    review: string;
    keterangan: string;
}

export const ModalReview: React.FC<ModalProps> = ({ isOpen, onClose, id, jenis, idPohon, onSuccess, pokin }) => {

    const { branding } = useBrandingContext();
    const { control, handleSubmit, reset } = useForm<FormValue>();

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);

    useEffect(() => {
        const fetchDetailReview = async () => {
            setIsLoading(true);
            if (!id) return;
            await apiFetch<any>(`${branding?.api_perencanaan}/review_pokin/detail/${id}`, {
                method: "GET",
            }).then((resp) => {
                const data = resp.data;
                if (resp.code === 200) {
                    reset({
                        review: data.review || '',
                        keterangan: data.keterangan || '',
                    });
                } else {
                    alert("gagal mengambil data review");
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            }).finally(() => {
                setIsLoading(false);
            })
        };

        if ((jenis === 'edit') && isOpen) {
            fetchDetailReview();
        } else {
            reset({ review: '', keterangan: '' });
        }
    }, [id, isOpen, jenis, reset]);

    const handleClose = () => {
        reset({ review: '', keterangan: '' });
        onClose();
    };

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        let endpoint = "";
        if (jenis === "edit") {
            endpoint = `${branding?.api_perencanaan}/review_pokin/update/${id}`;
        } else if (jenis === "tambah") {
            endpoint = `${branding?.api_perencanaan}/review_pokin/create/${idPohon}`;
        } else {
            endpoint = '';
        }
        const formData = {
            //key : value
            id_pohon_kinerja: idPohon,
            review: data.review,
            keterangan: data.keterangan,
            jenis_pokin: pokin === "pemda" ? "pokin_pemda" : "pokin_opd",
        };
        // console.log(formData);
        // console.log("endpoint", endpoint);
        try {
            setProses(true);
            await apiFetch(endpoint, {
                method: jenis === "tambah" ? "POST" : "PUT",
                body: formData as any
            }).then(_ => {
                AlertNotification("Berhasil", "Berhasil Menyimpan Data Review", "success", 3000, true);
                onSuccess();
                handleClose();
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
            })
        } catch (err) {
            AlertNotification("Gagal", "Cek koneksi internet / terdapat kesalahan pada server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
            <div className="bg-white rounded-lg p-8 z-10 w-3/5 text-start">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-max-[500px] py-2 border-b font-bold text-center">
                        {jenis === 'tambah' ? "Tambah Review" : "Edit Review"} id : {id} pohon: {idPohon ? idPohon : ""}
                    </div>

                    {IsLoading ?
                        <LoadingClip />
                        :
                        <>
                            <div className="flex flex-col py-3">
                                <label className="uppercase text-xs font-medium text-gray-700 my-2" htmlFor="review">Review</label>
                                <Controller
                                    name="review"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="review"
                                            placeholder="Masukkan review"
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex flex-col py-3">
                                <label className="uppercase text-xs font-medium text-gray-700 my-2" htmlFor="keterangan">Keterangan</label>
                                <Controller
                                    name="keterangan"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="border px-4 py-2 rounded-lg"
                                            id="keterangan"
                                            placeholder="Masukkan keterangan"
                                        />
                                    )}
                                />
                            </div>

                            <ButtonSky type="submit" className="w-full my-3">
                                {Proses ?
                                    <span className="flex">
                                        <LoadingButton />
                                        {jenis === 'tambah' ? "Menambahkan" : "Menyimpan"}
                                    </span>
                                    :
                                    jenis === 'tambah' ? "Tambah" : "Simpan"
                                }
                            </ButtonSky>
                            <ButtonRed type="button" className="w-full my-3" onClick={handleClose}>
                                Batal
                            </ButtonRed>
                        </>
                    }

                </form>
            </div>
        </div>
    );
};
