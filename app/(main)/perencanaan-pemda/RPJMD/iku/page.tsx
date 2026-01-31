'use client'

import Table from './comp/Table';
import { Breadcrumbs } from '@/components/ui/breadcrumb';
import Select from 'react-select';
import { getPeriode } from '@/lib/cookie';
import { useState, useEffect } from 'react';
import { GetResponseFindallPeriode } from '@/app/(main)/datamaster/periode/type';
import { GetResponseGlobal } from '@/types';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { apiFetch } from '@/hook/apiFetch';
import { AlertNotification } from '@/lib/alert';
import { setCookie } from '@/lib/cookie';
import { Card, HeaderCard } from '@/components/ui/Card';

const Misi = () => {

    const menu = [
        { label: "Perencanaan Pemda", href: "/" },
        { label: "RPJMD", href: "/perencanaan-pemda/RPJMD/iku" },
        { label: "IKU", href: "/perencanaan-pemda/RPJMD/iku", active: true }
    ]

    const { branding } = useBrandingContext();

    const [Periode, setPeriode] = useState<GetResponseFindallPeriode | null>(null);
    const [PeriodeOption, setPeriodeOption] = useState<GetResponseFindallPeriode[]>([]);

    const [Loading, setLoading] = useState<boolean>(false);


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
        setLoading(true);
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
                setPeriodeOption(periode);
            } else {
                setPeriodeOption([]);
            }
        }).catch(err => {
            AlertNotification("Gagal", `${err}`, "error", 3000, true);
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <>
            <Breadcrumbs items={menu} />
            <Card>
                <HeaderCard>
                    <div className="flex flex-wrap items-end">
                        <h1 className="uppercase font-bold">Indikator Utama Pemda</h1>
                        <h1 className="uppercase font-bold ml-1">(Periode {Periode?.tahun_awal} - {Periode?.tahun_akhir})</h1>
                    </div>
                    <Select
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderRadius: '8px',
                                minWidth: '200.562px',
                                minHeight: '38px'
                            })
                        }}
                        onChange={(option) => {
                            setPeriode(option);
                            setCookie("periode", JSON.stringify(option));
                        }}
                        options={PeriodeOption}
                        isLoading={Loading}
                        isClearable
                        placeholder="Pilih Periode ..."
                        value={Periode}
                        isSearchable
                        onMenuOpen={() => {
                            getOptionPeriode();
                        }}
                    />
                </HeaderCard>
                {Periode ?
                    <Table
                        id_periode={Periode?.id}
                        tahun_awal={Periode?.tahun_awal ? Periode?.tahun_awal : ""}
                        tahun_akhir={Periode?.tahun_akhir ? Periode?.tahun_akhir : ""}
                        jenis={Periode?.jenis_periode ? Periode?.jenis_periode : ""}
                        tahun_list={Periode?.tahun_list ? Periode?.tahun_list : []}
                    />
                    :
                    <div className="m-5">
                        <h1>Pilih Periode terlebih dahulu</h1>
                    </div>
                }
            </Card>
        </>
    )
}

export default Misi;