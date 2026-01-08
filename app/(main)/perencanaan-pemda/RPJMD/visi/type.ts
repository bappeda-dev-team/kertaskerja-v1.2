import { OptionTypeString } from "@/types";
import { GetResponseFindallPeriode } from "@/app/(main)/datamaster/periode/type";

export interface GetResponseFindAllVisi {
    id: number;
    visi: string;
    tahun_awal_periode: string;
    tahun_akhir_periode: string;
    jenis_periode: string;
    keterangan: string;
}

export interface FormValue {
    id?: number;
    visi: string;
    periode: OptionPeriode | null;
    keterangan: string;
}

export interface OptionPeriode extends GetResponseFindallPeriode {
    value: string;
    label: string;
}