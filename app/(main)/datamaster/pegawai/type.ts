import { OptionTypeString } from "@/types";

export interface GetResponseFindallPegawai {
    id: string;
    nama_pegawai: string;
    nip: string;
    kode_opd: string;
    nama_opd: string;
}

export interface FormValue {
    nama_pegawai: string;
    kode_opd: OptionTypeString;
    nip: string;
}