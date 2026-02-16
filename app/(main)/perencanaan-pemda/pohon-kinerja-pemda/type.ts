import { OptionType, OptionTypeString } from "@/types";

export interface FormValue {
    id: number;
    parent: string;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: OptionTypeString;
    status: string;
    kode_opd: OptionTypeString | null;
    pelaksana: OptionTypeString[];
    pohon?: OptionType;
    indikator: indikator[];
    tagging: Tagging[];
}
export interface Tagging {
    nama_tagging: string;
    keterangan_tagging_program: KeteranganTaggingProgram[];
}
export interface KeteranganTaggingProgram {
    kode_program_unggulan: OptionTypeString | null;
    tahun: string;
}
export interface indikator {
    nama_indikator: string;
    targets: target[];
}
export type target = {
    target: string;
    satuan: string;
};