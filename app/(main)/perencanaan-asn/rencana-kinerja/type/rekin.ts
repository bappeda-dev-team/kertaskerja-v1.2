import { OptionType, OptionTypeString } from "@/types";

export interface GetResponseRekin {
    code: number;
    rencana_kinerja: type_rekin[];
    status: string;
}

export interface type_rekin {
    id_rencana_kinerja: string;
    id_pohon: number;
    nama_pohon: string;
    nama_rencana_kinerja: string;
    tahun: string;
    status_rencana_kinerja: string;
    catatan: string;
    operational_daerah: opd[];
    pegawai_id: string;
    nama_pegawai: string;
    indikator: indikator[];
}
export interface indikator {
    id_indikator: string,
    rencana_kinerja_id: string,
    nama_indikator: string,
    targets: target[]
}
export interface target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}
export interface opd {
    kode_opd: string;
    nama_opd: string;
}

export interface pohon {
    value: number;
    label?: string;
    id: number;
    parent: OptionType;
    nama_pohon: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan?: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: string;
    nama_opd: string;
    pelaksana?: OptionTypeString[];
    indikator: indikator[];
    tagging: Tagging[];
}

export interface Tagging {
    nama_tagging: string;
    keterangan_tagging: string;
}