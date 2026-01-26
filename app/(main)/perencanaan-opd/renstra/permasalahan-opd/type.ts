export interface GetResponsePermasalahanOpd {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    childs: PermasalahanOpd[];
}

export interface PermasalahanOpd {
    id: number;
    id_permasalahan: number;
    parent: number;
    nama_pohon: string;
    level_pohon: number;
    perangkat_daerah: {
        kode_opd: string;
        nama_opd: string;
    }
    jenis_masalah: string;
    is_permasalahan: boolean;
    permasalahan_terpilih: boolean;
    status_permasalahan?: string;
    childs: PermasalahanOpd[]
}