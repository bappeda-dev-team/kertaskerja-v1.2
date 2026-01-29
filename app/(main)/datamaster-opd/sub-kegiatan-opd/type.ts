export interface GetResponseFindallSubKegiatanOpd {
    id: number;
    kode_subkegiatan: string;
    nama_subkegiatan: string;
    kode_opd: string;
    nama_opd: string;
    tahun: string;
}

export interface FormValue {
    kode_subkegiatan: string;
    kode_opd: string;
    review: string;
    keterangan: string;
}