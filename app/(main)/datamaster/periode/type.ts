export interface GetResponseFindallPeriode {
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    tahun_list: string[];
}

export interface FormValue {
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
}