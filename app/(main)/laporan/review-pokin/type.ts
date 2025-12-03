export interface GetResponseFindallReviewPemda {
    id_tematik: number;
    nama_pohon: string;
    level_pohon: string;
    review: Review[];
}

export interface Review {
    id_pohon: number;
    parent: number;
    nama_pohon: string;
    level_pohon: number;
    jenis_pohon: string;
    review: string;
    keterangan: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}