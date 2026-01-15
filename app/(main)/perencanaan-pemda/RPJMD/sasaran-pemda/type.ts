
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

export interface Periode {
    tahun_awal: string;
    tahun_akhir: string;
}

export interface SasaranPemda {
    id_sasaran_pemda: number;
    sasaran_pemda: string;
    periode: Periode;
    indikator: Indikator[];
}

export interface SubTematik {
    subtematik_id: number;
    nama_subtematik: string;
    jenis_pohon: string;
    level_pohon: number;
    is_active: boolean;
    tahun: string;
    sasaran_pemda: SasaranPemda[];
}

export interface Sasaran {
    tematik_id: number;
    nama_tematik: string;
    tahun: string;
    subtematik: SubTematik[];
}

export interface Periode_Header {
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string[];
}
