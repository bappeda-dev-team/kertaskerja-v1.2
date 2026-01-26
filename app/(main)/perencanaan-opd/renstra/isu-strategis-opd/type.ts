export interface IsuStrategis {
    created_at: string;
    id: number;
    isu_strategis: string;
    kode_bidang_urusan: string;
    kode_opd: string;
    nama_bidang_urusan: string;
    nama_opd: string;
    permasalahan_opd: PermasalahanOpd[];
    tahun_akhir: string;
    tahun_awal: string;
}

export interface PermasalahanOpd {
    data_dukung: DataDukung[];
    id: number;
    jenis_masalah: string;
    level_pohon: number;
    masalah: string;
}

export interface Permasalahan {
    id?: number;
    data_dukung: DataDukung;
}
export interface DataDukung {
    data_dukung: string;
    id?: number;
    jumlah_data: TargetJumlahData[];
    narasi_data_dukung: string;
    permasalahan_opd_id?: number;
}

export interface TargetJumlahData {
    id?: number;
    id_data_dukung?: number;
    tahun: string;
    jumlah_data: number;
    satuan: string;
}