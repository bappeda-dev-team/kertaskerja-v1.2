export interface GetResponseFindallProgramUnggulan {
  id: number;
  kode_program_unggulan: string;
  nama_program_unggulan: string;
  rencana_implementasi: string;
  keterangan: string;
  tahun_awal: string;
  tahun_akhir: string;
  is_active: boolean;
}

export interface FormValue {
    nama_program_unggulan: string,
    rencana_implementasi: string,
    keterangan: string,
    tahun_awal: string,
    tahun_akhir: string,
}