import { GetResponseFindallPeriode } from "@/app/(main)/datamaster/periode/type";

export interface GetResponseFindallTujuanOpd {
    kode_urusan: string;
    urusan: string;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    kode_opd: string;
    nama_opd: string;
    tujuan_opd: TujuanOpd[];
}

export interface TujuanOpd {
    id_tujuan_opd: number;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    kode_opd?: string;
    nama_opd?: string;
    tujuan: string;
    periode: GetResponseFindallPeriode;
    tahun_awal?: string;
    tahun_akhir?: string;
    jenis_periode?: string;
    indikator: Indikator[];
}

export interface Indikator {
    id?: string;
    id_indikator?: string;
    id_tujuan_opd?: number;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

export interface Target {
    id?: string;
    id_indikator?: string;
    target: string;
    satuan: string;
    tahun?: string;
}

export interface FormValue {
    id: number;
    kode_opd: string;
    kode_bidang_urusan: string;
    tujuan: string;
    periode_id: Periode;
    indikator: Indikator[];
}

export interface Periode extends GetResponseFindallPeriode {
    value: number;
    label: string;
}