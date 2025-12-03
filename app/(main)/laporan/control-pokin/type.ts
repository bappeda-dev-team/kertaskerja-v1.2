export interface GetResponseControlPokin {
    data: Pokin;
    status: string;
    code: number;
}

export interface PokinLevel {
    jumlah_pelaksana: number;
    jumlah_pokin: number;
    jumlah_pokin_ada_pelaksana: number;
    jumlah_pokin_ada_rekin: number;
    jumlah_pokin_tanpa_pelaksana: number;
    jumlah_pokin_tanpa_rekin: number;
    jumlah_rencana_kinerja: number;
    level_pohon: number;
    nama_level: string;
    persentase: string;
    persentase_cascading: string;
}

export interface PokinTotal {
    persentase: string;
    persentase_cascading: string;
    total_pelaksana: number;
    total_pokin: number;
    total_pokin_ada_pelaksana: number;
    total_pokin_ada_rekin: number;
    total_pokin_tanpa_pelaksana: number;
    total_pokin_tanpa_rekin: number;
    total_rencana_kinerja: number;
}

export interface Pokin {
    data: PokinLevel[] | null;
    total: PokinTotal;
}