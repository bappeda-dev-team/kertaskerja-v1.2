'use client'

import { useEffect, useState } from "react";
import { TbDeviceFloppy, TbX } from "react-icons/tb";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { ButtonSky, ButtonRed } from "@/components/ui/button";
import { AlertNotification } from "@/lib/alert";
import { LoadingButton } from "@/lib/loading";
import { apiFetch } from "@/hook/apiFetch";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { FormValue, GetResponseMasterUser, Role } from "../type";
import { OptionType, OptionTypeString } from "@/types";
import { GetResponseRoles } from "../../roles/type";

interface modal {
    jenis: "tambah" | "edit";
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    Data: GetResponseMasterUser | null;
    kode_opd: string;
}

export const ModalMasterUser: React.FC<modal> = ({ isOpen, onClose, onSuccess, jenis, Data, kode_opd }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValue>({
        defaultValues: {
            nip: {
                value: Data?.nip,
                label: Data?.nip,
            },
            email: Data?.email,
            password: '',
            is_active: {
                value: Data?.is_active,
                label: Data?.is_active ? "Aktif" : "Tidak Aktif",
            },
            role: {
                value: Data?.role[0].id,
                label: Data?.role[0].role,
            }
        }
    });

    const [LoadingRole, setLoadingRole] = useState<boolean>(false);
    const [LoadingPegawai, setLoadingPegawai] = useState<boolean>(false);
    const [RoleOption, setRoleOption] = useState<OptionType[]>([]);
    const [PegawaiOption, setPegawaiOption] = useState<OptionTypeString[]>([]);
    const [Proses, setProses] = useState<boolean>(false);
    const { branding } = useBrandingContext();

    const handleClose = () => {
        onClose();
        reset();
    }

    useEffect(() => {
        const fetchRole = async () => {
            try {
                setLoadingRole(true);
                await apiFetch(`${branding?.api_perencanaan}/role/findall`, {
                }).then((resp: any) => {
                    // console.log("option role", resp)
                    const data = resp.data;
                    if (data.length > 0) {
                        const role = data.map((r: GetResponseRoles) => ({
                            value: r.id,
                            label: r.role
                        }))
                        setRoleOption(role);
                    } else {
                        setRoleOption([]);
                    }
                }).catch(err => {
                    AlertNotification("Gagal", `${err}`, "error", 3000, true);
                })
            } catch (err) {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                console.log(err)
            } finally {
                setLoadingRole(false);
            }
        };
        const fetchPegawai = async () => {
            try {
                setLoadingRole(true);
                await apiFetch(`${branding?.api_perencanaan}/pegawai/findall?kode_opd=${kode_opd}`, {
                }).then((resp: any) => {
                    // console.log("option pegawai", resp)
                    const data = resp.data;
                    if (data.length > 0) {
                        const pegawai = data.map((item: any) => ({
                            value: item.nip,
                            label: item.nama_pegawai,
                        }));
                        setPegawaiOption(pegawai);
                    } else {
                        setPegawaiOption([]);
                    }
                }).catch(err => {
                    AlertNotification("Gagal", `${err}`, "error", 3000, true);
                })
            } catch (err) {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                console.log(err)
            } finally {
                setLoadingRole(false);
            }
        };
        fetchRole();
        if (jenis === "tambah") {
            fetchPegawai();
        }
    }, [branding, kode_opd])

    const activeOptions = [
        { label: "Aktif", value: true },
        { label: "Tidak Aktif", value: false },
    ];

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            nip: data.nip?.value,
            email: data.email,
            password: data.password,
            is_active: data.is_active?.value,
            role: [{
                role_id: data.role?.value
            }],
        };
        // console.log(formData);
        try {
            setProses(true);
            await apiFetch(jenis === "tambah" ? `${branding?.api_perencanaan}/user/create` : `${branding?.api_perencanaan}/user/update/${Data?.id}`, {
                method: jenis === "tambah" ? "POST" : "PUT",
                body: formData as any
            }).then(_ => {
                AlertNotification("Berhasil", "Berhasil Menyimpan Data User", "success", 3000, true);
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
                            <h1 className="text-xl font-semibold uppercase text-center">{jenis} User</h1>
                        </div>
                        {jenis === "tambah" ?
                            <Controller
                                name="nip"
                                rules={{ required: "" }}
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <>
                                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                                Pegawai (dari datamaster pegawai) : {errors.nip && <span className="text-red-400 italic">wajib terisi</span>}
                                            </label>
                                            <Select
                                                {...field}
                                                id="role"
                                                options={PegawaiOption}
                                                menuPosition="fixed"
                                                isLoading={LoadingPegawai}
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderRadius: '8px',
                                                        borderColor: 'black',
                                                    }),
                                                    menuPortal: (base) => ({
                                                        ...base, zIndex: 999
                                                    })
                                                }}
                                            />
                                        </>
                                    )
                                }}
                            />
                            :
                            <>
                                <table className="w-full mt-3">
                                    <tbody>
                                        <tr>
                                            <td className="bg-slate-300 p-2 w-[150px] rounded-tl-lg border-b border-r border-white">Nama Pegawai</td>
                                            <td className="bg-slate-300 p-2 rounded-tr-lg border-b border-white">{Data?.nama_pegawai ?? "-"}</td>
                                        </tr>
                                        <tr>
                                            <td className="bg-slate-300 p-2 rounded-bl-lg border-r border-white">NIP</td>
                                            <td className="bg-slate-300 p-2 rounded-br-lg">{Data?.nip ?? "-"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Controller
                                    name="is_active"
                                    rules={{ required: "" }}
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <>
                                                <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                                    Status Pegawai (Aktif / Non Aktif) : {errors.is_active && <span className="text-red-400 italic">wajib terisi</span>}
                                                </label>
                                                <Select
                                                    {...field}
                                                    id="is_active"
                                                    options={activeOptions}
                                                    menuPosition="fixed"
                                                    isLoading={LoadingPegawai}
                                                    styles={{
                                                        control: (baseStyles) => ({
                                                            ...baseStyles,
                                                            borderRadius: '8px',
                                                            borderColor: 'black',
                                                        }),
                                                        menuPortal: (base) => ({
                                                            ...base, zIndex: 999
                                                        })
                                                    }}
                                                />
                                            </>
                                        )
                                    }}
                                />
                            </>
                        }
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: "" }}
                            render={({ field }) => {
                                return (
                                    <>
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Email : {errors.email && <span className="text-red-400 italic">wajib terisi</span>}
                                        </label>
                                        <input
                                            {...field}
                                            id="email"
                                            type="text"
                                            className="border px-4 py-2 rounded-lg"
                                            placeholder="masukkan Email"
                                        />
                                    </>
                                )
                            }}
                        />
                        {jenis === "tambah" &&
                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: "" }}
                                render={({ field }) => {
                                    return (
                                        <>
                                            <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                                Password : {errors.password && <span className="text-red-400 italic">wajib terisi</span>}
                                            </label>
                                            <input
                                                {...field}
                                                id="password"
                                                type="text"
                                                className="border px-4 py-2 rounded-lg"
                                                placeholder="masukkan Password"
                                            />
                                        </>
                                    )
                                }}
                            />
                        }
                        <Controller
                            name="role"
                            rules={{ required: "" }}
                            control={control}
                            render={({ field }) => {
                                return (
                                    <>
                                        <label className="uppercase text-xs font-bold text-gray-700 my-2">
                                            Role : {errors.role && <span className="text-red-400 italic">wajib terisi</span>}
                                        </label>
                                        <Select
                                            {...field}
                                            id="role"
                                            options={RoleOption}
                                            menuPosition="fixed"
                                            isLoading={LoadingRole}
                                            styles={{
                                                control: (baseStyles) => ({
                                                    ...baseStyles,
                                                    borderRadius: '8px',
                                                    borderColor: 'black',
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base, zIndex: 999
                                                })
                                            }}
                                        />
                                    </>
                                )
                            }}
                        />
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
                            <ButtonRed type="button" className="flex items-center gap-1 w-full" onClick={handleClose} disabled={Proses}>
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