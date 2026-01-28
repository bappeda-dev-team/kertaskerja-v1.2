'use client'

import Table from "@/app/(main)/perencanaan-opd/renstra/tujuan-opd/comp/Table";
import { useState, useEffect } from "react";
import { apiFetch } from "@/hook/apiFetch";
import { GetResponseGlobal } from "@/types";
import { getPeriode, setCookie } from "@/lib/cookie";
import { GetResponseFindallPeriode } from "@/app/(main)/datamaster/periode/type";
import { AlertNotification } from "@/lib/alert";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { OpdNull, TahunNull } from "@/components/ui/OpdTahunNull";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import Select from 'react-select';

const LaporanTujuanOpdPage = () => {

    const menu = [
        { label: "Laporan", href: "/" },
        { label: "Renstra", href: "/" },
        { label: "Tujuan OPD", href: "/laporan/renstra/tujuan-opd", active: true }
    ]

    const { branding } = useBrandingContext();
    const opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;
    const [Periode, setPeriode] = useState<GetResponseFindallPeriode | null>(null);
    const [OptionPeriode, setOptionPeriode] = useState<GetResponseFindallPeriode[]>([]);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);

    useEffect(() => {
        const fetchPeriode = getPeriode();
        if (fetchPeriode.periode) {
            const data = {
                value: fetchPeriode.periode.value,
                label: fetchPeriode.periode.label,
                id: fetchPeriode.periode.id,
                tahun_awal: fetchPeriode.periode.tahun_awal,
                tahun_akhir: fetchPeriode.periode.tahun_akhir,
                jenis_periode: fetchPeriode.periode.jenis_periode,
                tahun_list: fetchPeriode.periode.tahun_list
            }
            setPeriode(data);
        }
    }, []);

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

    if ((branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') && (branding?.opd?.value === undefined || branding?.opd?.value === null)) {
        return (
            <OpdNull />
        )
    } else if (branding?.tahun?.value === undefined || branding?.tahun?.value === null) {
        return (
            <TahunNull />
        )
    }
    else {
        return (
            <>
                <Breadcrumbs items={menu} />
                <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-5 py-5">
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold text-lg uppercase">Tujuan OPD {`(${Periode?.tahun_awal || ""} - ${Periode?.tahun_akhir || ""})`}</h1>
                            {(branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ?
                                <h1 className="text-sm">{branding?.opd?.label || ''}</h1>
                                :
                                <h1 className="text-sm">{branding?.user?.nama_opd || ''}</h1>
                            }
                        </div>
                        <Select
                            styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    minWidth: '190px',
                                    minHeight: '38px'
                                })
                            }}
                            isClearable
                            options={OptionPeriode}
                            isLoading={LoadingOption}
                            onMenuOpen={() => {
                                if (OptionPeriode.length === 0) {
                                    getOptionPeriode();
                                }
                            }}
                            onChange={(option) => {
                                setPeriode(option);
                                setCookie("periode", JSON.stringify(option));
                            }}
                            placeholder="pilih Periode"
                            value={Periode}
                            isSearchable
                        />
                    </div>
                    <div className="flex m-2">
                        {Periode ?
                            <div className="w-full">
                                <Table 
                                    kode_opd={opd}
                                    id_periode={Periode?.id}
                                    jenis_periode={Periode?.jenis_periode}
                                    tahun_akhir={Periode?.tahun_akhir}
                                    tahun_awal={Periode?.tahun_awal}
                                    tahun_list={Periode?.tahun_list}
                                    tipe="laporan"
                                />
                            </div>
                            :
                            <h1 className="p-5">Pilih Periode Terlebih Dahulu</h1>
                        }
                    </div>
                </div>
            </>
        )
    }

}

export default LaporanTujuanOpdPage;