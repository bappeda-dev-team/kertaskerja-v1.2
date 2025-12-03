export interface GetResponseListOpdTematik {
    data: Tematik[];
    status: string;
    code: number;
}

export interface Tematik {
    tematik: string;
    level_pohon: number;
    tahun: string;
    is_active: boolean;
    list_opd: OPD[];
}
export interface OPD {
    kode_opd: string;
    perangkat_daerah: string;
}