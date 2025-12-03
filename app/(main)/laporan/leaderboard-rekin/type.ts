export interface GetResponseLeaderboardRekin {
    data: Pokin[];
    status: string;
    code: number;
}

export interface Pokin {
    kode_opd: string;
    nama_opd: string;
    tematik: Tematik[];
    persentase_cascading: string;
}
export interface Tematik {
    nama: string;
}