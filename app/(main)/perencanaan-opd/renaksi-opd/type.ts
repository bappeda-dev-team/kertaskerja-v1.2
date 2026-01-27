export interface GetResponseFindallRenaksiOpd {
    id: number;
    nama_sasaran_opd: string;
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    indikator: IndikatorSasaranOpd[];
}

export interface IndikatorSasaranOpd {
    id: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: {
        id: string;
        indikator_id: string;
        tahun: string;
        target: string;
        satuan: string;
    }
}

export interface RencanaKinerja {
    id_renaksiopd: number;
    rekin_id: string;
    nama_rencana_kinerja: string;
    nip_pegawai: string;
    nama_pegawai: string;
    kode_opd: string;
    tw1: number;
    tw2: number;
    tw3: number;
    tw4: number;
    keterangan: string;
    total_anggaran: number;
    subkegiatan: SubKegiatan[];
}

export interface SubKegiatan {
    kode_subkegiatan: string;
    nama_subkegiatan: string;
    indikator: {
        id: string;
        indikator: string;
        target: string;
        satuan: string;
    };
}

export interface Rekin {
    sasaran_opd_id: number;
    nama_sasaran_opd: string;
    tahun_renaksi: string;
    rencana_kinerja: RencanaKinerja[];
}