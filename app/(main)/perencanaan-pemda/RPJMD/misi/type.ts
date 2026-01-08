import { GetResponseFindAllVisi } from "../visi/type";
import { OptionType } from "@/types";

export interface GetResponseFindallMisi {
    id: number;
    id_visi: number;
    visi: string;
    misi_pemda: Misi[];
}

export interface Misi {
    id: number;
    id_visi: number;
    misi: string;
    urutan: number;
    tahun_awal_periode: string;
    tahun_akhir_periode: string;
    jenis_periode: string;
    keterangan: string;
}

export interface FormValue {
    id?: number;
    id_visi: OptionVisi | null;
    misi: string;
    urutan: OptionType | null;
    keterangan: string;
}

export interface OptionVisi extends GetResponseFindAllVisi {
    value: number;
    label: string;
}