export interface Target {
    id: string;
    target: string;
    satuan: string;
    tahun: string;
}

export interface Indikator {
    id: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

export interface Pelaksana {
    id: string;
    pegawai_id: string;
    nip: string;
    nama_pegawai: string;
}

export interface SasaranOpd {
    id: string;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    nama_sasaran_opd: string;
    id_tujuan_opd: number,
    nama_tujuan_opd: string,
    nip: string;
    indikator: Indikator[];
}

export interface GetResponseFindallRenjaSasaranOpd {
    id_pohon: number;
    nama_pohon: string;
    jenis_pohon: string;
    tahun_pohon: string;
    level_pohon: number;
    sasaran_opd: SasaranOpd[];
    pelaksana: Pelaksana[];
}