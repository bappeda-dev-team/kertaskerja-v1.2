export interface GetResponseFindallMatrixRenstra {
    kode_opd: string
    tahun_awal: string;
    tahun_akhir: string;
    pagu_total: Pagu[];
    urusan: Renstra[];
}
export interface Pagu {
    tahun: string;
    pagu_indikatif: number;
}

export interface Renstra {
    nama: string;
    kode: string;
    jenis: string;
    indikator: Indikator[];
    bidang_urusan?: Renstra[];
    program?: Renstra[]
    kegiatan?: Renstra[]
    subkegiatan?: Renstra[]
}

export interface Indikator {
    id: string;
    kode: string;
    kode_opd: string;
    indikator: string;
    pagu_anggaran: number;
    tahun: string;
    target: Target[];
}
export interface Target {
    id: string;
    indikator_id: string;
    target: string;
    satuan: string;
}