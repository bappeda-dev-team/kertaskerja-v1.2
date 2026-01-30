export interface Target {
    id: string;
    indikator_id: string;
    tahun: string;
    target: string;
    satuan: string;
}

export interface Indikator {
    id: string;
    id_tujuan_opd: number;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

export interface TujuanOpd {
    id_tujuan_opd: number;
    tujuan: string;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    indikator: Indikator[];
}

export interface GetResponseRenjaTujuanOpd {
    kode_urusan: string;
    urusan: string;
    kode_bidang_urusan: string;
    nama_bidang_urusan: string;
    kode_opd: string;
    nama_opd: string;
    tujuan_opd: TujuanOpd[];
}