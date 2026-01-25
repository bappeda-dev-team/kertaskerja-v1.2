import { OptionType } from "@/types";

export interface Target {
    id?: string;
    target: string;
    satuan: string;
    tahun: string;
}

export interface Indikator {
    id_indikator?: string;
    id?: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

export interface Periode {
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode?: string;
}

export interface SasaranPemda {
    id_sasaran_pemda: number;
    sasaran_pemda: string;
    periode: Periode;
    indikator: Indikator[];
}

export interface SubTematik {
    subtematik_id: number;
    nama_subtematik: string;
    jenis_pohon: string;
    level_pohon: number;
    is_active: boolean;
    tahun: string;
    sasaran_pemda: SasaranPemda[];
}

export interface GetResponseFindallSasaranPemda {
    tematik_id: number;
    nama_tematik: string;
    tahun: string;
    subtematik: SubTematik[];
}

export interface Periode_Header {
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string[];
}

export interface FormValue {
    subtema_id: OptionType;
    tujuan_pemda_id: OptionType;
    sasaran_pemda: string;
    periode_id: number;
    indikator: Indikator[];
}

export interface TujuanPemda {
    id: number;
    tujuan_pemda: string;
    tematik_id: number;
    nama_tematik: string;
    periode: Periode;
}
