import { OptionTypeString } from "@/types";

export interface GetResponseFindallJabatan {
    id: string;
    kode_jabatan: string;
    nama_jabatan: string;
    operasional_daerah: {
        kode_opd: string;
    };
    kelas_jabatan: string;
    jenis_jabatan: string;
    nilai_jabatan: number;
    index_jabatan: number;
    tahun: string;
    esselon: string;
}

export interface FormValue {
    id: string;
    kode_opd: OptionTypeString | null;
    nama_jabatan: string;
    kode_jabatan: string;
}