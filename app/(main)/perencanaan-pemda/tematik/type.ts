export interface GetResponseTematik {
    data: GetResponseTematik | null;
    status: string;
    code: number;
}

export interface GetResponseTematiks {
    tahun: string;
    tematiks: Tematiks[];
}

export interface Tematiks {
    id: number;
    parent: number | null;
    tema: string;
    jenis_pohon: string;
    level_pohon: number;
    keterangan: string;
    jumlah_review: number;
    is_active: boolean;
    tagging: string[];
    indikator: Indikator[];
}

export interface Indikator {
    id_indikator?: string;
    id_pokin?: string;
    nama_indikator: string;
    targets: Target[];
}

export interface Target {
    id_target?: string;
    indikator_id?: string;
    target: string;
    satuan: string;
}

export interface FormValue {
    id: number;
    nama_pohon: string;
    jenis_pohon: string;
    keterangan: string;
    tahun: string;
    indikator: Indikator[];
}