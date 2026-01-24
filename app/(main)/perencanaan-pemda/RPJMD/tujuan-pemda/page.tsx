'use client'

import Table from './comp/Table';
import { useState, useEffect } from 'react';
import { GetResponseFindallPeriode } from '@/app/(main)/datamaster/periode/type';
import { GetResponseGlobal } from '@/types';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { Breadcrumbs } from '@/components/ui/breadcrumb';
import { apiFetch } from '@/hook/apiFetch';
import { AlertNotification } from '@/lib/alert';
import { Card, HeaderCard } from '@/components/ui/Card';
import { getPeriode, setCookie } from '@/lib/cookie';
import Select from 'react-select';

const TujuanPemda = () => {

    const menu = [
        { label: "Perencanaan Pemda", href: "/" },
        { label: "RPJMD", href: "/perencanaan-pemda/RPJMD/tujuan-pemda" },
        { label: "Tujuan Pemda", href: "/perencanaan-pemda/RPJMD/tujuan-pemda", active: true }
    ]

    const { branding } = useBrandingContext();

    const [Periode, setPeriode] = useState<GetResponseFindallPeriode | null>(null);
    const [OptionPeriode, setOptionPeriode] = useState<GetResponseFindallPeriode[]>([]);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);

    useEffect(() => {
        const fetchPeriode = getPeriode();
        if (fetchPeriode.periode) {
            const data = {
                value: fetchPeriode.periode.value,
                label: fetchPeriode.periode.label,
                id: fetchPeriode.periode.value,
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

    return (
        <>
            <Breadcrumbs items={menu} />
            <Card>
                <HeaderCard>
                    <div className="flex flex-wrap items-center justify-between gap-5 w-full">
                        <h1 className="font-bold text-lg uppercase">Tujuan Pemda ({Periode?.tahun_awal} - {Periode?.tahun_akhir})</h1>
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
                </HeaderCard>
                <Table Periode={Periode ?? null} />
            </Card>
        </>
    )
}

export default TujuanPemda;