export interface GetResponseFindallIkuOpd {
    indikator_id: string;
    asal_iku: string;
    sumber: string;
    is_active: boolean;
    iku_active: boolean;
    rumus_perhitungan: string;
    sumber_data: string;
    indikator: string;
    created_at: string;
    target: Target[];
}

export interface Target {
    target: string;
    satuan: string;
}