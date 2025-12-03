export interface Target {
    id_target: string;
    indikator_id: string;
    target: string;
    satuan: string;
}

export interface IndikatorSubKegiatan {
    id_indikator: string;
    kode_subkegiatan: string;
    kode_opd: string;
    nama_indikator: string;
    targets: Target[];
}
export interface IndikatorRencanaKinerja {
    id_indikator: string;
    rencana_kinerja_id: string;
    nama_indikator: string;
    targets: Target[];
}

export interface RencanaAksi {
    renaksi_id: string;
    renaksi: string;
    anggaran: number;
}

export interface RincianBelanja {
    index: string;
    rencana_kinerja_id: string;
    rencana_kinerja: string;
    pegawai_id: string | null;
    nama_pegawai: string | null;
    indikator: IndikatorRencanaKinerja[];
    total_anggaran: number;
    rencana_aksi: RencanaAksi[] | null;
}

export interface GetResponseLaporanRincianBelanja {
    kode_opd: string;
    kode_subkegiatan: string;
    nama_subkegiatan: string;
    indikator_subkegiatan: IndikatorSubKegiatan[];
    total_anggaran: number;
    rincian_belanja: RincianBelanja[];
}