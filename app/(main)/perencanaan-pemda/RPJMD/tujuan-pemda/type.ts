export interface GetResponseFindallTujuanPemda {
    pokin_id: number;
    nama_tematik: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan: string;
    tahun_pokin: string;
    is_active: boolean;
    tujuan_pemda: TujuanPemda[];
}

export interface TujuanPemda {
    id: number;
    tujuan_pemda: string;
    periode: {
        tahun_awal: string;
        tahun_akhir: string;
    }
    visi: string;
    misi: string;
    indikator: Indikator[];
}

export interface Indikator {
    id: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: Target[];
}

export interface Target {
    id: string;
    target: string;
    satuan: string;
    tahun: string;
}